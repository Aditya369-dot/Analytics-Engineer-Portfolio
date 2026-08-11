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
Add approved CV, LinkedIn, GitHub, email, verified metrics, and final bio.

### 4.2 Project links
As projects are built, add live demo, architecture, GitHub, and case-study links.

## Milestone 5 — Intelligence Scene foundation
### 5.1 Scene state contract
Coordinate the existing graph and twin through shared selection and illumination state.

Acceptance:
- graph and twin remain independently reusable
- scene state has no retrieval/provider dependency
- existing responsive, reduced-motion, and fallback behavior is preserved

### 5.2 Integrated scene composition
Compose the twin as the central focal point with the graph spatially around and behind it. Preserve hero copy and actions.

Acceptance:
- desktop reads as one Intelligence Scene
- mobile fallback remains legible and operable
- no question-answer feature is introduced

### 5.3 Shared graph illumination
Allow scene state to illuminate supplied graph node IDs and relevant edges.

Acceptance:
- illumination is data-driven and distinct from hover/focus
- unknown IDs fail safely
- reduced-motion/static fallback communicates the same concepts

### 5.4 Scene QA
Validate performance, keyboard access, screen-reader context, responsive layout, WebGL fallback, and reduced motion.

## Milestone 6 — Curated portfolio knowledge base
### 6.1 Knowledge schema and initial corpus
Define public entries with stable source IDs, graph node IDs, and optional approved navigation targets.

Acceptance:
- entries derive from approved repository content
- no private notes, invented claims, or provider-specific fields
- schema is separate from rendering and retrieval

### 6.2 Deterministic retrieval boundary
Implement a provider-independent retrieval interface before generative answers.

Acceptance:
- questions return ranked source IDs and graph node IDs
- empty/unsupported queries fail clearly
- retrieval behavior has focused tests

## Milestone 7 — Ask the digital twin
### 7.1 Accessible text question interface
Add a text-first question and answer panel.

Acceptance:
- keyboard and screen-reader usable
- loading, empty, error, and unsupported states are explicit
- no voice or lip sync

### 7.2 Grounded answer pipeline
Add a server-only answer boundary limited to retrieved curated entries.

Acceptance:
- responses include grounding source IDs
- unsupported questions do not produce portfolio claims
- secrets/provider code stay out of the client bundle

### 7.3 Answer-to-graph synchronization
Illuminate returned graph concepts and expose supporting sources.

Acceptance:
- highlights match returned node IDs
- changing/clearing an answer clears stale illumination
- fallback UI presents the same concepts without WebGL

### 7.4 Guided portfolio navigation
Allow an answer to offer an explicit visitor-controlled link to relevant content.

Acceptance:
- targets are allowlisted and source-backed
- visitors confirm navigation through a visible action
- no autonomous browsing or redirect

## Milestone 8 — Public Obsidian authoring pipeline
### 8.1 Export design
Design a local script that scans **only** an explicitly configured public notes folder and emits the existing graph and knowledge contracts.

Acceptance:
- Obsidian is not a runtime dependency
- private paths and unreviewed notes cannot enter output
- export is deterministic and reviewable

### 8.2 Integrate reviewed export
Replace curated static inputs with reviewed export data while preserving contracts.

Acceptance:
- components require no Obsidian-specific changes
- malformed links and missing source IDs fail validation
- publishing requires a privacy review

## Milestone 9 — Optional voice
### 9.1 Voice input
Add opt-in speech input as an enhancement to text questions.

Acceptance:
- text input remains supported
- microphone permission follows explicit action
- recording and failure states are accessible

### 9.2 Spoken answers
Add optional playback for grounded answers.

Acceptance:
- playback requires visitor intent
- pause, replay, and text equivalents exist
- reduced-motion preferences remain respected

## Milestone 10 — Optional realistic lip sync
### 10.1 Feasibility and asset gate
Evaluate only after an approved rigged asset and voice experience exist.

Acceptance:
- no fabricated likeness is presented as Aditya
- performance, accessibility, rights, and fallback costs are documented
- implementation remains blocked without explicit approval

### 10.2 Lip-sync enhancement
If approved, add replaceable viseme animation without coupling answers to the model asset.

Acceptance:
- text/audio work without facial animation
- animation can be disabled independently
- mobile and reduced-motion fallbacks remain intact

## Milestone 11 — Production QA
- Lighthouse/performance pass
- metadata/OG
- mobile WebGL and Intelligence Scene fallback
- grounded-answer and source-link checks
- broken-link check
- reduced-motion check
- final build
- deploy Vercel

## Current task
The roadmap is documented. Do not begin a new implementation task unless the user names it explicitly.
