import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ROOMS, type RoomId } from "@/lib/rooms";

const S = 56;
const PAD = 24;
const X = (x: number) => PAD + (x + 4) * S;
const Z = (z: number) => PAD + (z + 3) * S;
const ft = (m: number) => Math.round(m * 3.28);

export function FloorPlan({ selected, onSelect }: { selected: RoomId | null; onSelect: (id: RoomId) => void }) {
  return (
    <div className="flex h-full min-h-[300px] w-full flex-col bg-card">
      <TransformWrapper minScale={0.8} maxScale={4} initialScale={1} centerOnInit wheel={{ step: 0.08 }} doubleClick={{ disabled: true }}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="flex justify-end gap-1 border-b border-border p-1.5">
              <button type="button" className="btn btn-line bg-card px-3" onClick={() => zoomIn()} aria-label="Zoom in on plan">+</button>
              <button type="button" className="btn btn-line bg-card px-3" onClick={() => zoomOut()} aria-label="Zoom out on plan">−</button>
              <button type="button" className="btn btn-line bg-card" onClick={() => resetTransform()}>Reset plan</button>
            </div>
            <TransformComponent wrapperStyle={{ width: "100%", flex: 1, minHeight: 240 }} contentStyle={{ width: "100%", height: "100%" }}>
              <svg viewBox={`0 0 ${8 * S + PAD * 2} ${7 * S + PAD * 2}`} className="h-full w-full" role="group" aria-label="Floor plan. Select a room.">
                <defs>
                  <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="var(--brass)" strokeWidth="1.5" />
                  </pattern>
                </defs>
                {ROOMS.map((r) => {
                  const on = selected === r.id;
                  const w = r.x[1] - r.x[0];
                  const d = r.z[1] - r.z[0];
                  return (
                    <g
                      key={r.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      aria-label={`${r.name}, about ${ft(w)} by ${ft(d)} feet`}
                      onClick={() => onSelect(r.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelect(r.id);
                        }
                      }}
                      className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--brass)] [&:focus-visible>rect]:stroke-[4]"
                    >
                      <rect x={X(r.x[0])} y={Z(r.z[0])} width={w * S} height={d * S} fill={on ? "url(#hatch)" : "var(--card)"} stroke="var(--primary)" strokeWidth={on ? 3 : 1} />
                      {on && <rect x={X(r.x[0])} y={Z(r.z[0])} width={w * S} height={d * S} fill="var(--brass)" opacity={0.15} />}
                      <text x={X((r.x[0] + r.x[1]) / 2)} y={Z((r.z[0] + r.z[1]) / 2) - 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--foreground)">{r.name}</text>
                      <text x={X((r.x[0] + r.x[1]) / 2)} y={Z((r.z[0] + r.z[1]) / 2) + 13} textAnchor="middle" fontSize="11" fill="var(--walnut)">{ft(w)}′ × {ft(d)}′</text>
                    </g>
                  );
                })}
                {/* exterior walls */}
                <rect x={X(-4)} y={Z(-3)} width={8 * S} height={7 * S} fill="none" stroke="var(--ink)" strokeWidth="5" pointerEvents="none" />
                {/* door openings + swings */}
                {[
                  { x: -1.2, z: 1, w: 0.9 },
                  { x: 0.25, z: 1, w: 0.8 },
                  { x: 2.6, z: 1, w: 0.8 },
                ].map((d, i) => (
                  <g key={i} pointerEvents="none">
                    <line x1={X(d.x)} y1={Z(d.z)} x2={X(d.x + d.w)} y2={Z(d.z)} stroke="var(--card)" strokeWidth="5" />
                    <path d={`M${X(d.x)} ${Z(d.z)} L${X(d.x)} ${Z(d.z) + d.w * S} A${d.w * S} ${d.w * S} 0 0 0 ${X(d.x + d.w)} ${Z(d.z)}`} fill="none" stroke="var(--walnut)" strokeWidth="1" />
                  </g>
                ))}
                {/* front door on east */}
                <line x1={X(4)} y1={Z(0.05)} x2={X(4)} y2={Z(0.95)} stroke="var(--card)" strokeWidth="6" pointerEvents="none" />
                {/* windows */}
                {([[-3.5, -3, -0.5, -3], [1, -3, 2.6, -3], [-3.2, 4, -1.6, 4], [2.5, 4, 3.5, 4]] as [number, number, number, number][]).map(([a, b, c, d], i) => (
                  <line key={i} x1={X(a)} y1={Z(b)} x2={X(c)} y2={Z(d)} stroke="var(--brass)" strokeWidth="3" pointerEvents="none" />
                ))}
                <text x={X(-4) - 4} y={Z(-1.6)} fontSize="11" fill="var(--walnut)" textAnchor="end" transform={`rotate(-90 ${X(-4) - 8} ${Z(-1.6)})`}>Patio</text>
                <text x={X(0)} y={Z(4) + 18} fontSize="11" textAnchor="middle" fill="var(--muted-foreground)">Overall about 26′ × 23′, single level</text>
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
