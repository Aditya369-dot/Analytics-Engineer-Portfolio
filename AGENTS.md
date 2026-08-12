# AGENTS.md

## Mission
Build a fast, polished, futuristic portfolio for Aditya Bholla that acts as a lightweight launcher for serious Data + AI projects.

## Read order
Before coding, read only what the task needs:
1. `docs/PRODUCT.md` for product intent and content.
2. `docs/DESIGN.md` for visual rules.
3. `docs/ARCHITECTURE.md` for technical constraints.
4. `docs/TASKS.md` for the current task and acceptance criteria.

Do not reread all docs if the current task is narrow.

## Core rules
- Next.js App Router + TypeScript.
- Tailwind CSS for styling.
- Use shadcn/ui only when it materially saves work; do not make the UI look like default shadcn.
- React Three Fiber / Three.js only for the hero knowledge graph and digital-twin scene.
- Prefer CSS/SVG/Framer Motion for ordinary effects.
- Reuse components before creating new ones.
- Keep components focused; avoid premature abstractions.
- No `any` unless unavoidable.
- Do not add dependencies without a clear need.
- Do not rewrite unrelated files.
- Do not change architecture or visual language without explicit instruction.
- Preserve accessibility and responsive behavior.
- Keep animation subtle and performant; respect `prefers-reduced-motion`.
- Never expose private Obsidian notes. Only consume explicitly exported public graph data.
- All career/project claims must come from repository content. Do not invent metrics, employers, dates, or technologies.

## Token-efficient operating mode
For each task:
1. Inspect only the files likely to be affected.
2. State a one-sentence implementation approach internally; do not produce a long plan unless asked.
3. Make the smallest coherent patch.
4. Run the narrowest relevant checks first.
5. Fix only failures caused by the change.
6. Summarize changed files and validation in <=6 bullets.

Avoid:
- Restating the product brief.
- Generating duplicate components.
- Large speculative refactors.
- Replacing working code to achieve small visual changes.
- Long explanations unless requested.

## Validation
Before declaring a task complete, run as applicable:
- `npm run lint`
- `npm run typecheck` if present
- `npm run build` for milestone tasks

For visual tasks, also verify desktop and mobile layouts in the browser when tooling permits.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
