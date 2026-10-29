// Kitchen floor overlay for the Matterport Bundle SDK Scene API. Unproven: run only through the gated test.
// Uses the bundle's own THREE instance (context.three) so it never mixes with the site's three.js.
import { FLOOR_LIFT_M, type FloorTestConfig } from "@/lib/matterport-floor-test";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FloorOverlay { setTexture(url: string): Promise<void>; reset(): void; dispose(): void }

export async function attachKitchenFloorOverlay(sdk: any, cfg: FloorTestConfig): Promise<FloorOverlay> {
  let api: { setTexture(url: string): Promise<void>; show(v: boolean): void } | null = null;
  const name = "oakline.kitchenFloor";

  await sdk.Scene.register(name, () => ({
    inputs: { visible: false },
    onInit(this: any) {
      const THREE = this.context.three;
      const shape = new THREE.Shape(cfg.outline.map((p) => new THREE.Vector2(p.x, -p.z)));
      for (const h of cfg.holes) shape.holes.push(new THREE.Path(h.map((p) => new THREE.Vector2(p.x, -p.z))));
      const geo = new THREE.ShapeGeometry(shape);
      geo.rotateX(-Math.PI / 2); // into the floor plane; -z mapping above restores model z
      const uv = geo.attributes.position; const uvs: number[] = [];
      for (let i = 0; i < uv.count; i++) uvs.push(uv.getX(i) / 1.2, uv.getZ(i) / 1.2); // 1.2 m texture repeat
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      // Depth-tested: scanned furniture/cabinet geometry in front still hides the overlay.
      const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.92, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = (cfg.floorY ?? 0) + FLOOR_LIFT_M;
      mesh.visible = false;
      this.outputs.objectRoot = mesh;
      const loader = new THREE.TextureLoader();
      api = {
        setTexture: (url) => new Promise((res, rej) => loader.load(url, (t: any) => {
          t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
          mat.map?.dispose(); mat.map = t; mat.needsUpdate = true; mesh.visible = true; res();
        }, undefined, rej)),
        show: (v) => { mesh.visible = v; },
      };
      this.onDestroy = () => { geo.dispose(); mat.map?.dispose(); mat.dispose(); };
    },
  }));

  const [obj] = await sdk.Scene.createObjects(1);
  const node = obj.addNode();
  node.addComponent(name);
  node.start();

  return {
    setTexture: (url) => api ? api.setTexture(url) : Promise.reject(new Error("overlay not ready")),
    reset: () => api?.show(false), // original captured floor shows again
    dispose: () => { node.stop(); obj.stop?.(); },
  };
}
