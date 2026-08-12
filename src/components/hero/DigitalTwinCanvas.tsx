"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { DigitalTwinModel } from "@/components/hero/DigitalTwinModel";

type DigitalTwinCanvasProps = {
  modelUrl?: string;
  modelScale?: number;
  reducedMotion: boolean;
  onReady: () => void;
};

export function DigitalTwinCanvas({
  modelUrl,
  modelScale,
  reducedMotion,
  onReady,
}: DigitalTwinCanvasProps) {
  return (
    <Canvas
      camera={{ fov: 36, near: 0.1, far: 30, position: [0, 0.35, 4.6] }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.setAttribute("aria-hidden", "true");
        onReady();
      }}
    >
      <Suspense fallback={null}>
        <DigitalTwinModel
          modelUrl={modelUrl}
          modelScale={modelScale}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
