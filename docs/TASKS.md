# TASKS.md

## Execution rule
Work on **one numbered task at a time** unless explicitly told otherwise.
Do not implement future tasks opportunistically.

## Milestone 0 — Scaffold
### 0.1 Initialize application
- Create Next.js App Router + TypeScript project.
- Configure Tailwind.
- Add only dependencies required for the immediate milestone.
- Ensure dev, lint and build work.

Acceptance:
- clean app boots
- no starter/demo clutter
- lint passes

### 0.2 Create design foundation
- Add CSS tokens for background, panels, text, violet, blue, cyan/status.
- Add chosen fonts.
- Create reusable page container, section label, button styles.

Acceptance:
- tokens are centralized
- no large component library abstraction

## Milestone 1 — Static homepage shell
### 1.1 Header
Build responsive header/nav and Download CV CTA.
Use placeholder href values from portfolio data when real URLs are unavailable.

### 1.2 Hero layout
Build hero geometry and copy only.
Create placeholder containers for graph and digital twin.
Do NOT implement WebGL yet.

Acceptance:
- composition matches DESIGN.md
- responsive stack works
- primary CTAs visible immediately

### 1.3 Projects section
Create data-driven project cards for four initial project categories.
Use lightweight placeholder visuals; do not generate elaborate illustrations in code.

### 1.4 Career trajectory
Implement desktop horizontal ascending timeline and mobile vertical timeline from data.
No canvas needed; prefer SVG/CSS.

### 1.5 About + impact + tech stack + contact
Complete remaining static sections.
All content data-driven.

### 1.6 Static milestone QA
- responsive desktop/tablet/mobile
- keyboard navigation
- lint
- build
- fix layout overflow

## Milestone 2 — Knowledge graph
### 2.1 Static graph prototype
Implement a lightweight interactive graph using `graph.ts`.
Before choosing 2D vs 3D, prefer the lowest-complexity implementation that achieves the DESIGN.md look.

### 2.2 Graph interaction
- hover connected-node highlighting
- node focus
- subtle pointer parallax
- idle motion
- reduced-motion behavior

### 2.3 Graph performance QA
Lazy load as needed and verify fallback.

## Milestone 3 — Digital twin
### 3.1 Twin placeholder scene
Implement the `DigitalTwin` component with a clearly replaceable asset contract.
If no real user asset exists, use abstract holographic geometry / silhouette fallback.

### 3.2 Real asset integration
BLOCKED until a real user-provided or user-approved 3D asset exists.
Do not fabricate a likeness and call it the user.

## Milestone 4 — Content + links
### 4.1 Replace placeholders
Add approved:
- CV
- LinkedIn
- GitHub
- email
- verified metrics
- final bio

### 4.2 Project links
As projects are built, add:
- live demo
- architecture
- GitHub
- case study

## Milestone 5 — Public Obsidian graph
### 5.1 Export design
Design a local script that scans **only** an explicitly configured public portfolio notes folder and converts wikilinks into `GraphNode[]` + `GraphEdge[]`.

### 5.2 Integrate export
Replace initial static graph data while preserving the graph component contract.

## Milestone 6 — Production QA
- Lighthouse/performance pass
- metadata/OG
- mobile WebGL fallback
- broken-link check
- reduced-motion check
- final build
- deploy Vercel

## Current task
Start with **0.1 only** unless the user gives a different task number.
