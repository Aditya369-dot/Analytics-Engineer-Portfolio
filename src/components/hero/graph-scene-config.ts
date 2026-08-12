import {
  graphEdges,
  graphNodes,
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
    position: [0, 0, 7.4] as GraphPosition3D,
    fieldOfView: 40,
    parallax: 0.24,
  },
  colors: {
    background: "#080a12",
    link: "#6d66b8",
    activeLink: "#43d9ff",
    node: "#38cfff",
    coreNode: "#a67cff",
    relatedNode: "#738cff",
  },
  idleRotationSpeed: 0.035,
  floatAmplitude: 0.045,
  pixelRatio: [1, 1.5] as [min: number, max: number],
} as const;

const primaryPositions: Partial<Record<GraphNodeId, GraphPosition3D>> = {
  aditya: [0, 0, 0],
  "analytics-engineering": [-1.25, 1.05, 0.05],
  "data-engineering": [1.35, 1, -0.25],
  "ai-engineering": [0.1, -1.55, 0.15],
};

const clusteredPositions = Object.fromEntries(graphNodes.map((node, index) => {
  const fixed = primaryPositions[node.id];
  if (fixed) return [node.id, fixed];
  const ringIndex = index - 4;
  const angle = ringIndex * 2.39996;
  const radius = node.level === "secondary" ? 2.65 : 3.45;
  return [node.id, [Math.cos(angle) * radius, Math.sin(angle) * radius * .72, ((ringIndex * 37) % 9) * .11 - .44] as GraphPosition3D];
})) as Record<GraphNodeId, GraphPosition3D>;

export const graphSceneNodes: readonly GraphSceneNode[] = graphNodes.map((node) => ({
  data: node,
  position: clusteredPositions[node.id],
  radius: node.level === "central" ? .18 : node.level === "primary" ? .13 : 0.045 + node.importance * 0.045,
  color:
    node.level === "central"
      ? graphSceneConfig.colors.coreNode
      : node.level === "primary"
        ? "#d16cff"
      : graphSceneConfig.colors.node,
}));

export const graphSceneLinks: readonly GraphSceneLink[] = graphEdges.map((edge) => ({
  data: edge,
  source: clusteredPositions[edge.source],
  target: clusteredPositions[edge.target],
}));
