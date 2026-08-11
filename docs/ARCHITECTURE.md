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
      KnowledgeGraph.tsx
      DigitalTwin.tsx
    ui/
  data/
    portfolio.ts
    graph.ts
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
- external links use safe attributes where appropriate

## Testing priority
v1 testing focuses on:
1. Type safety
2. lint/build
3. data rendering
4. responsive navigation
5. critical CTA links

Do not create a large test suite for static visual components unless logic warrants it.
