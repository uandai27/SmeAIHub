export type DealIndustry = "Restaurant" | "Hotel";

export type DealMilestone = {
  title: string;
  description: string;
  timing: string;
};

export type DealScopeItem = {
  title: string;
  description: string;
  owner: "SmeAIHub" | "Customer" | "Shared";
};

export type DealQuestion = {
  question: string;
  answer: string;
  reference: string;
  keywords: string[];
};

export type Deal = {
  slug: string;
  reference: string;
  customer: {
    name: string;
    location: string;
    industry: DealIndustry;
    logo: string;
  };
  status: "Ready for review";
  validUntil: string;
  summary: string;
  outcome: string;
  pilot: {
    duration: string;
    setupFee: number;
    monthlyFee: number;
    currency: "PHP";
    firstPayment: number;
  };
  scope: DealScopeItem[];
  milestones: DealMilestone[];
  successMetrics: string[];
  customerResponsibilities: string[];
  questions: DealQuestion[];
};

const sharedQuestions: DealQuestion[] = [
  {
    question: "When does the monthly fee begin?",
    answer:
      "The first monthly platform fee is included in the initial payment. Future monthly fees are due on the same billing date while the pilot remains active.",
    reference: "Commercial terms · Billing",
    keywords: ["monthly", "month", "fee", "billing", "payment", "pay"],
  },
  {
    question: "What happens after the 90-day pilot?",
    answer:
      "Before the pilot ends, both parties review the agreed success measures. Any extension or conversion to a standard subscription is confirmed separately; the pilot does not silently become a long-term contract.",
    reference: "Pilot terms · Renewal",
    keywords: ["90", "after", "pilot", "renew", "renewal", "end", "convert"],
  },
  {
    question: "How is our business data protected?",
    answer:
      "Customer data is used only to deliver the agreed SmeAIHub services. Access is limited to authorized delivery personnel, and customer data is not sold or used to train public AI models.",
    reference: "Data protection · Customer data",
    keywords: ["data", "privacy", "protect", "security", "train", "model"],
  },
  {
    question: "Can AI change the contract terms?",
    answer:
      "No. The assistant can explain approved terms, but it cannot change pricing, scope, liability, privacy, termination, or any other binding provision. Requested changes must be reviewed by UandWorld LLC.",
    reference: "Contract assistant · Authority",
    keywords: ["change", "modify", "contract", "terms", "ai"],
  },
];

export const deals: Deal[] = [
  {
    slug: "kazuko-ramenba-pilot",
    reference: "KZR-PILOT-001",
    customer: {
      name: "Kazuko Ramenba Japanese Restaurant",
      location: "Makati, Philippines",
      industry: "Restaurant",
      logo: "/partners/kazuko-ramenba.svg",
    },
    status: "Ready for review",
    validUntil: "August 15, 2026",
    summary:
      "A focused 90-day implementation to turn restaurant knowledge into faster guest responses, a reliable inquiry workflow, and a repeatable foundation for customer growth.",
    outcome:
      "Give the Kazuko Ramenba team one trusted place to manage restaurant knowledge and customer inquiries while reducing repetitive manual work.",
    pilot: {
      duration: "90 days",
      setupFee: 20000,
      monthlyFee: 9900,
      currency: "PHP",
      firstPayment: 29900,
    },
    scope: [
      {
        title: "Business diagnosis",
        description:
          "Map the current guest inquiry, reservation, menu, and escalation process.",
        owner: "Shared",
      },
      {
        title: "Restaurant knowledge base",
        description:
          "Structure approved menu, hours, location, policies, promotions, and frequently asked questions.",
        owner: "SmeAIHub",
      },
      {
        title: "Inquiry workflow",
        description:
          "Create a consistent flow for guest questions, booking intent, and human handoff.",
        owner: "SmeAIHub",
      },
      {
        title: "AI assistant configuration",
        description:
          "Configure answers from approved knowledge with clear escalation boundaries.",
        owner: "SmeAIHub",
      },
      {
        title: "Team review and training",
        description:
          "Validate answers, test workflows, and prepare staff for day-to-day use.",
        owner: "Shared",
      },
      {
        title: "Monthly optimization",
        description:
          "Review gaps, update knowledge, and improve the workflow throughout the pilot.",
        owner: "SmeAIHub",
      },
    ],
    milestones: [
      {
        title: "Discover",
        description: "Collect business goals, knowledge, and current workflows.",
        timing: "Week 1",
      },
      {
        title: "Build",
        description: "Configure knowledge, inquiry flow, and AI responses.",
        timing: "Weeks 2–3",
      },
      {
        title: "Validate",
        description: "Run team testing, corrections, and staff training.",
        timing: "Week 4",
      },
      {
        title: "Operate & improve",
        description: "Launch, monitor usage, and complete monthly reviews.",
        timing: "Days 31–90",
      },
    ],
    successMetrics: [
      "Approved business knowledge is complete and current",
      "Common customer inquiries receive consistent answers",
      "High-risk or uncertain requests reach a team member",
      "The team completes training and pilot review",
    ],
    customerResponsibilities: [
      "Provide accurate menu, hours, policies, and promotion information",
      "Assign one decision-maker for approvals",
      "Review and approve knowledge and AI responses",
      "Participate in testing, training, and pilot reviews",
    ],
    questions: sharedQuestions,
  },
  {
    slug: "apsaras-tribe-pilot",
    reference: "APS-PILOT-001",
    customer: {
      name: "Apsaras Tribe Siargao",
      location: "Siargao, Philippines",
      industry: "Hotel",
      logo: "/partners/apsaras-tribe.png",
    },
    status: "Ready for review",
    validUntil: "August 15, 2026",
    summary:
      "A 90-day hotel implementation that organizes guest-facing knowledge, improves booking inquiries, and creates a practical AI-assisted guest experience workflow.",
    outcome:
      "Help the Apsaras team answer guests consistently from discovery through arrival while preserving human service for important requests.",
    pilot: {
      duration: "90 days",
      setupFee: 50000,
      monthlyFee: 24900,
      currency: "PHP",
      firstPayment: 74900,
    },
    scope: [
      {
        title: "Hotel business diagnosis",
        description:
          "Map booking inquiries, guest questions, service requests, and department handoffs.",
        owner: "Shared",
      },
      {
        title: "Hotel knowledge base",
        description:
          "Structure approved room, amenity, policy, transfer, activity, dining, and destination knowledge.",
        owner: "SmeAIHub",
      },
      {
        title: "Booking inquiry workflow",
        description:
          "Guide prospective guests toward the right room or next booking step without making unauthorized availability promises.",
        owner: "SmeAIHub",
      },
      {
        title: "Guest experience workflow",
        description:
          "Organize pre-arrival questions, service requests, and human escalation.",
        owner: "SmeAIHub",
      },
      {
        title: "Team validation and training",
        description:
          "Review guest answers, validate service boundaries, and train assigned staff.",
        owner: "Shared",
      },
      {
        title: "Monthly optimization",
        description:
          "Review knowledge gaps, recurring guest needs, and workflow performance.",
        owner: "SmeAIHub",
      },
    ],
    milestones: [
      {
        title: "Discover",
        description: "Collect hotel goals, guest knowledge, and service flows.",
        timing: "Week 1",
      },
      {
        title: "Build",
        description: "Configure hotel knowledge and guest workflows.",
        timing: "Weeks 2–4",
      },
      {
        title: "Validate",
        description: "Complete operational testing and staff training.",
        timing: "Weeks 5–6",
      },
      {
        title: "Operate & improve",
        description: "Launch, monitor, and complete pilot performance reviews.",
        timing: "Days 43–90",
      },
    ],
    successMetrics: [
      "Approved hotel and destination knowledge is complete",
      "Booking inquiries consistently reach the correct next step",
      "Sensitive guest requests are escalated to hotel staff",
      "The team completes testing, training, and pilot review",
    ],
    customerResponsibilities: [
      "Provide accurate room, amenity, policy, and service information",
      "Identify approved booking and escalation procedures",
      "Assign operational and management reviewers",
      "Participate in testing, training, and pilot reviews",
    ],
    questions: sharedQuestions,
  },
];

export function getDeal(slug: string) {
  return deals.find((deal) => deal.slug === slug);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}
