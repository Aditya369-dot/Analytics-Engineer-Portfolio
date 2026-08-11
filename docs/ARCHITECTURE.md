# ARCHITECTURE.md

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion / Motion for lightweight UI animation
- React Three Fiber + Drei for WebGL hero elements when needed
- Lucide React for generic UI icons
- Vercel deployment

Do not add a backend/database for v1.

## Suggested source structure
```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    layout/
      Header.tsx
      Footer.tsx
    sections/
      Hero.tsx
      Projects.tsx
      CareerTrajectory.tsx
      About.tsx
      Contact.tsx
    hero/
      IntelligenceScene.tsx
      KnowledgeGraph.tsx
      DigitalTwin.tsx
      AskTwinPanel.tsx
      GraphNodeDetails.tsx
    ui/
  data/
    portfolio.ts
    graph.ts
    knowledge-base.ts
  lib/
    cn.ts
  types/
    portfolio.ts
public/
  images/
  models/
docs/
```

Adapt to the actual scaffold if it differs; do not churn folders solely to match this example.

## Data-driven content
All frequently edited portfolio content should live in `src/data/portfolio.ts` (or equivalent):
- nav
- social links
- project metadata
- career milestones
- skills
- impact metrics

Graph data should live separately in `src/data/graph.ts`.

Components should render data; do not duplicate content literals across files.

## Intelligence Scene architecture
`IntelligenceScene` will coordinate the digital twin, knowledge graph, and question interface. It owns shared presentation state; the graph and twin remain reusable renderers with replaceable data and model assets.

Build it in independent stages: integrate the composition, add shared selection/illumination, define the curated knowledge boundary, add grounded text answers, then consider voice and lip sync separately. Do not couple scene layout, graph rendering, retrieval, or model loading.

```ts
type IntelligenceSceneState = {
  selectedNodeId?: string;
  illuminatedNodeIds: string[];
  question: string;
  answer?: GroundedAnswer;
};

type GroundedAnswer = {
  text: string;
  sourceIds: string[];
  nodeIds: string[];
  navigationTarget?: string;
};
```

## Graph data contract
Initial static shape:
```ts
export type GraphNode = {
  id: string;
  label: string;
  category: "core" | "data" | "analytics" | "ai" | "platform" | "tool";
  importance?: number;
};

export type GraphEdge = {
  source: string;
  target: string;
};
```

Future Obsidian export script can produce the same contract from an explicitly public vault folder.

## Curated knowledge contract
The runtime knowledge base is a reviewed, public artifact owned by the repository:
```ts
export type KnowledgeEntry = {
  id: string;
  title: string;
  content: string;
  nodeIds: string[];
  href?: string;
};
```

The answer flow is `question -> retrieve curated entries -> generate grounded answer -> return source IDs and node IDs -> illuminate graph -> offer relevant navigation`.

Retrieval and model calls must use a server-only boundary when introduced. Provider credentials never enter client bundles. Unsupported questions must produce a clear limitation instead of an invented claim.

Obsidian is a future authoring/source system only. A local export may transform an explicitly configured public notes folder into the same graph and knowledge contracts. The deployed site never requires Obsidian, vault access, or private notes at runtime.

## Digital twin contract
`DigitalTwin` must accept a configurable asset path / render mode so a placeholder can later be replaced by a real GLB/GLTF without restructuring the hero.

Suggested API:
```ts
type DigitalTwinProps = {
  modelUrl?: string;
  fallbackImage?: string;
};
```

If no real asset exists, render an elegant placeholder scene rather than pretending it is the user's likeness.

## Performance budget
Aim for:
- static content first paint unaffected by WebGL initialization
- lazy-load expensive 3D
- cap device pixel ratio for canvas
- minimize postprocessing
- no giant video backgrounds
- optimized images
- route-level code splitting via Next defaults

If performance conflicts with a visual effect, keep the visual identity and simplify the effect.

## WebGL failure strategy
The hero must still communicate correctly if canvas/WebGL fails.
Use graceful fallback visuals and accessible text.
The question interface and grounded sources remain usable without the spatial scene; concept illumination may degrade to a static highlighted list.

## SEO / metadata
Configure:
- title
- description
- Open Graph metadata
- favicon / `AB.` mark
- sensible semantic HTML

## Security / privacy
- no secrets in client code
- no private Obsidian vault access
- no personal data beyond content explicitly added to `portfolio.ts`
- retrieval restricted to reviewed portfolio knowledge entries
- grounded answers retain source IDs and never imply unsupported claims
- navigation targets limited to allowlisted internal routes or approved external links
- external links use safe attributes where appropriate

## Testing priority
v1 testing focuses on:
1. Type safety
2. lint/build
3. data rendering
4. responsive navigation
5. critical CTA links
6. grounded retrieval and source mapping
7. graph illumination state and non-WebGL fallback

Do not create a large test suite for static visual components unless logic warrants it.
