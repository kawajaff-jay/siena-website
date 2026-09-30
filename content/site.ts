/** Site-wide copy and settings. Edit freely. */

export const SITE = {
  name: "SIENA",
  tagline: "AI Solutions & Systems",
  url: "https://example.com", // TODO: replace with the production domain
  description:
    "SIENA builds intelligent business systems — AI integrations, automation and workflow optimization that connect finance, sales, service, operations, marketing and analytics.",
  /** TODO: replace with SIENA's real enquiry address */
  contactEmail: "contact@example.com",
};

export const NAV = [
  { label: "The Evolution", href: "#evolution" },
  { label: "Solutions", href: "#solutions" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  eyebrow: "SIENA — AI Solutions & Systems",
  headline: "The Evolution of Business Systems",
  lead: "From human records to intelligent systems.",
  cue: "Scroll through the evolution of how business works.",
};

export const REVEAL = {
  kicker1: "Centuries of business evolution",
  kicker2: "100 years of acceleration",
  lines: [
    { text: "From paper.", highlight: false },
    { text: "To software.", highlight: false },
    { text: "To intelligence.", highlight: true },
  ],
  support: "The next evolution of business systems.",
  ctas: [
    { label: "Explore Our Solutions", href: "#solutions", variant: "primary" as const },
    { label: "Build Your AI System", href: "#contact", variant: "ghost" as const },
  ],
};

export const SOLUTIONS = {
  eyebrow: "What SIENA connects",
  headline: "One intelligent system across the whole business.",
  items: [
    { title: "Finance", body: "Invoices, reconciliation, cash-flow forecasting and reporting that update themselves." },
    { title: "Sales", body: "Lead scoring, CRM hygiene, follow-ups and pipeline insight without the busywork." },
    { title: "Customer Service", body: "AI agents that resolve, route and escalate — with full context from every system." },
    { title: "Operations", body: "Inventory, orders and fulfilment orchestrated as one flow, not ten tools." },
    { title: "Marketing", body: "Campaigns, content and attribution connected to real revenue data." },
    { title: "Data & Analytics", body: "Live dashboards and decision support that explain what changed and why." },
    { title: "Automation", body: "Reliable workflows and integrations across the software you already use." },
    { title: "AI Workflows", body: "Custom agents and models, designed with human review where it matters." },
  ],
};

export const CONTACT = {
  eyebrow: "Build your AI system",
  headline: "Let’s design the next evolution of your business.",
  body: "Tell us where your systems feel fragmented. We’ll map how SIENA can connect them into one intelligent flow.",
  cta: "Start the conversation",
};
