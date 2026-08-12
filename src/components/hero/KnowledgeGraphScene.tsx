"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

import { GraphLinks3D } from "./GraphLinks3D";
import { GraphNodes3D } from "./GraphNodes3D";
import {
  graphSceneConfig,
  graphSceneLinks,
  graphSceneNodes,
} from "./graph-scene-config";

type KnowledgeGraphSceneProps = {
  reducedMotion: boolean;
};

export function KnowledgeGraphScene({ reducedMotion }: KnowledgeGraphSceneProps) {
  const graphRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!reducedMotion && graphRef.current) {
      graphRef.current.rotation.y += delta * graphSceneConfig.idleRotationSpeed;
    }
  });

  return (
    <group ref={graphRef} name="knowledge-graph-scene">
      <GraphLinks3D
        color={graphSceneConfig.colors.link}
        links={graphSceneLinks}
      />
      <GraphNodes3D nodes={graphSceneNodes} />
    </group>
  );
}
