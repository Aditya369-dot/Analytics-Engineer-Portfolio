import { useRef, type RefObject } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  MathUtils,
  type Group,
  type MeshBasicMaterial,
} from "three";

import type { GraphNodeId } from "@/data/graph-data";
import { graphSceneLinks, type GraphSceneNode } from "./graph-scene-config";
import type { GraphDragController } from "./graph-drag-state";

type GraphNodes3DProps = {
  focusedId: GraphNodeId | null;
  highlightedIds: ReadonlySet<GraphNodeId>;
  nodes: readonly GraphSceneNode[];
  reducedMotion: boolean;
  relatedIds: ReadonlySet<GraphNodeId>;
  selectedId: GraphNodeId | null;
  onHover: (id: GraphNodeId | null) => void;
  onSelect: (id: GraphNodeId) => void;
  dragState: RefObject<GraphDragController>;
};

type GraphNodeMeshProps = {
  node: GraphSceneNode;
  opacity: number;
  reducedMotion: boolean;
  related: boolean;
  scale: number;
  onHover: (id: GraphNodeId | null) => void;
  onSelect: (id: GraphNodeId) => void;
  dragState: RefObject<GraphDragController>;
};

function GraphNodeMesh({
  node: { data, position, radius, color },
  opacity,
  reducedMotion,
  related,
  scale,
  onHover,
  onSelect,
  dragState,
}: GraphNodeMeshProps) {
  const groupRef = useRef<Group>(null);
  const coreMaterialRef = useRef<MeshBasicMaterial>(null);
  const glowMaterialRef = useRef<MeshBasicMaterial>(null);
  const pulseRef = useRef<Group>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const glowScale = scale > 1.2 ? 2.5 : 1.9;
  const isCore = data.level === "central";
  const energy = isCore ? 3.1 : scale > 1.1 ? 2.25 : 1.35;
  const energyColor = new Color(related ? "#738cff" : color).multiplyScalar(energy);

  useFrame(({ clock }, delta) => {
    const smoothing = reducedMotion ? 1000 : 8;
    const group = groupRef.current;
    if (group) {
      const interactionScale = dragState.current.active ? scale * 1.035 : scale;
      const nextScale = MathUtils.damp(group.scale.x, interactionScale, smoothing, delta);
      group.scale.setScalar(nextScale);
    }
    if (coreMaterialRef.current && !isCore) {
      coreMaterialRef.current.opacity = MathUtils.damp(
        coreMaterialRef.current.opacity,
        opacity,
        smoothing,
        delta,
      );
    }
    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = MathUtils.damp(
        glowMaterialRef.current.opacity,
        opacity * (scale > 1.2 ? 0.17 : 0.08),
        smoothing,
        delta,
      );
    }
    if (pulseRef.current) {
      const pulse = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 1.35 + position[0]) * 0.045;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} name={`graph-node-${data.id}`} position={position}>
      <mesh
        onPointerDown={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          pointerStart.current = { x: event.clientX, y: event.clientY };
        }}
        onClick={(event) => {
          event.stopPropagation();
          const start = pointerStart.current;
          pointerStart.current = null;
          if (!dragState.current.didDrag && (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) < 5)) onSelect(data.id);
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(data.id);
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "auto";
          onHover(null);
        }}
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial
          ref={coreMaterialRef}
          color={energyColor}
          opacity={isCore ? 0 : opacity}
          transparent
          colorWrite={!isCore}
          depthWrite={!isCore}
          toneMapped={false}
        />
      </mesh>
      {!isCore && <mesh scale={0.48}>
        <sphereGeometry args={[radius, 18, 18]} />
        <meshBasicMaterial
          color={new Color(isCore ? "#f4efff" : "#ddfaff").multiplyScalar(isCore ? 3.8 : 2.5)}
          opacity={opacity}
          transparent
          toneMapped={false}
        />
      </mesh>}
      {!isCore && <mesh scale={glowScale}>
        <sphereGeometry args={[radius, 18, 18]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          color={energyColor}
          opacity={opacity * (scale > 1.2 ? 0.17 : 0.08)}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>}
      {!isCore && <group ref={pulseRef}>
        <mesh scale={1.36}>
          <icosahedronGeometry args={[radius, 2]} />
          <meshBasicMaterial
            color={related ? "#738cff" : color}
            opacity={opacity * 0.18}
            transparent
            wireframe
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>}
    </group>
  );
}

export function GraphNodes3D({
  focusedId,
  highlightedIds,
  nodes,
  reducedMotion,
  relatedIds,
  selectedId,
  onHover,
  onSelect,
  dragState,
}: GraphNodes3DProps) {
  const hasResponseHighlight = highlightedIds.size > 0 || relatedIds.size > 0;
  const connectedIds = new Set<GraphNodeId>();
  if (focusedId) {
    connectedIds.add(focusedId);
    graphSceneLinks.forEach(({ data }) => {
      if (data.source === focusedId) connectedIds.add(data.target);
      if (data.target === focusedId) connectedIds.add(data.source);
    });
  }

  return (
    <group name="knowledge-graph-nodes">
      {nodes.map((node) => {
        const isFocused = node.data.id === focusedId;
        const isSelected = node.data.id === selectedId;
        const isStrong = highlightedIds.has(node.data.id);
        const isRelated = relatedIds.has(node.data.id);
        const isConnected = connectedIds.has(node.data.id);
        const opacity = hasResponseHighlight
          ? isStrong
            ? 1
            : isRelated
              ? 0.68
              : isFocused
                ? 0.9
                : 0.2
          : focusedId && !isConnected
            ? 0.28
            : isFocused || isSelected || isConnected
            ? 1
            : 0.76;
        const scale = isFocused || isStrong ? 1.32 : isSelected ? 1.2 : isConnected ? 1.08 : 1;

        return (
          <GraphNodeMesh
            key={node.data.id}
            node={node}
            opacity={opacity}
            reducedMotion={reducedMotion}
            related={isRelated}
            scale={scale}
            onHover={onHover}
            onSelect={onSelect}
            dragState={dragState}
          />
        );
      })}
    </group>
  );
}
