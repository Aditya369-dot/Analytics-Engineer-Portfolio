# PRODUCT.md

## Product
A premium personal portfolio for Aditya Bholla.

The website is a **showroom and launcher**, not the main product. Its purpose is to establish credibility quickly and route visitors into live industry-grade projects, architecture views, GitHub repositories, and case studies.

## Positioning
Primary identity:
- Data + AI Engineer
- Analytics Engineering
- Data Systems
- Applied / Agentic AI

Primary hero message:
**I BUILD INTELLIGENCE FROM COMPLEX DATA.**

Supporting copy:
“I design and build data systems, analytics platforms and AI solutions that turn data into decisions and decisions into impact.”

## Primary audience
- Recruiters
- Hiring managers
- Engineering leaders
- Data / AI practitioners

Within ~10 seconds they should understand:
1. What Aditya does.
2. That he builds serious Data + AI systems.
3. Which industries/projects he has worked on or built for demonstration.
4. How his career evolved.
5. Where to view live work, architecture, GitHub, CV, LinkedIn, and contact details.

## Page structure
Single-page homepage initially.

Order:
1. Header / navigation
2. Hero
3. Industry Projects
4. Career Trajectory
5. About + Impact + Tech Stack
6. Contact CTA / footer

Future project detail pages can use `/projects/[slug]`.

## Header
Left: `AB.` mark.
Nav:
- Home
- About
- Projects
- Career
- Tech Stack
- Contact

Right CTA:
- Download CV

Header should be sticky or gently become more solid on scroll.

## Hero
Desktop layout = three visual zones:
- Left: positioning + CTA
- Center: interactive knowledge graph
- Right: digital twin

Left content:
- Eyebrow: `DATA × AI × ENGINEERING`
- H1: `I BUILD INTELLIGENCE FROM COMPLEX DATA.`
- Supporting copy from above.
- Primary CTA: `EXPLORE MY WORK`
- Secondary CTA: `VIEW ARCHITECTURE`
- Small availability/status line.
- Social icons: LinkedIn, GitHub, email. Additional social only if configured.

### Knowledge graph
The center visual is an Obsidian-inspired interactive knowledge graph, not a decorative globe.

Initial highlighted concepts:
- Analytics Engineering (central)
- Data Engineering
- AI Agents
- RAG
- Semantic Layer
- Palantir Foundry
- SQL
- Python
- Power BI

Behavior:
- slow idle movement
- cursor-responsive parallax/rotation
- hover highlights connected nodes
- labels for major nodes
- click can focus a node and reveal direct relationships
- public graph data can later be generated from selected Obsidian markdown notes

Do NOT connect directly to the private vault in v1.

### Digital twin
Right-side holographic 3D representation of Aditya.

For v1, support a replaceable placeholder asset because the final real 3D asset will be supplied later.

Card title: `DIGITAL TWIN`
Traits:
- Data Thinker
- System Builder
- Problem Solver

Interaction:
- subtle idle motion
- cursor parallax
- optional `INTERACT` control
- should feel like a holographic technical scan, not a gaming avatar

## Industry Projects
Section title: `INDUSTRY PROJECTS`.

Initial categories/cards:
1. Utility Operations Intelligence
2. Financial Risk Intelligence
3. Healthcare Operations Intelligence
4. Multi-Agent Research System

These are initially presentation entries; project details can be replaced as real projects are built.

Each card should support:
- project number
- visual
- title
- one-sentence description
- 2–4 technology/category tags
- Live Demo
- Architecture
- GitHub
- Details arrow

Project cards should be data-driven from one config file.

## Career Trajectory
Must communicate evolution rather than simply list jobs.

Visual: horizontal ascending trajectory/timeline on desktop and vertical timeline on mobile.

Current known stages:
- 2020 — BI Analyst — Pro Football Focus
- 2021–2024 — BI Analyst — CapMetro
- 2024 — Analytics Engineer — PG&E (Contract)
- 2025+ — Analytics Engineer — PG&E (FTE)
- 2026+ — Building the Future

The visual progression should communicate:
`Data Analysis → Business Intelligence → Analytics Engineering → AI & Platform Engineering`

Keep employer/title/date data in a single editable data file. Do not hardcode it into multiple components.

## About
Heading style:
`Engineer. Problem Solver.`
`Data Alchemist.`

Short bio only. No wall of text.

## Impact cards
Use only verified values from content configuration. Initial placeholders may be marked clearly in code until verified.
Potential metrics:
- Years Experience
- Projects Delivered
- Industries Impacted
- Users Impacted

Do not present unverified placeholders to production users.

## Tech stack
Compact technology pills/logos.
Likely initial set:
- Python
- TypeScript
- SQL
- PostgreSQL
- Snowflake
- Palantir
- Power BI
- dbt
- Azure
- AWS
- FastAPI
- React
- Next.js
- Tailwind
- Git

Avoid presenting tools Aditya has not approved.

## Footer
CTA:
`Have a project in mind? Let’s talk.`

Button:
`GET IN TOUCH`

Include LinkedIn, email, GitHub.

## Non-goals for v1
- Blog
- CMS
- Authentication
- Database
- Complex backend
- Publishing private Obsidian content
- Full 3D avatar creation pipeline
- Admin dashboard

## Success criteria
- Feels custom, premium and memorable.
- Project content is easy to add/edit.
- Fast enough that 3D does not harm usability.
- Mobile experience remains excellent.
- Recruiters can reach projects/CV/contact without learning the interface.
