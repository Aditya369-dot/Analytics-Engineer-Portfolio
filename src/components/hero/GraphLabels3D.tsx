import { useEffect, useMemo } from "react";
import { CanvasTexture, LinearFilter, SpriteMaterial } from "three";

import type { GraphNodeId } from "@/data/graph-data";
import type { GraphSceneNode } from "./graph-scene-config";
import { graphSceneLinks } from "./graph-scene-config";

type GraphLabels3DProps = {
  focusedId: GraphNodeId | null;
  nodes: readonly GraphSceneNode[];
  selectedId: GraphNodeId | null;
};

function GraphLabel({ node, opacity, prominent }: { node: GraphSceneNode; opacity: number; prominent: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 96;

    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = `${prominent ? 700 : 600} ${prominent ? 25 : 21}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = prominent ? "rgba(7, 9, 18, .92)" : "rgba(7, 9, 18, .78)";
      context.roundRect(18, 19, 476, 58, 14);
      context.fill();
      context.strokeStyle = prominent ? "rgba(69, 217, 255, .65)" : "rgba(135, 148, 185, .28)";
      context.lineWidth = prominent ? 1.5 : 1;
      context.stroke();
      context.fillStyle = prominent ? "#ffffff" : "#dce5f7";
      context.shadowColor = prominent ? "#45d9ff" : "#6b75a5";
      context.shadowBlur = prominent ? 10 : 3;
      context.fillText(node.data.label.toUpperCase(), 256, 49);
    }

    const result = new CanvasTexture(canvas);
    result.minFilter = LinearFilter;
    result.generateMipmaps = false;
    return result;
  }, [node.data.label, prominent]);
  const material = useMemo(
    () => new SpriteMaterial({ map: texture, depthTest: false, depthWrite: false, opacity, transparent: true }),
    [opacity, texture],
  );

  useEffect(
    () => () => {
      material.dispose();
      texture.dispose();
    },
    [material, texture],
  );

  return (
    <sprite
      material={material}
      position={[node.position[0], node.position[1] + node.radius + 0.2, node.position[2]]}
      raycast={() => undefined}
      renderOrder={10}
      scale={[prominent ? 1.65 : 1.35, prominent ? 0.31 : 0.25, 1]}
    />
  );
}

export function GraphLabels3D({ focusedId, nodes, selectedId }: GraphLabels3DProps) {
  const connectedIds = new Set<GraphNodeId>();
  if (focusedId) {
    connectedIds.add(focusedId);
    graphSceneLinks.forEach(({ data }) => {
      if (data.source === focusedId) connectedIds.add(data.target);
      if (data.target === focusedId) connectedIds.add(data.source);
    });
  }

  return (
    <group name="knowledge-graph-labels">
      {nodes.map((node) => {
        if (node.data.level === "tertiary" && node.data.id !== focusedId && node.data.id !== selectedId) return null;
        const prominent =
            node.data.id === focusedId ||
            node.data.id === selectedId ||
            node.data.level === "central" || node.data.level === "primary";
        return <GraphLabel key={node.data.id} node={node} prominent={prominent} opacity={focusedId && !connectedIds.has(node.data.id) ? 0.28 : prominent ? 1 : 0.86} />;
      })}
    </group>
  );
}
