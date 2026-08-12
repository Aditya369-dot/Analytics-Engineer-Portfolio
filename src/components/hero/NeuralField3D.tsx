import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Group, type Points } from "three";

type NeuralField3DProps = {
  reducedMotion: boolean;
};

const particleCount = 120;

export function NeuralField3D({ reducedMotion }: NeuralField3DProps) {
  const groupRef = useRef<Group>(null);
  const fieldRef = useRef<Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      const angle = index * 2.39996;
      const radius = 1.4 + ((index * 37) % 100) / 38;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = Math.sin(angle) * radius * 0.72;
      values[index * 3 + 2] = ((index * 53) % 100) / 24 - 2.1;
    }

    return values;
  }, []);
  const connections = useMemo(() => {
    const values = new Float32Array(particleCount * 2 * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const target = (index + 7 + (index % 5)) % particleCount;
      values.set(positions.slice(index * 3, index * 3 + 3), index * 6);
      values.set(positions.slice(target * 3, target * 3 + 3), index * 6 + 3);
    }
    return values;
  }, [positions]);
  const brightPositions = useMemo(() => {
    const count = 18;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const source = (index * 7) % particleCount;
      values.set(positions.slice(source * 3, source * 3 + 3), index * 3);
    }
    return values;
  }, [positions]);

  useFrame((_, delta) => {
    if (!reducedMotion && fieldRef.current) {
      fieldRef.current.rotation.y -= delta * 0.012;
      if (groupRef.current) groupRef.current.rotation.z += delta * 0.0025;
    }
  });

  return (
    <group ref={groupRef} name="ambient-neural-field">
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[connections, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#5867c8" opacity={0.075} transparent depthWrite={false} toneMapped={false} />
      </lineSegments>
      <points ref={fieldRef}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
        <pointsMaterial color="#7188ff" opacity={0.38} size={0.028} sizeAttenuation transparent depthWrite={false} toneMapped={false} />
      </points>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[brightPositions, 3]} /></bufferGeometry>
        <pointsMaterial color={new Color("#87ddff").multiplyScalar(1.65)} opacity={0.42} size={0.018} sizeAttenuation transparent depthWrite={false} toneMapped={false} />
      </points>
    </group>
  );
}
