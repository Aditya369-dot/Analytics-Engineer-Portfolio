import type { GraphSceneNode } from "./graph-scene-config";

type GraphNodes3DProps = {
  nodes: readonly GraphSceneNode[];
};

export function GraphNodes3D({ nodes }: GraphNodes3DProps) {
  return (
    <group name="knowledge-graph-nodes">
      {nodes.map(({ data, position, radius, color }) => (
        <group key={data.id} name={`graph-node-${data.id}`} position={position}>
          <mesh>
            <sphereGeometry args={[radius, 20, 20]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
          <mesh scale={1.8}>
            <sphereGeometry args={[radius, 14, 14]} />
            <meshBasicMaterial
              color={color}
              opacity={0.12}
              transparent
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
