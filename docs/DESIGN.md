# DESIGN.md

## North star
Futuristic **Data + AI command center**.

Reference mood:
- obsidian black
- deep graphite panels
- neon violet / electric blue as primary accents
- rare cyan/green status accents
- technical HUD details
- graph/network motifs
- polished enterprise software, not a video game

Desired feeling:
`Palantir × Linear × futuristic operating system`

Avoid:
- generic SaaS landing page
- excessive glassmorphism
- rainbow gradients
- giant blobs
- cartoon avatars
- excessive cyberpunk clutter
- Matrix-style code rain
- animation that blocks navigation
- default component-library appearance

## Color system
Use CSS variables/tokens rather than scattered literals.

Suggested direction (adjust for accessibility):
- background: near-black / blue-black
- panel: slightly lifted graphite
- panel border: low-opacity cool gray/violet
- primary text: near-white
- secondary text: cool gray
- violet accent
- electric blue accent
- cyan/green only for secondary signals/status

Gradients should be localized to glows, graph edges, CTAs, and small accents.

## Typography
- Clean technical sans-serif.
- Strong condensed/technical display feeling is welcome for headlines if readable.
- Large hero typography, tight tracking.
- Uppercase micro-labels with generous letter spacing.
- Body text concise with comfortable line height.

Use at most 2 font families.

## Layout
Desktop max content width approximately 1440px.
Use generous horizontal margins and strict alignment.

Hero should feel ~one viewport high without forcing it exactly.
Desktop hero composition:
- 34–38% copy
- 28–32% graph
- 30–34% twin

On tablet/mobile:
- stack hero copy first
- graph second
- digital twin third or collapse twin into a shorter panel

## Surfaces
Panels:
- subtle border
- very subtle inner/outer glow
- dark translucent fill only where appropriate
- 14–20px radius range

No heavy shadows.

## Knowledge graph visual
- dark 3D/2.5D space
- violet/blue edges
- bright nodes with varied importance
- larger central `Analytics Engineering` node
- labels sparse enough to remain readable
- micro-particles acceptable
- do not render every Obsidian node label at once

## Digital twin visual
- holographic wireframe/point-cloud/scan-line aesthetic
- violet/blue illumination
- positioned on a subtle circular scanner/platform
- never let the model overpower the headline
- real asset must be easily replaceable

## Project cards
4-column grid on wide screens, 2-column tablet, 1-column mobile.

Card anatomy:
1. visual region
2. title
3. compact description
4. tags
5. actions

Each industry may have a controlled accent:
- utility: violet
- finance: blue
- healthcare: cyan/green
- agents: violet/magenta

Keep accents restrained.

## Career trajectory
Dark panel with an ascending luminous curve/line.
Milestone nodes sit on/near the trajectory.
Color evolution can subtly move through:
- violet = analysis
- blue = BI
- cyan = analytics engineering
- green/violet blend = AI/platform

Desktop: horizontal.
Mobile: vertical, no tiny text.

## Motion
Animation hierarchy:
1. Hero graph + twin: continuous subtle motion.
2. Scroll entrance: short fade/translate.
3. Hover: glow/edge response.
4. Micro-interactions: button arrow, status pulse.

Rules:
- No long intro loader.
- If an initialization sequence is used later, max ~1 second and skippable/non-blocking.
- Avoid continuous animation outside hero unless lightweight.
- Respect reduced-motion preference.

## Responsiveness
Mobile is a first-class experience, not a scaled desktop screenshot.
- No horizontal scrolling.
- Buttons remain thumb-friendly.
- 3D may reduce quality or disable expensive effects on small/low-power devices.
- Keep important content available even if WebGL fails.

## Accessibility
- Semantic headings.
- Keyboard-accessible controls.
- Visible focus states.
- Sufficient text contrast.
- Graph/twin are enhancements; provide textual equivalents.
