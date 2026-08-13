"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";

import { GraphNodeDetails } from "@/components/hero/GraphNodeDetails";
import { KnowledgeGraph } from "@/components/hero/KnowledgeGraph";
import { TwinVoiceControlPill } from "@/components/hero/TwinVoiceControlPill";
import type { TwinSpeechController } from "@/hooks/useTwinSpeech";
import {
  graphEdges,
  graphNodes,
  type GraphFocus,
  type GraphNodeId,
} from "@/data/graph-data";
import { graphSceneConfig } from "./graph-scene-config";
import { GraphDragController } from "./graph-drag-state";

const KnowledgeGraphScene = dynamic(
  () =>
    import("./KnowledgeGraphScene").then((module) => module.KnowledgeGraphScene),
  { ssr: false },
);

type RenderingMode = "checking" | "webgl" | "fallback";

type KnowledgeGraph3DProps = {
  className?: string;
  integrated?: boolean;
  focus: GraphFocus;
  onNodeSelect: (nodeId: GraphNodeId) => void;
  onFocusClear: () => void;
  speech: TwinSpeechController;
};

function supportsEnhancedGraph() {
  try {
    const canvas = document.createElement("canvas");
    const hasWebGL = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
    const hasLimitedConcurrency =
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency <= 2;

    return hasWebGL && !hasLimitedConcurrency;
  } catch {
    return false;
  }
}

export function KnowledgeGraph3D({
  className = "",
  integrated = false,
  focus,
  onNodeSelect,
  onFocusClear,
  speech,
}: KnowledgeGraph3DProps) {
  const [renderingMode, setRenderingMode] = useState<RenderingMode>("checking");
  const [reducedMotion, setReducedMotion] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [postProcessing, setPostProcessing] = useState(false);
  const [compact, setCompact] = useState(true);
  const [hoveredId, setHoveredId] = useState<GraphNodeId | null>(null);
  const canvasPointerStart = useRef<{ x: number; y: number } | null>(null);
  const graphDrag = useRef(new GraphDragController());
  const graphInteractionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(motionQuery.matches);

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);
    const capabilityCheck = window.requestAnimationFrame(() => {
      setRenderingMode(supportsEnhancedGraph() ? "webgl" : "fallback");
      const compact = window.matchMedia("(max-width: 639px)").matches;
      setCompact(compact);
      setHighQuality(!compact && (navigator.hardwareConcurrency ?? 4) >= 8 && window.devicePixelRatio <= 2);
      setPostProcessing(!compact);
    });

    return () => {
      document.body.style.cursor = "auto";
      window.cancelAnimationFrame(capabilityCheck);
      motionQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  const highlightedIds = useMemo(
    () => new Set(focus.primaryNodeIds),
    [focus.primaryNodeIds],
  );
  const relatedIds = useMemo(
    () => new Set(focus.relatedNodeIds),
    [focus.relatedNodeIds],
  );
  const selectedId = focus.source === "manual" ? focus.primaryNodeIds[0] ?? null : null;
  const persistentFocusId = focus.primaryNodeIds[0] ?? null;
  const selectedNode = graphNodes.find((node) => node.id === selectedId) ?? null;
  const selectedConnections = graphEdges
    .filter((edge) => selectedId !== null && (edge.source === selectedId || edge.target === selectedId))
    .map((edge) => (edge.source === selectedId ? edge.target : edge.source))
    .map((id) => graphNodes.find((node) => node.id === id)?.label)
    .filter((label) => label !== undefined);

  if (renderingMode !== "webgl") {
    return (
      <KnowledgeGraph
        className={className}
        integrated={integrated}
        focus={focus}
        onNodeSelect={onNodeSelect}
        onFocusClear={onFocusClear}
        speech={speech}
      />
    );
  }

  return (
    <div
      className={`${integrated ? "hero-graph-scene relative isolate min-h-80 overflow-hidden" : "graph-shell relative isolate min-h-80 overflow-hidden rounded-[var(--radius-panel)] border border-panel-border bg-panel-muted"} ${className}`}
      role="group"
      aria-label="Interactive three-dimensional knowledge graph. Select a node for details."
    >
      {!integrated && <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between font-display text-[0.5625rem] uppercase tracking-[0.18em] text-muted-foreground">
        <span>SYS / 01 · 3D</span>
        <span className="flex items-center gap-2 text-accent-cyan">
          <span className="size-1.5 rounded-full bg-accent-cyan shadow-[0_0_10px_var(--color-cyan)]" />
          Graph online
        </span>
      </div>}

      <div
        ref={graphInteractionRef}
        className={`neural-field-shell absolute inset-0 cursor-grab ${integrated ? "hero-neural-canvas" : "top-10 h-[calc(100%-10.5rem)]"}`}
        onPointerDownCapture={(event) => {
          graphDrag.current.start(event.pointerId, event.clientX, event.clientY, event.timeStamp);
          event.currentTarget.style.cursor = "grabbing";
          event.currentTarget.style.touchAction = "none";
        }}
        onPointerMove={(event) => {
          graphDrag.current.move(event.pointerId, event.clientX, event.clientY, event.timeStamp);
          if (graphDrag.current.didDrag && !event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerUp={(event) => {
          if (!graphDrag.current.end(event.pointerId)) return;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          event.currentTarget.style.cursor = "grab";
          event.currentTarget.style.touchAction = "auto";
        }}
        onPointerCancel={(event) => {
          graphDrag.current.cancel();
          event.currentTarget.style.cursor = "grab";
          event.currentTarget.style.touchAction = "auto";
        }}
        onPointerLeave={(event) => {
          if (!graphDrag.current.active || event.currentTarget.hasPointerCapture(event.pointerId)) return;
          graphDrag.current.cancel();
          event.currentTarget.style.cursor = "grab";
          event.currentTarget.style.touchAction = "auto";
        }}
        onLostPointerCapture={() => {
          graphDrag.current.cancel();
          graphInteractionRef.current?.style.setProperty("cursor", "grab");
          graphInteractionRef.current?.style.setProperty("touch-action", "auto");
        }}
      >
        <Canvas
          camera={{
            fov: graphSceneConfig.camera.fieldOfView,
            position: graphSceneConfig.camera.position,
          }}
          dpr={graphSceneConfig.pixelRatio}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => { gl.toneMappingExposure = 0.92; }}
          onPointerDown={(event) => { canvasPointerStart.current = { x: event.clientX, y: event.clientY }; }}
          onPointerMissed={(event) => {
            const start = canvasPointerStart.current;
            canvasPointerStart.current = null;
            setHoveredId(null);
            if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) < 5) onFocusClear();
          }}
        >
          <color attach="background" args={[graphSceneConfig.colors.background]} />
          <fog attach="fog" args={[graphSceneConfig.colors.background, 5.8, 10]} />
          <KnowledgeGraphScene
            focusedId={hoveredId ?? persistentFocusId}
            highlightedIds={highlightedIds}
            compact={compact}
            highQuality={highQuality}
            postProcessing={postProcessing}
            dragState={graphDrag}
            reducedMotion={reducedMotion}
            relatedIds={relatedIds}
            selectedId={selectedId}
            onHover={setHoveredId}
            onSelect={(id) => { canvasPointerStart.current = null; onNodeSelect(id); }}
          />
        </Canvas>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_24%,rgba(7,8,13,0.55)_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="sr-only" aria-label="Knowledge graph nodes">
        {graphNodes.map((node) => (
          <button
            key={node.id}
            type="button"
            aria-pressed={node.id === selectedId}
            onClick={() => onNodeSelect(node.id)}
          >
            View {node.label} details
          </button>
        ))}
      </div>

      <TwinVoiceControlPill speech={speech} />

      {(!integrated || selectedNode) && <div className={`${integrated ? "pointer-events-none absolute bottom-4 left-1/2 z-20 w-[min(25rem,90%)] -translate-x-1/2" : "absolute inset-x-0 bottom-0 z-20"}`}>
        {!integrated && <div className="flex items-center justify-between px-4 pb-2 font-display text-[0.5rem] uppercase tracking-[0.14em] text-muted-foreground">
          <span className="hidden sm:inline">Move to explore · Select a node</span>
          <span className="sm:hidden">Tap a node</span>
          <span>{graphNodes.length} nodes / {graphEdges.length} links</span>
        </div>}
        <div className={integrated ? "pointer-events-auto overflow-hidden rounded-xl border border-panel-border/70 shadow-[0_0_32px_rgba(7,8,13,.8)]" : ""}>
          <GraphNodeDetails node={selectedNode} connections={selectedConnections} />
        </div>
      </div>}
    </div>
  );
}
