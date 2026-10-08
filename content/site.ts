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
  { label: "Why SIENA", href: "#why" },
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
 * Solutions modules. DRAFT copy for overview / result / connects / workflow / uses — edit freely.
 * id: used for the detail drawer · visual: the small drawing (SolutionVisual)
 * related: modules this one exchanges data with (the network lights these up on hover)
 */
/** Approved copy. */
export const WHAT = {
  eyebrow: "What SIENA does",
  headline: "We connect your business systems — and make them work intelligently together.",
  pillars: [
    { title: "Connect", body: "Your tools, data and teams, connected in one flow." },
    { title: "Automate", body: "Routine work moves reliably from one system to the next." },
    { title: "Add intelligence", body: "AI understands context, takes action and brings people in when judgment matters." },
  ],
};

/** DRAFT copy — the About section (first section after the hero). Formal, concise. Edit freely. */
export const ABOUT = {
  eyebrow: "About SIENA",
  headline: "Digital solutions, built around your business.",
  paragraphs: [
    "SIENA is a digital solutions company specializing in custom websites, mobile applications and digital systems, each tailored to the specific needs of our clients.",
    "We combine modern technology, thoughtful design and reliable development to deliver practical solutions that help businesses grow and operate more efficiently. Every engagement is guided by a clear understanding of your goals and delivered with precision.",
  ],
  services: [
    { title: "Custom Websites", body: "Professional, high-performing websites that represent your brand and serve your customers." },
    { title: "Mobile Applications", body: "Intuitive applications designed around the people who use them every day." },
    { title: "Digital Systems", body: "Integrated platforms and automation that streamline operations and connect your business." },
  ],
};

/** Approved copy. */
export const WHY = {
  eyebrow: "Why SIENA",
  headline: "Built around how your business already works.",
  points: [
    { title: "One system, not more tools", body: "We connect the software you already use instead of creating another isolated platform." },
    { title: "Designed around your workflows", body: "The system follows how your teams actually work — not the other way around." },
    { title: "People stay in control", body: "AI handles what can be automated and brings people in where judgment matters." },
    { title: "Built for daily operations", body: "Reliable, monitored and designed to become part of everyday work." },
  ],
};

/** the six functions at the end of the Evolution story (ids match the Solutions modules) */
export const STORY_FUNCTIONS = [
  { id: "finance", label: "Finance" },
  { id: "sales", label: "Sales" },
  { id: "service", label: "Customer Service" },
  { id: "operations", label: "Operations" },
  { id: "marketing", label: "Marketing" },
  { id: "analytics", label: "Data & Analytics" },
] as const;

export const SOLUTIONS = {
  eyebrow: "SIENA Solutions",
  headline: "One intelligent system across the whole business.",
  items: [
    {
      id: "finance", title: "Finance", visual: "finance",
      overview: ["SIENA connects your accounting software, bank feeds and invoicing into one continuous financial workflow. Incoming invoices are read, validated and recorded automatically, and reconciliation happens daily rather than at month end.", "Your finance team spends less time on data entry and more time on analysis. Cash-flow forecasts and management reports update as transactions arrive, giving leadership a current, reliable view of the business."],
      body: "Invoices, reconciliation, cash-flow forecasting and reporting that update themselves.",
      result: "Less manual work. Faster financial visibility.",
      related: ["operations", "analytics"],
      connects: ["Accounting software", "Bank feeds", "Invoicing", "ERP", "Spreadsheets", "Reporting"],
      workflow: ["Invoice received", "AI reads it", "System validates the data", "Accounting updates", "Cash-flow forecast updates", "Management sees the result"],
      uses: ["Invoice capture and matching", "Daily bank reconciliation", "Rolling cash-flow forecasts", "Month-end reporting packs"],
    },
    {
      id: "sales", title: "Sales", visual: "sales",
      overview: ["Every new enquiry is captured, scored and routed to the right person within minutes. SIENA enriches each lead with context from your CRM, website and email, so your team always knows who they are speaking to.", "Follow-ups are drafted and scheduled automatically, and your CRM stays accurate without manual updates. Pipeline reports refresh on their own, giving managers a clear and current picture of revenue."],
      body: "Lead scoring, CRM hygiene, follow-ups and pipeline insight without the busywork.",
      result: "Every lead followed up. A current pipeline.",
      related: ["service", "marketing", "analytics"],
      connects: ["CRM", "Email & calendar", "Website forms", "Lead sources", "Quotes & proposals"],
      workflow: ["New lead arrives", "AI scores and enriches it", "Routed to the right rep", "Follow-up drafted and scheduled", "CRM stays up to date", "Pipeline report refreshes"],
      uses: ["Lead scoring and routing", "Automatic follow-ups", "CRM clean-up", "Weekly pipeline insight"],
    },
    {
      id: "service", title: "Customer Service", visual: "service",
      overview: ["SIENA’s AI agents respond to customer messages across email and chat, drawing on order history, account details and your knowledge base to give accurate answers.", "Routine requests are resolved immediately, while complex or sensitive cases are routed to the right person with a full summary. Your team handles fewer repetitive tickets and can focus on the conversations that matter most."],
      body: "AI agents that resolve, route and escalate — with full context from every system.",
      result: "Faster answers. Fewer escalations.",
      related: ["sales", "operations", "ai"],
      connects: ["Help desk", "Email & chat", "CRM", "Order system", "Knowledge base"],
      workflow: ["Customer message arrives", "AI understands the request", "Order and account context pulled in", "Resolved, or routed to the right person", "Customer gets a clear answer", "Insights shared with the team"],
      uses: ["24/7 first response", "Smart routing and escalation", "Order-status answers", "Ticket summaries for agents"],
    },
    {
      id: "operations", title: "Operations", visual: "operations",
      overview: ["SIENA orchestrates the journey from order to delivery as a single flow. Stock is checked across locations, suppliers and warehouses are notified, and fulfilment is scheduled automatically.", "Customers and finance are updated at every step, and exceptions are flagged early so issues are resolved before they become delays. The result is fewer handoffs, fewer errors and a more predictable operation."],
      body: "Inventory, orders and fulfilment orchestrated as one flow, not ten tools.",
      result: "Fewer handoffs. Fewer delays.",
      related: ["finance", "service", "automation"],
      connects: ["Inventory", "Orders", "Suppliers", "Warehouse & fulfilment", "ERP"],
      workflow: ["Order placed", "Stock checked across locations", "Supplier or warehouse notified", "Fulfilment scheduled", "Customer and finance updated", "Exceptions flagged early"],
      uses: ["Order-to-delivery orchestration", "Low-stock alerts and reordering", "Supplier coordination", "Exception handling"],
    },
    {
      id: "marketing", title: "Marketing", visual: "marketing",
      overview: ["SIENA links your campaigns, website analytics and CRM to your revenue data, so every channel can be measured against the results it actually delivers.", "Campaign performance is summarised automatically, on-brand content can be drafted in minutes, and budget recommendations are prepared for your team to review. Investment decisions are based on evidence rather than assumption."],
      body: "Campaigns, content and attribution connected to real revenue data.",
      result: "Spend tied to revenue. Clearer priorities.",
      related: ["sales", "analytics"],
      connects: ["Ad platforms", "Website analytics", "CRM", "Email marketing", "Revenue data"],
      workflow: ["Campaign goes live", "Leads and engagement captured", "Matched to customers in the CRM", "Revenue attributed to each channel", "Budget recommendations prepared", "Team decides what to scale"],
      uses: ["Revenue attribution", "Campaign performance summaries", "On-brand content drafts", "Audience segmentation"],
    },
    {
      id: "analytics", title: "Data & Analytics", visual: "analytics",
      overview: ["SIENA brings data from every system into one connected, consistent view. Information is cleaned and linked automatically, and live dashboards replace manual spreadsheets.", "Beyond the numbers, SIENA explains what has changed and why, delivering short, clear briefings to leadership. Anomalies are flagged as they occur, so decisions are made on current information."],
      body: "Live dashboards and decision support that explain what changed and why.",
      result: "Live numbers. Faster decisions.",
      related: ["finance", "sales", "marketing"],
      connects: ["Every business system", "Data warehouse", "Spreadsheets", "BI dashboards"],
      workflow: ["Data collected from every system", "Cleaned and connected automatically", "Live dashboards update", "AI explains what changed and why", "Leaders get a short brief", "Decisions made on current numbers"],
      uses: ["Live executive dashboard", "Automated weekly briefs", "Anomaly alerts", "Forecasting"],
    },
    {
      id: "automation", title: "Automation", visual: "automation",
      overview: ["Many businesses still rely on people to move information between systems by hand. SIENA replaces this with reliable integrations that pass data between the tools you already use.", "Approvals, document generation and notifications run automatically, with every step logged and monitored. Double data entry disappears, errors are reduced and your team is free to focus on higher-value work."],
      body: "Reliable workflows and integrations across the software you already use.",
      result: "Routine work handled. Teams freed up.",
      related: ["operations", "ai"],
      connects: ["Your existing software", "APIs & webhooks", "Email", "Documents", "Approvals"],
      workflow: ["A form, email or system event", "Data moved to the right tools", "Rules and approvals applied", "Documents generated", "Everyone notified", "Logged and monitored"],
      uses: ["System-to-system integrations", "Approval flows", "Document generation", "No more double data entry"],
    },
    {
      id: "ai", title: "AI Workflows", visual: "ai",
      overview: ["SIENA designs custom AI agents and workflows around specific tasks in your business, from understanding documents to answering internal questions and supporting decisions.", "Each workflow gathers the right information, proposes or takes action, and brings a person in wherever judgment is required. Every result is recorded, so your team retains full visibility and control."],
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

/** DRAFT copy — Apps, the first solution on the homepage (replaces Finance there). Edit freely. */
export const APPS = {
  id: "apps", title: "Apps", visual: "ai",
  body: "Custom mobile and web applications, designed around how your business and your customers actually work.",
  overview: [
    "A well-built app turns everyday interactions into effortless experiences for your customers and your team. SIENA designs and develops custom mobile and web applications for businesses of every size, built around the way each business operates rather than a generic template.",
    "For restaurants, that means online ordering, table reservations and loyalty rewards connected directly to the kitchen and point of sale. For beauty centres and clinics, it means appointment booking, automated reminders, staff scheduling and client histories in one place. For delivery companies, it means live order tracking, driver dispatch and proof of delivery, with customers kept informed at every step.",
    "The same thinking applies across industries: retailers offering click-and-collect and personalised offers, gyms and studios managing memberships and class bookings, real-estate agencies sharing listings and scheduling viewings, schools and training centres keeping students and parents connected, and field-service teams receiving jobs, routes and reports on the move.",
    "What sets our approach apart is that we begin with the business, not the screens. We map your customer journey and internal workflows first, then design an app that fits them, and connect it to the systems you already rely on, such as your point of sale, CRM, inventory and payments, so information flows without double entry.",
    "Every app is built for real-world use: fast, intuitive and dependable on iOS, Android and the web, with AI added where it creates genuine value, from smart recommendations to automated customer support. After launch, we continue refining the app with you, guided by how people actually use it.",
  ],
  result: "An app your customers enjoy and your team relies on.",
  related: ["service", "operations", "ai"],
  connects: ["Point of sale", "CRM", "Payments", "Inventory", "Booking systems", "Delivery tracking"],
  workflow: ["Map your customers and workflows", "Design the experience", "Build for iOS, Android and web", "Connect your existing systems", "Launch and measure", "Refine with real usage"],
  uses: ["Ordering and reservations", "Bookings and reminders", "Delivery tracking", "Memberships and loyalty"],
} as const;

/** The solutions shown on the homepage (wheel, hero orbit, footer, contact form): Apps first, Finance removed. */
export const SERVICES = [APPS, ...SOLUTIONS.items.filter((i) => i.id !== "finance")];

export const CONTACT = {
  eyebrow: "Build your AI system",
  headline: "Let’s design the next evolution of your business.",
  body: "Tell us where your systems feel fragmented. We’ll map how SIENA can connect them into one intelligent flow.",
  cta: "Start the conversation",
};
