import {
  graphEdges,
  graphNodes,
  graphPresentation,
  type GraphEdge,
  type GraphNode,
  type GraphNodeId,
} from "@/data/graph-data";

export type GraphPosition3D = readonly [x: number, y: number, z: number];

export type GraphSceneNode = {
  data: GraphNode;
  position: GraphPosition3D;
  radius: number;
  color: string;
};

export type GraphSceneLink = {
  data: GraphEdge;
  source: GraphPosition3D;
  target: GraphPosition3D;
};

export const graphSceneConfig = {
  camera: {
    position: [0, 0, 7] as GraphPosition3D,
    fieldOfView: 42,
  },
  colors: {
    background: "#080a12",
    link: "#53647f",
    node: "#33d6ff",
    coreNode: "#9a6bff",
  },
  idleRotationSpeed: 0.055,
  pixelRatio: [1, 1.5] as [min: number, max: number],
} as const;

function toScenePosition(id: GraphNodeId): GraphPosition3D {
  const { x, y, depth } = graphPresentation[id];

  return [(x - 200) / 58, (184 - y) / 58, (depth - 0.78) * 3];
}

const positionsById = Object.fromEntries(
  graphNodes.map((node) => [node.id, toScenePosition(node.id)]),
) as Record<GraphNodeId, GraphPosition3D>;

export const graphSceneNodes: readonly GraphSceneNode[] = graphNodes.map((node) => ({
  data: node,
  position: positionsById[node.id],
  radius: 0.09 + node.importance * 0.09,
  color:
    node.id === "analytics-engineering"
      ? graphSceneConfig.colors.coreNode
      : graphSceneConfig.colors.node,
}));

export const graphSceneLinks: readonly GraphSceneLink[] = graphEdges.map((edge) => ({
  data: edge,
  source: positionsById[edge.source],
  target: positionsById[edge.target],
}));
