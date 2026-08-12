import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils, Vector3, type LineBasicMaterial, type Mesh } from "three";

import type { GraphNodeId } from "@/data/graph-data";
import type { GraphSceneLink } from "./graph-scene-config";

type GraphLinks3DProps = {
  activeColor: string;
  color: string;
  focusedId: GraphNodeId | null;
  highlightedIds: ReadonlySet<GraphNodeId>;
  links: readonly GraphSceneLink[];
  reducedMotion: boolean;
  relatedIds: ReadonlySet<GraphNodeId>;
};

type GraphLinkMeshProps = {
  active: boolean;
  activeColor: string;
  color: string;
  link: GraphSceneLink;
  opacity: number;
  reducedMotion: boolean;
};

function GraphLinkMesh({ active, activeColor, color, link, opacity, reducedMotion }: GraphLinkMeshProps) {
  const materialRef = useRef<LineBasicMaterial>(null);
  const glowMaterialRef = useRef<LineBasicMaterial>(null);
  const pulseRef = useRef<Mesh>(null);
  const source = useMemo(() => new Vector3(...link.source), [link.source]);
  const target = useMemo(() => new Vector3(...link.target), [link.target]);
  const positions = useMemo(
    () => new Float32Array([...link.source, ...link.target]),
    [link.source, link.target],
  );

  useFrame(({ clock }, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const smoothing = reducedMotion ? 1000 : 7;
    material.opacity = MathUtils.damp(material.opacity, opacity, smoothing, delta);
    material.color.lerp(new Color(active ? activeColor : color), 1 - Math.exp(-smoothing * delta));
    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = MathUtils.damp(
        glowMaterialRef.current.opacity,
        opacity * (active ? 0.28 : 0.08),
        smoothing,
        delta,
      );
    }
    if (active && pulseRef.current) {
      const progress = reducedMotion ? 0.5 : (clock.elapsedTime * 0.18 + source.x * 0.13) % 1;
      pulseRef.current.position.copy(source).lerp(target, progress);
    }
  });

  return (
    <group>
      <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color={active ? activeColor : color}
        opacity={opacity}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
        <lineSegments scale={1.002}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={glowMaterialRef}
          color={activeColor}
          opacity={opacity * (active ? 0.28 : 0.08)}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
        </lineSegments>
      </lineSegments>
      {active && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshBasicMaterial color={new Color(activeColor).multiplyScalar(3)} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

export function GraphLinks3D({
  activeColor,
  color,
  focusedId,
  highlightedIds,
  links,
  reducedMotion,
  relatedIds,
}: GraphLinks3DProps) {
  const hasResponseHighlight = highlightedIds.size > 0 || relatedIds.size > 0;

  return (
    <group name="knowledge-graph-links">
      {links.map(({ data, source, target }) => {
        const isFocused = data.source === focusedId || data.target === focusedId;
        const isStrong =
          (highlightedIds.has(data.source) &&
            (highlightedIds.has(data.target) || relatedIds.has(data.target))) ||
          (highlightedIds.has(data.target) &&
            (highlightedIds.has(data.source) || relatedIds.has(data.source)));
        const isRelated = relatedIds.has(data.source) || relatedIds.has(data.target);
        const active = hasResponseHighlight ? isStrong : isFocused;
        const opacity = hasResponseHighlight
          ? isStrong
            ? 0.95
            : isRelated
              ? 0.3
              : 0.08
          : isFocused
            ? 0.9
            : 0.28;

        return (
          <GraphLinkMesh
            key={`${data.source}-${data.target}`}
            active={active}
            activeColor={activeColor}
            color={color}
            link={{ data, source, target }}
            opacity={opacity}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </group>
  );
}
