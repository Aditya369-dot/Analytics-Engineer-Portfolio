"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import type { GraphNodeId } from "@/data/graph-data";
import { GraphLinks3D } from "./GraphLinks3D";
import { GraphLabels3D } from "./GraphLabels3D";
import { GraphNodes3D } from "./GraphNodes3D";
import { DigitalTwinEntity } from "./DigitalTwinEntity";
import { NeuralField3D } from "./NeuralField3D";
import {
  graphSceneConfig,
  graphSceneLinks,
  graphSceneNodes,
} from "./graph-scene-config";
import type { GraphDragController } from "./graph-drag-state";

type KnowledgeGraphSceneProps = {
  focusedId: GraphNodeId | null;
  highlightedIds: ReadonlySet<GraphNodeId>;
  reducedMotion: boolean;
  relatedIds: ReadonlySet<GraphNodeId>;
  selectedId: GraphNodeId | null;
  highQuality: boolean;
  postProcessing: boolean;
  dragState: RefObject<GraphDragController>;
  onHover: (id: GraphNodeId | null) => void;
  onSelect: (id: GraphNodeId) => void;
};

export function KnowledgeGraphScene({
  focusedId,
  highlightedIds,
  reducedMotion,
  relatedIds,
  selectedId,
  highQuality,
  postProcessing,
  dragState,
  onHover,
  onSelect,
}: KnowledgeGraphSceneProps) {
  const graphRef = useRef<Group>(null);

  useFrame(({ camera, clock, pointer }, delta) => {
    const graph = graphRef.current;
    if (!graph) return;

    const drag = dragState.current;
    const motionScale = reducedMotion || drag.active ? 0 : 1;
    const selectedNode = selectedId ? graphSceneNodes.find((node) => node.data.id === selectedId) : null;
    const focusX = selectedNode ? selectedNode.position[0] * 0.22 : 0;
    const focusY = selectedNode ? selectedNode.position[1] * 0.18 : 0;
    const targetCameraX = focusX + pointer.x * graphSceneConfig.camera.parallax * motionScale;
    const targetCameraY = focusY + pointer.y * graphSceneConfig.camera.parallax * motionScale;
    camera.position.x = MathUtils.damp(camera.position.x, targetCameraX, 3.5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, targetCameraY, 3.5, delta);
    camera.lookAt(focusX, focusY, 0);

    drag.advance(delta, reducedMotion, graphSceneConfig.idleRotationSpeed);
    graph.rotation.x = MathUtils.damp(graph.rotation.x, drag.pitch, reducedMotion ? 20 : 11, delta);
    graph.rotation.y = MathUtils.damp(graph.rotation.y, drag.yaw, reducedMotion ? 20 : 11, delta);

    if (!reducedMotion && !drag.active) {
      graph.position.y =
        Math.sin(clock.elapsedTime * 0.55) * graphSceneConfig.floatAmplitude;
      graph.rotation.z = Math.sin(clock.elapsedTime * 0.22) * 0.012;
    }
  });

  return (
    <group name="knowledge-graph-scene">
      <group ref={graphRef} name="rotatable-knowledge-world">
      <NeuralField3D reducedMotion={reducedMotion} />
      <GraphLinks3D
        activeColor={graphSceneConfig.colors.activeLink}
        color={graphSceneConfig.colors.link}
        focusedId={focusedId}
        highlightedIds={highlightedIds}
        links={graphSceneLinks}
        reducedMotion={reducedMotion}
        relatedIds={relatedIds}
      />
      <GraphNodes3D
        focusedId={focusedId}
        highlightedIds={highlightedIds}
        nodes={graphSceneNodes}
        reducedMotion={reducedMotion}
        relatedIds={relatedIds}
        selectedId={selectedId}
        dragState={dragState}
        onHover={onHover}
        onSelect={onSelect}
      />
      <GraphLabels3D
        focusedId={focusedId}
        nodes={graphSceneNodes}
        selectedId={selectedId}
      />
      <DigitalTwinEntity mode="model" scale={1.18} radius={0.2} />
      </group>
      {postProcessing && <EffectComposer multisampling={highQuality ? 2 : 0} enableNormalPass={false}>
        <Bloom
          intensity={highQuality ? 0.72 : 0.48}
          luminanceThreshold={1}
          luminanceSmoothing={0.18}
          mipmapBlur={highQuality}
          radius={0.62}
        />
      </EffectComposer>}
    </group>
  );
}
