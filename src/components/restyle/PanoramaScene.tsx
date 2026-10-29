// WebGL 360° viewer of a real room photograph. Floor and wall finishes are painted over traced
// areas of the photo in a shader, keeping the original light and shadow. Loaded lazily, client only.
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PANO, hexToRgb } from "./restyle-data";

export interface View { yaw: number; pitch: number; fov: number }
interface Props { view: React.MutableRefObject<View>; floorTex: string | null; floorScale: number; wall: string | null; showOriginal: boolean; onReady: () => void; onError: () => void }

const vert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const frag = `
uniform sampler2D base; uniform sampler2D mask; uniform sampler2D floorTex;
uniform float floorOn; uniform float wallOn; uniform float floorAvg; uniform float wallAvg; uniform float scale; uniform vec3 wallColor;
varying vec2 vUv;
void main(){
  vec3 orig = texture2D(base, vUv).rgb; vec4 m = texture2D(mask, vUv); vec3 c = orig;
  float lon = vUv.x * 6.2831853; float lat = (vUv.y - 0.5) * 3.14159265;
  if (floorOn > 0.5 && m.r > 0.004 && lat < -0.03) {
    vec2 p = vec2(cos(lon), sin(lon)) / tan(-lat) * scale;
    vec3 tc = texture2D(floorTex, p).rgb;
    c = mix(c, tc * clamp(m.b / floorAvg, 0.35, 1.9), m.r);
  }
  if (wallOn > 0.5) {
    float lum = dot(orig, vec3(0.299, 0.587, 0.114));
    c = mix(c, min(wallColor * clamp(lum / wallAvg, 0.3, 1.7), vec3(1.0)), m.g);
  }
  gl_FragColor = vec4(c, 1.0);
}`;

function load(url: string, repeat = false) {
  return new Promise<THREE.Texture>((res, rej) => new THREE.TextureLoader().load(url, (t) => {
    t.colorSpace = THREE.NoColorSpace; // composite in photo space; output untouched
    if (repeat) { t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping; t.anisotropy = 8; }
    res(t);
  }, undefined, rej));
}

function Room({ view, floorTex, floorScale, wall, showOriginal, onReady, onError }: Props) {
  const { camera, invalidate } = useThree();
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, side: THREE.DoubleSide, toneMapped: false, depthWrite: false,
    uniforms: { base: { value: null }, mask: { value: null }, floorTex: { value: null }, floorOn: { value: 0 }, wallOn: { value: 0 },
      floorAvg: { value: PANO.floorAvg }, wallAvg: { value: PANO.wallAvg }, scale: { value: 1 }, wallColor: { value: new THREE.Vector3(1, 1, 1) } },
  }), []);
  const geo = useMemo(() => new THREE.SphereGeometry(10, 96, 48), []);
  const texCache = useRef(new Map<string, THREE.Texture>());

  useEffect(() => {
    let live = true;
    Promise.all([load(PANO.url), load(PANO.maskUrl)]).then(([b, m]) => {
      if (!live) return; mat.uniforms.base!.value = b; mat.uniforms.mask!.value = m; invalidate(); onReady();
    }, onError);
    const cache = texCache.current;
    return () => { live = false; geo.dispose(); mat.dispose(); cache.forEach((t) => t.dispose()); (mat.uniforms.base!.value as THREE.Texture | null)?.dispose(); (mat.uniforms.mask!.value as THREE.Texture | null)?.dispose(); };
  }, [mat, geo, invalidate, onReady, onError]);

  useEffect(() => {
    const u = mat.uniforms;
    u.wallOn!.value = wall && !showOriginal ? 1 : 0;
    if (wall) { const [r, g, b] = hexToRgb(wall); (u.wallColor!.value as THREE.Vector3).set(r, g, b); }
    if (!floorTex || showOriginal) { u.floorOn!.value = 0; invalidate(); return; }
    const hit = texCache.current.get(floorTex);
    const apply = (t: THREE.Texture) => { u.floorTex!.value = t; u.scale!.value = floorScale; u.floorOn!.value = 1; invalidate(); };
    if (hit) apply(hit); else load(floorTex, true).then((t) => { texCache.current.set(floorTex, t); apply(t); }, () => { u.floorOn!.value = 0; invalidate(); });
  }, [floorTex, floorScale, wall, showOriginal, mat, invalidate]);

  useFrame(() => {
    const { yaw, pitch, fov } = view.current;
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    cam.lookAt(Math.cos(yaw) * Math.cos(pitch), Math.sin(pitch), Math.sin(yaw) * Math.cos(pitch));
  });

  return <mesh geometry={geo} material={mat} scale={[-1, 1, 1]} />;
}

export default function PanoramaScene(p: Props & { invalidateRef: React.MutableRefObject<(() => void) | null> }) {
  const { invalidateRef, ...rest } = p;
  return (
    <Canvas frameloop="demand" dpr={[1, 1.75]} camera={{ fov: 75, near: 0.1, far: 50, position: [0, 0, 0] }} gl={{ antialias: true, preserveDrawingBuffer: false }}
      onCreated={(s) => { invalidateRef.current = () => s.invalidate(); s.gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); rest.onError(); }); }}>
      <Room {...rest} />
    </Canvas>
  );
}
