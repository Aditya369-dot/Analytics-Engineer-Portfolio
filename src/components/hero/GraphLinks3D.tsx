import { useMemo } from "react";

import type { GraphSceneLink } from "./graph-scene-config";

type GraphLinks3DProps = {
  color: string;
  links: readonly GraphSceneLink[];
};

export function GraphLinks3D({ color, links }: GraphLinks3DProps) {
  const positions = useMemo(
    () =>
      new Float32Array(
        links.flatMap(({ source, target }) => [...source, ...target]),
      ),
    [links],
  );

  return (
    <lineSegments name="knowledge-graph-links">
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        opacity={0.62}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
