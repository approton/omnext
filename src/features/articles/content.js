export const articles = [
  {
    slug: "building-digital-with-intent",
    title: "Building digital with intent",
    description:
      "A practical starting point for turning a technology ambition into a focused, useful first release.",
    category: "Digital strategy",
    date: "2026-06-18",
    readTime: "5 min read",
    body: [
      "The strongest digital work starts with a clear understanding of the people it serves. Before selecting a platform or writing code, make the problem specific: who experiences it, what gets in their way, and what would meaningfully improve their day?",
      "A focused first release creates room to learn. Define the smallest useful outcome, agree how you will recognize progress, then build a path that can grow without carrying unnecessary complexity.",
      "Good technology decisions connect product, design and engineering from the beginning. Shared context helps teams make trade-offs deliberately and keeps the solution grounded in the work it needs to do.",
    ],
  },
  {
    slug: "a-clearer-path-from-idea-to-product",
    title: "A clearer path from idea to product",
    description:
      "How discovery, prototyping and delivery fit together to reduce uncertainty early.",
    category: "Product thinking",
    date: "2026-05-27",
    readTime: "4 min read",
    body: [
      "Ideas become stronger when teams put them in front of the people they are meant to help. Early conversations and simple prototypes can uncover assumptions long before those assumptions become expensive to change.",
      "A useful discovery process creates alignment around the outcome, the constraints and the first steps. It should produce decisions a team can act on, not documents that sit apart from delivery.",
      "From there, short feedback loops help a product mature. Each release should make progress visible and provide evidence for what to improve next.",
    ],
  },
  {
    slug: "making-room-for-resilient-systems",
    title: "Making room for resilient systems",
    description: "Small architectural choices that make software easier to operate and evolve.",
    category: "Engineering",
    date: "2026-04-30",
    readTime: "6 min read",
    body: [
      "Resilience is built from everyday engineering habits: clear boundaries, observable behavior and failure modes that teams understand. It does not require every system to begin with the most elaborate architecture.",
      "Start with the needs you can see today. Keep modules cohesive, make configuration explicit, and ensure important operations can be understood from useful logs and diagnostics.",
      "As usage and requirements grow, a well-shaped foundation gives teams options. Thoughtful constraints make it easier to add capability without turning each change into a rewrite.",
    ],
  },
];

export const searchItems = [
  {
    title: "Digital product engineering",
    description: "Design and build dependable digital products and web experiences.",
    category: "Capability",
    href: "/products",
  },
  {
    title: "Cloud & platform engineering",
    description: "Secure foundations, delivery pipelines and adaptable platforms.",
    category: "Capability",
    href: "/products",
  },
  {
    title: "Modernize with purpose",
    description: "Improve systems and workflows while protecting what already works.",
    category: "Solution",
    href: "/solutions#modernize",
  },
  {
    title: "Launch a digital product",
    description: "Shape a clear direction and deliver a focused first release.",
    category: "Solution",
    href: "/solutions#launch",
  },
  {
    title: "Scale digital capability",
    description: "Build architecture and practices that support change.",
    category: "Solution",
    href: "/solutions#scale",
  },
  ...articles.map((article) => ({
    title: article.title,
    description: article.description,
    category: article.category,
    href: `/blog/${article.slug}`,
  })),
];
