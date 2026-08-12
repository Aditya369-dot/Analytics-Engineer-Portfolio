"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  type Material,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type DigitalTwinModelProps = {
  modelUrl?: string;
  modelScale?: number;
  reducedMotion: boolean;
};

function HologramMaterial({ opacity = 0.72 }: { opacity?: number }) {
  return (
    <meshStandardMaterial
      color="#60a5fa"
      emissive="#8b5cf6"
      emissiveIntensity={1.8}
      metalness={0.15}
      opacity={opacity}
      roughness={0.35}
      transparent
      wireframe
    />
  );
}

function AbstractHumanForm() {
  const joints = [
    [-0.68, 0.48, 0],
    [0.68, 0.48, 0],
    [-0.82, -0.18, 0],
    [0.82, -0.18, 0],
    [0, -0.82, 0],
  ] as const;

  return (
    <group position={[0, 0.08, 0]}>
      <mesh position={[0, 1.18, 0]} scale={[0.78, 1, 0.76]}>
        <sphereGeometry args={[0.38, 24, 18]} />
        <HologramMaterial opacity={0.82} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.13, 0.17, 0.28, 16, 2, true]} />
        <HologramMaterial />
      </mesh>
      <mesh position={[0, 0.08, 0]} scale={[0.72, 1.05, 0.46]}>
        <sphereGeometry args={[0.72, 24, 18]} />
        <HologramMaterial opacity={0.68} />
      </mesh>
      <mesh position={[-0.79, 0.05, 0]} rotation={[0, 0, -0.13]}>
        <cylinderGeometry args={[0.11, 0.085, 1.15, 14, 3, true]} />
        <HologramMaterial opacity={0.58} />
      </mesh>
      <mesh position={[0.79, 0.05, 0]} rotation={[0, 0, 0.13]}>
        <cylinderGeometry args={[0.11, 0.085, 1.15, 14, 3, true]} />
        <HologramMaterial opacity={0.58} />
      </mesh>
      <mesh position={[0, -0.73, 0]} scale={[0.54, 0.38, 0.38]}>
        <sphereGeometry args={[0.7, 20, 14]} />
        <HologramMaterial opacity={0.55} />
      </mesh>

      {joints.map(([x, y, z]) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function LoadedTwinModel({ modelUrl, scale }: { modelUrl: string; scale: number }) {
  const gltf = useLoader(GLTFLoader, modelUrl);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((object) => {
      if (object instanceof Mesh) {
        object.material = new MeshStandardMaterial({
          color: "#60a5fa",
          emissive: "#8b5cf6",
          emissiveIntensity: 1.6,
          metalness: 0.15,
          opacity: 0.72,
          roughness: 0.35,
          transparent: true,
          wireframe: true,
        });
      }
    });

    return clone;
  }, [gltf.scene]);

  useEffect(
    () => () => {
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material: Material) => material.dispose());
        }
      });
    },
    [scene],
  );

  return <primitive object={scene} scale={scale} position={[0, -0.75, 0]} />;
}

function ScanBand({ reducedMotion }: { reducedMotion: boolean }) {
  const scanRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!scanRef.current || reducedMotion) return;
    scanRef.current.position.y = -0.75 + ((state.clock.elapsedTime * 0.28) % 2.5);
  });

  return (
    <mesh ref={scanRef} position={[0, 0.35, 0]}>
      <cylinderGeometry args={[1.05, 1.05, 0.025, 40, 1, true]} />
      <meshBasicMaterial
        color="#22d3ee"
        opacity={0.38}
        side={DoubleSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

export function DigitalTwinModel({
  modelUrl,
  modelScale = 1,
  reducedMotion,
}: DigitalTwinModelProps) {
  const rigRef = useRef<Group>(null);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    if (!rig) return;

    const pointerX = reducedMotion ? 0 : state.pointer.x * 0.18;
    const pointerY = reducedMotion ? 0 : state.pointer.y * 0.08;
    const idleRotation = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    const breathing = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.018;

    rig.rotation.y = MathUtils.damp(rig.rotation.y, pointerX + idleRotation, 3, delta);
    rig.rotation.x = MathUtils.damp(rig.rotation.x, -pointerY, 3, delta);
    rig.position.y = MathUtils.damp(rig.position.y, breathing, 3, delta);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[-2, 2.5, 2]} color="#8b5cf6" intensity={7} distance={7} />
      <pointLight position={[2, 1, 2]} color="#22d3ee" intensity={6} distance={6} />

      <group ref={rigRef}>
        {modelUrl ? (
          <LoadedTwinModel modelUrl={modelUrl} scale={modelScale} />
        ) : (
          <AbstractHumanForm />
        )}
        <ScanBand reducedMotion={reducedMotion} />
      </group>

      <group position={[0, -1.02, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.88, 0.012, 8, 64]} />
          <meshBasicMaterial color="#22d3ee" opacity={0.7} toneMapped={false} transparent />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.82, 64]} />
          <meshBasicMaterial color="#3b82f6" opacity={0.08} side={DoubleSide} transparent />
        </mesh>
      </group>

      <gridHelper position={[0, -1.04, 0]} args={[3.6, 16, "#3b82f6", "#252a3b"]} />
    </>
  );
}
