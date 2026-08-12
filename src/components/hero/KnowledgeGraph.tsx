"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  graphEdges,
  graphNodes,
  graphPresentation,
  type GraphFocus,
  type GraphNodeId,
} from "@/data/graph-data";
import { GraphNodeDetails } from "@/components/hero/GraphNodeDetails";

type KnowledgeGraphProps = {
  className?: string;
  integrated?: boolean;
  focus: GraphFocus;
  onNodeSelect: (nodeId: GraphNodeId) => void;
  onFocusClear: () => void;
};

const categoryStyles = {
  entity: { fill: "fill-accent-violet-bright", ring: "stroke-accent-violet-bright" },
  discipline: { fill: "fill-accent-violet", ring: "stroke-accent-violet-bright" },
  core: { fill: "fill-accent-violet-bright", ring: "stroke-accent-violet-bright" },
  data: { fill: "fill-accent-blue-bright", ring: "stroke-accent-blue-bright" },
  analytics: { fill: "fill-accent-cyan", ring: "stroke-accent-cyan" },
  ai: { fill: "fill-accent-violet", ring: "stroke-accent-violet" },
  platform: { fill: "fill-accent-cyan", ring: "stroke-accent-cyan" },
  tool: { fill: "fill-accent-blue", ring: "stroke-accent-blue" },
  project: { fill: "fill-accent-cyan", ring: "stroke-accent-cyan" },
} as const;

export function KnowledgeGraph({
  className = "",
  integrated = false,
  focus,
  onNodeSelect,
  onFocusClear,
}: KnowledgeGraphProps) {
  const [hoveredId, setHoveredId] = useState<GraphNodeId | null>(null);
  const [rotation, setRotation] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const dragState = useRef<{ pointerId: number; startX: number; startRotation: number; moved: boolean } | null>(null);
  const didDrag = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const selectedId = focus.source === "manual" ? focus.primaryNodeIds[0] ?? null : null;
  const focusedId = hoveredId ?? focus.primaryNodeIds[0] ?? null;
  const illuminatedIds = useMemo(
    () => new Set<string>(focus.primaryNodeIds),
    [focus.primaryNodeIds],
  );
  const relatedIlluminatedIds = useMemo(
    () => new Set<string>(focus.relatedNodeIds),
    [focus.relatedNodeIds],
  );
  const hasResponseHighlight = illuminatedIds.size > 0 || relatedIlluminatedIds.size > 0;
  const connectedIds = useMemo(() => {
    const ids = new Set<GraphNodeId>();
    if (!focusedId) return ids;
    ids.add(focusedId);

    graphEdges.forEach((edge) => {
      if (edge.source === focusedId) ids.add(edge.target);
      if (edge.target === focusedId) ids.add(edge.source);
    });

    return ids;
  }, [focusedId]);

  const selectedNode = graphNodes.find((node) => node.id === selectedId) ?? null;
  const selectedConnections = graphEdges
    .filter((edge) => selectedId !== null && (edge.source === selectedId || edge.target === selectedId))
    .map((edge) => (edge.source === selectedId ? edge.target : edge.source))
    .map((id) => graphNodes.find((node) => node.id === id)?.label)
    .filter((label) => label !== undefined);

  const selectNode = (id: GraphNodeId) => onNodeSelect(id);

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") return;
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startRotation: rotation,
      moved: false,
    };
    didDrag.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    if (dragState.current?.pointerId === event.pointerId) {
      if (Math.abs(event.clientX - dragState.current.startX) >= 5) dragState.current.moved = true;
      setRotation(dragState.current.startRotation + (event.clientX - dragState.current.startX) * 0.08);
      return;
    }

    if (event.pointerType === "touch" || prefersReducedMotion) return;
    setParallax({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 8,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 6,
    });
  };

  const endDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragState.current?.pointerId === event.pointerId) {
      didDrag.current = dragState.current.moved;
      dragState.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className={`${integrated ? "hero-graph-scene relative isolate min-h-80 overflow-hidden" : "graph-shell relative isolate min-h-80 overflow-hidden rounded-[var(--radius-panel)] border border-panel-border bg-panel-muted"} ${className}`}>
      {!integrated && <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between font-display text-[0.5625rem] uppercase tracking-[0.18em] text-muted-foreground">
        <span>SYS / 01</span>
        <span className="flex items-center gap-2 text-accent-cyan">
          <span className="size-1.5 rounded-full bg-accent-cyan shadow-[0_0_10px_var(--color-cyan)]" />
          Graph online
        </span>
      </div>}

      <svg
        viewBox="0 0 400 360"
        className={`absolute inset-x-0 w-full touch-none select-none overflow-visible active:cursor-grabbing sm:cursor-grab ${integrated ? "inset-y-0 h-full" : "top-10 h-[calc(100%-10.5rem)]"}`}
        role="group"
        aria-label="Interactive knowledge graph. Drag to rotate and select a node for details."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={(event) => {
          const target = event.target as Element;
          if (!target.closest("[data-graph-node]") && !didDrag.current) onFocusClear();
          didDrag.current = false;
        }}
        onPointerLeave={() => {
          if (!dragState.current) setParallax({ x: 0, y: 0 });
          setHoveredId(null);
        }}
      >
        <defs>
          <radialGradient id="graph-core-glow">
            <stop offset="0" stopColor="var(--color-violet)" stopOpacity="0.2" />
            <stop offset="1" stopColor="var(--color-violet)" stopOpacity="0" />
          </radialGradient>
          <filter id="graph-node-glow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="200" cy="184" r="132" fill="url(#graph-core-glow)" aria-hidden="true" />

        <g transform={`translate(${parallax.x} ${parallax.y}) rotate(${rotation} 200 184)`}>
          <g className="knowledge-graph-idle">
            {graphEdges.map((edge) => {
              const source = graphPresentation[edge.source];
              const target = graphPresentation[edge.target];
              const isActive = edge.source === focusedId || edge.target === focusedId;
              const sourceIsStrong = illuminatedIds.has(edge.source);
              const targetIsStrong = illuminatedIds.has(edge.target);
              const sourceIsRelated = relatedIlluminatedIds.has(edge.source);
              const targetIsRelated = relatedIlluminatedIds.has(edge.target);
              const isResponseActive =
                (sourceIsStrong && (targetIsStrong || targetIsRelated)) ||
                (targetIsStrong && (sourceIsStrong || sourceIsRelated));
              const isResponseRelated = sourceIsRelated || targetIsRelated;
              const transitionClass = prefersReducedMotion
                ? "transition-none"
                : "transition-[stroke,opacity] duration-300";

              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={`${transitionClass} ${
                    hasResponseHighlight
                      ? isResponseActive
                        ? "stroke-accent-cyan opacity-100"
                        : isResponseRelated
                          ? "stroke-accent-violet opacity-40"
                          : "stroke-accent-violet opacity-10"
                      : isActive
                        ? "stroke-accent-cyan opacity-100"
                        : "stroke-accent-violet opacity-25"
                  }`}
                  strokeWidth={isResponseActive || (!hasResponseHighlight && isActive) ? 1.6 : 0.8}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {graphNodes.map((node) => {
              const position = graphPresentation[node.id];
              const style = categoryStyles[node.category];
              const isFocused = node.id === focusedId;
              const isSelected = node.id === selectedId;
              const isConnected = connectedIds.has(node.id);
              const isResponseStrong = illuminatedIds.has(node.id);
              const isResponseRelated = relatedIlluminatedIds.has(node.id);
              const responseOpacity = isResponseStrong
                ? "opacity-100"
                : isResponseRelated
                  ? "opacity-60"
                  : isFocused
                    ? "opacity-100"
                    : "opacity-20";
              const nodeOpacity = hasResponseHighlight
                ? responseOpacity
                : isConnected
                  ? "opacity-100"
                  : "opacity-25";
              const transitionClass = prefersReducedMotion
                ? "transition-none"
                : "transition-opacity duration-300";
              const radius = 3.8 + (node.importance ?? 0.5) * 3.6;

              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${node.label} details`}
                  aria-pressed={isSelected}
                  className={`group/node outline-none ${transitionClass} ${nodeOpacity}`}
                  data-graph-node={node.id}
                  onPointerEnter={() => setHoveredId(node.id)}
                  onPointerLeave={() => setHoveredId(null)}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!didDrag.current) selectNode(node.id);
                    didDrag.current = false;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectNode(node.id);
                    }
                  }}
                >
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={radius * 3.1}
                    className={`${style.fill} ${prefersReducedMotion ? "transition-none" : "transition-opacity duration-300"} ${isFocused || isResponseStrong ? "opacity-20" : isResponseRelated ? "opacity-10" : "opacity-5"}`}
                  />
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={radius + (isFocused ? 2 : 0)}
                    className={`${style.fill} ${style.ring} ${prefersReducedMotion ? "transition-none" : "transition-all duration-300"} group-focus/node:stroke-[3px]`}
                    strokeWidth={isResponseStrong ? 2.5 : isSelected ? 2 : 1}
                    filter={isConnected || isResponseStrong || isResponseRelated ? "url(#graph-node-glow)" : undefined}
                    style={{ opacity: 0.7 + position.depth * 0.3 }}
                  />
                  <text
                    x={position.x}
                    y={position.y - radius - 8}
                    textAnchor="middle"
                    stroke="rgba(7,9,18,.96)"
                    strokeWidth={isFocused || isSelected ? 4 : 3}
                    paintOrder="stroke fill"
                    className={`pointer-events-none fill-current font-display uppercase tracking-[0.06em] ${node.importance < 0.68 && !isFocused && !isSelected ? "hidden sm:block" : ""} ${prefersReducedMotion ? "transition-none" : "transition-[color,opacity] duration-300"} ${isFocused || isSelected || isResponseStrong ? "text-foreground" : isResponseRelated ? "text-accent-cyan" : "text-slate-300"}`}
                    fontSize={node.id === "analytics-engineering" ? 13 : node.importance >= 0.78 ? 11.5 : 10.5}
                    fontWeight={isFocused || isSelected ? 700 : 600}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {(!integrated || selectedNode) && <div className={`${integrated ? "pointer-events-none absolute bottom-4 left-1/2 z-20 w-[min(25rem,90%)] -translate-x-1/2" : "absolute inset-x-0 bottom-0 z-20"}`}>
        {!integrated && <div className="flex items-center justify-between px-4 pb-2 font-display text-[0.5rem] uppercase tracking-[0.14em] text-muted-foreground">
          <span className="hidden sm:inline">Drag to rotate · Select a node</span>
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
