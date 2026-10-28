import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import type { RoomId } from "@/lib/rooms";

const Viewer = lazy(() => import("./Viewer"));
const Compare = lazy(() => import("./CompareCapture"));

const Fallback = ({ h = 420 }: { h?: number }) => (
  <div className="flex items-center justify-center border border-primary bg-secondary text-muted-foreground" style={{ height: h }}>
    Loading the 3D home…
  </div>
);

export function LazyViewer(props: { initialRoom?: RoomId | null; compact?: boolean }) {
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <Viewer {...props} />
      </Suspense>
    </ClientOnly>
  );
}

export function LazyCompare() {
  return (
    <ClientOnly fallback={<Fallback h={300} />}>
      <Suspense fallback={<Fallback h={300} />}>
        <Compare />
      </Suspense>
    </ClientOnly>
  );
}
