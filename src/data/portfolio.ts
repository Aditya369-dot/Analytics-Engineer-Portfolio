export const portfolioNavigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Career", href: "#career" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Contact", href: "#contact" },
] as const;

export const portfolioLinks = {
  cv: "#contact",
  linkedin: "#contact",
  github: "#contact",
  email: "#contact",
} as const;

export const heroContent = {
  eyebrow: "Data × AI × Engineering",
  titleLead: "I build intelligence from",
  titleAccent: "complex data.",
  description:
    "I design and build data systems, analytics platforms and AI solutions that turn data into decisions and decisions into impact.",
  status: "Available for Data + AI opportunities",
  actions: {
    primary: { label: "Explore my work", href: "#projects" },
    secondary: { label: "View architecture", href: "#architecture" },
  },
} as const;

export const digitalTwinContent = {
  title: "Digital Twin",
  status: "Placeholder mode",
  description: "Abstract render · Replaceable asset",
  traits: ["Data Thinker", "System Builder", "Problem Solver"],
} as const;

export const socialLinks = [
  { label: "LinkedIn", href: portfolioLinks.linkedin, icon: "linkedin" },
  { label: "GitHub", href: portfolioLinks.github, icon: "github" },
  { label: "Email", href: portfolioLinks.email, icon: "email" },
] as const;

export const projects = [
  {
    number: "01",
    title: "Utility Operations Intelligence",
    description:
      "A concept interface for monitoring utility operations, reliability signals and field decision workflows.",
    tags: ["Operations", "Data Systems", "Analytics"],
    accent: "violet",
    visual: "utility",
    links: {
      demo: "#contact",
      architecture: "#architecture",
      github: "#contact",
      details: "#contact",
    },
  },
  {
    number: "02",
    title: "Financial Risk Intelligence",
    description:
      "A concept decision layer for exploring risk exposure, emerging patterns and portfolio signals.",
    tags: ["Risk", "Decision Intelligence", "Analytics"],
    accent: "blue",
    visual: "finance",
    links: {
      demo: "#contact",
      architecture: "#architecture",
      github: "#contact",
      details: "#contact",
    },
  },
  {
    number: "03",
    title: "Healthcare Operations Intelligence",
    description:
      "A concept operations view for connecting capacity, service flow and actionable care-delivery signals.",
    tags: ["Healthcare", "Operations", "Analytics"],
    accent: "cyan",
    visual: "healthcare",
    links: {
      demo: "#contact",
      architecture: "#architecture",
      github: "#contact",
      details: "#contact",
    },
  },
  {
    number: "04",
    title: "Multi-Agent Research System",
    description:
      "A concept AI workflow for coordinating research, synthesis and evidence-backed outputs.",
    tags: ["Applied AI", "Research", "Orchestration"],
    accent: "magenta",
    visual: "agents",
    links: {
      demo: "#contact",
      architecture: "#architecture",
      github: "#contact",
      details: "#contact",
    },
  },
] as const;

export const careerMilestones = [
  {
    year: "2020",
    role: "BI Analyst",
    employer: "Pro Football Focus",
    stage: "Data Analysis",
    accent: "violet",
    level: 38,
  },
  {
    year: "2021–2024",
    role: "BI Analyst",
    employer: "CapMetro",
    stage: "Business Intelligence",
    accent: "blue",
    level: 72,
  },
  {
    year: "2024",
    role: "Analytics Engineer",
    employer: "PG&E · Contract",
    stage: "Analytics Engineering",
    accent: "cyan",
    level: 120,
  },
  {
    year: "2025+",
    role: "Analytics Engineer",
    employer: "PG&E · FTE",
    stage: "Data Systems",
    accent: "cyan",
    level: 180,
  },
  {
    year: "2026+",
    role: "Building the Future",
    employer: null,
    stage: "AI & Platform Engineering",
    accent: "future",
    level: 240,
  },
] as const;

export const aboutContent = {
  label: "About / Operating principles",
  titleLead: "Engineer. Problem Solver.",
  titleAccent: "Data Alchemist.",
  bio: [
    "I’m Aditya Bholla, a Data + AI engineer focused on analytics engineering, data systems and applied AI.",
    "My career has evolved from business intelligence across sports, transit and utility operations toward building decision systems and intelligent platforms.",
  ],
  principles: ["Data Thinker", "System Builder", "Problem Solver"],
} as const;

// Repository-grounded career facts only. Replace with verified impact metrics in task 4.1.
export const impactMetrics = [
  { value: "2020", label: "Career foundation", detail: "First documented BI role" },
  { value: "05", label: "Career milestones", detail: "From BI to future platforms" },
  { value: "04", label: "Discipline stages", detail: "Analysis through applied AI" },
  { value: "03", label: "Career sectors", detail: "Sports · transit · utilities" },
] as const;

export const techStack = [
  { category: "Languages", items: ["Python", "TypeScript", "SQL"] },
  { category: "Data platforms", items: ["PostgreSQL", "Snowflake", "Palantir", "Power BI", "dbt"] },
  { category: "Cloud", items: ["Azure", "AWS"] },
  { category: "Applications", items: ["FastAPI", "React", "Next.js", "Tailwind", "Git"] },
] as const;

export const contactContent = {
  label: "Start a conversation",
  title: "Have a project in mind? Let’s talk.",
  description:
    "For Data + AI systems, analytics engineering and platform opportunities, reach out through any configured channel.",
  cta: { label: "Get in touch", href: portfolioLinks.email },
} as const;
