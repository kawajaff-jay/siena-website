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
  storyCta: "Experience the Evolution",
  storyNote: "From paper to intelligence.",
  secondaryCta: "Explore solutions",
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
  /** ending of the full-screen Evolution story */
  storyCta: { label: "Build Your AI System", href: "#solutions" },
  storySecondary: { label: "Explore our solutions", href: "#solutions" },
};

/**
 * Solutions modules. DRAFT copy for result / connects / workflow / uses — edit freely.
 * id: used for the detail drawer · visual: the small drawing (SolutionVisual)
 * related: modules this one exchanges data with (the network lights these up on hover)
 */
export const SOLUTIONS = {
  eyebrow: "What SIENA connects",
  headline: "One intelligent system across the whole business.",
  items: [
    {
      id: "finance", title: "Finance", visual: "finance",
      body: "Invoices, reconciliation, cash-flow forecasting and reporting that update themselves.",
      result: "Less manual work. Faster financial visibility.",
      related: ["operations", "analytics"],
      connects: ["Accounting software", "Bank feeds", "Invoicing", "ERP", "Spreadsheets", "Reporting"],
      workflow: ["Invoice received", "AI reads it", "System validates the data", "Accounting updates", "Cash-flow forecast updates", "Management sees the result"],
      uses: ["Invoice capture and matching", "Daily bank reconciliation", "Rolling cash-flow forecasts", "Month-end reporting packs"],
    },
    {
      id: "sales", title: "Sales", visual: "sales",
      body: "Lead scoring, CRM hygiene, follow-ups and pipeline insight without the busywork.",
      result: "Every lead followed up. A current pipeline.",
      related: ["service", "marketing", "analytics"],
      connects: ["CRM", "Email & calendar", "Website forms", "Lead sources", "Quotes & proposals"],
      workflow: ["New lead arrives", "AI scores and enriches it", "Routed to the right rep", "Follow-up drafted and scheduled", "CRM stays up to date", "Pipeline report refreshes"],
      uses: ["Lead scoring and routing", "Automatic follow-ups", "CRM clean-up", "Weekly pipeline insight"],
    },
    {
      id: "service", title: "Customer Service", visual: "service",
      body: "AI agents that resolve, route and escalate — with full context from every system.",
      result: "Faster answers. Fewer escalations.",
      related: ["sales", "operations", "ai"],
      connects: ["Help desk", "Email & chat", "CRM", "Order system", "Knowledge base"],
      workflow: ["Customer message arrives", "AI understands the request", "Order and account context pulled in", "Resolved, or routed to the right person", "Customer gets a clear answer", "Insights shared with the team"],
      uses: ["24/7 first response", "Smart routing and escalation", "Order-status answers", "Ticket summaries for agents"],
    },
    {
      id: "operations", title: "Operations", visual: "operations",
      body: "Inventory, orders and fulfilment orchestrated as one flow, not ten tools.",
      result: "Fewer handoffs. Fewer delays.",
      related: ["finance", "service", "automation"],
      connects: ["Inventory", "Orders", "Suppliers", "Warehouse & fulfilment", "ERP"],
      workflow: ["Order placed", "Stock checked across locations", "Supplier or warehouse notified", "Fulfilment scheduled", "Customer and finance updated", "Exceptions flagged early"],
      uses: ["Order-to-delivery orchestration", "Low-stock alerts and reordering", "Supplier coordination", "Exception handling"],
    },
    {
      id: "marketing", title: "Marketing", visual: "marketing",
      body: "Campaigns, content and attribution connected to real revenue data.",
      result: "Spend tied to revenue. Clearer priorities.",
      related: ["sales", "analytics"],
      connects: ["Ad platforms", "Website analytics", "CRM", "Email marketing", "Revenue data"],
      workflow: ["Campaign goes live", "Leads and engagement captured", "Matched to customers in the CRM", "Revenue attributed to each channel", "Budget recommendations prepared", "Team decides what to scale"],
      uses: ["Revenue attribution", "Campaign performance summaries", "On-brand content drafts", "Audience segmentation"],
    },
    {
      id: "analytics", title: "Data & Analytics", visual: "analytics",
      body: "Live dashboards and decision support that explain what changed and why.",
      result: "Live numbers. Faster decisions.",
      related: ["finance", "sales", "marketing"],
      connects: ["Every business system", "Data warehouse", "Spreadsheets", "BI dashboards"],
      workflow: ["Data collected from every system", "Cleaned and connected automatically", "Live dashboards update", "AI explains what changed and why", "Leaders get a short brief", "Decisions made on current numbers"],
      uses: ["Live executive dashboard", "Automated weekly briefs", "Anomaly alerts", "Forecasting"],
    },
    {
      id: "automation", title: "Automation", visual: "automation",
      body: "Reliable workflows and integrations across the software you already use.",
      result: "Routine work handled. Teams freed up.",
      related: ["operations", "ai"],
      connects: ["Your existing software", "APIs & webhooks", "Email", "Documents", "Approvals"],
      workflow: ["A form, email or system event", "Data moved to the right tools", "Rules and approvals applied", "Documents generated", "Everyone notified", "Logged and monitored"],
      uses: ["System-to-system integrations", "Approval flows", "Document generation", "No more double data entry"],
    },
    {
      id: "ai", title: "AI Workflows", visual: "ai",
      body: "Custom agents and models, designed with human review where it matters.",
      result: "Faster execution. Human oversight.",
      related: ["service", "automation", "analytics"],
      connects: ["Your data and documents", "Business systems", "AI models", "Human reviewers"],
      workflow: ["Request comes in", "Agent understands the goal", "Gathers the right data", "Proposes or takes the action", "A person reviews where it matters", "Result recorded"],
      uses: ["Custom AI agents", "Document understanding", "Internal knowledge assistant", "Decision support with review"],
    },
  ],
  drawer: {
    connects: "What SIENA connects",
    workflow: "How it works",
    uses: "Where it helps",
    outcome: "Outcome",
    cta: "Build Your AI System",
  },
} as const;

export type Solution = (typeof SOLUTIONS.items)[number];

export const CONTACT = {
  eyebrow: "Build your AI system",
  headline: "Let’s design the next evolution of your business.",
  body: "Tell us where your systems feel fragmented. We’ll map how SIENA can connect them into one intelligent flow.",
  cta: "Start the conversation",
};
