"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";

import { graphNodes } from "@/data/graph-data";
import { graphSceneConfig } from "./graph-scene-config";

const KnowledgeGraphScene = dynamic(
  () =>
    import("./KnowledgeGraphScene").then((module) => module.KnowledgeGraphScene),
  { ssr: false },
);

type RenderingMode = "checking" | "webgl" | "fallback";

type KnowledgeGraph3DProps = {
  className?: string;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

function GraphFallback({ checking }: { checking: boolean }) {
  return (
    <div className="flex h-full min-h-72 flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_center,rgba(124,91,255,0.12),transparent_62%)] px-6 text-center">
      <div
        aria-hidden="true"
        className="size-16 rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_35px_rgba(51,214,255,0.16)]"
      />
      <div>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cyan-300">
          {checking ? "Initializing 3D graph" : "Static graph fallback"}
        </p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          {checking
            ? "Checking graphics support."
            : `${graphNodes.length} connected portfolio concepts are available in the standard knowledge graph.`}
        </p>
      </div>
    </div>
  );
}

export function KnowledgeGraph3D({ className }: KnowledgeGraph3DProps) {
  const [renderingMode, setRenderingMode] = useState<RenderingMode>("checking");
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(motionQuery.matches);

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);
    const capabilityCheck = window.requestAnimationFrame(() => {
      setRenderingMode(supportsWebGL() ? "webgl" : "fallback");
    });

    return () => {
      window.cancelAnimationFrame(capabilityCheck);
      motionQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  return (
    <div
      className={`relative min-h-72 overflow-hidden rounded-2xl border border-white/10 bg-[#080a12] ${className ?? ""}`}
      role="img"
      aria-label="Three-dimensional map of Aditya's connected portfolio knowledge"
    >
      {renderingMode === "webgl" ? (
        <Canvas
          camera={{
            fov: graphSceneConfig.camera.fieldOfView,
            position: graphSceneConfig.camera.position,
          }}
          dpr={graphSceneConfig.pixelRatio}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={[graphSceneConfig.colors.background]} />
          <KnowledgeGraphScene reducedMotion={reducedMotion} />
        </Canvas>
      ) : (
        <GraphFallback checking={renderingMode === "checking"} />
      )}
    </div>
  );
}
