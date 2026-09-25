export const TRADES = [
  { slug: "hvac", name: "HVAC", plural: "HVAC Jobs", emoji: "❄️" },
  { slug: "plumbing", name: "Plumbing", plural: "Plumber Jobs", emoji: "🔧" },
  { slug: "electrical", name: "Electrical", plural: "Electrician Jobs", emoji: "⚡" },
  { slug: "welding", name: "Welding", plural: "Welder Jobs", emoji: "🔥" },
  { slug: "carpentry", name: "Carpentry", plural: "Carpenter Jobs", emoji: "🪚" },
  { slug: "automotive", name: "Automotive", plural: "Auto Mechanic Jobs", emoji: "🚗" },
  { slug: "machining", name: "Machining", plural: "Machinist Jobs", emoji: "⚙️" },
  { slug: "construction", name: "Construction", plural: "Construction Jobs", emoji: "🏗️" },
  { slug: "other", name: "Other Trades", plural: "Other Trade Jobs", emoji: "🛠️" },
] as const;

export type TradeSlug = (typeof TRADES)[number]["slug"];

export const TRADE_SLUGS = TRADES.map((t) => t.slug) as [TradeSlug, ...TradeSlug[]];

export function tradeBySlug(slug: string) {
  return TRADES.find((t) => t.slug === slug);
}

/** Matches route segments like "hvac" or "hvac-jobs". */
export function tradeFromSegment(segment: string) {
  return tradeBySlug(segment) ?? tradeBySlug(segment.replace(/-jobs$/, ""));
}

export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "apprenticeship", label: "Apprenticeship" },
] as const;

export function employmentLabel(value: string) {
  return EMPLOYMENT_TYPES.find((e) => e.value === value)?.label ?? "Full-time";
}

// Complete 50 US States + District of Columbia
export const STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
] as const;

export function stateByCode(code: string) {
  return STATES.find((s) => s.code === code.toUpperCase());
}

export function stateName(code: string) {
  return stateByCode(code)?.name ?? code;
}

export const PAY_TRANSPARENCY_STATES = ["CA", "CO", "NY", "WA", "CT", "MD", "NV", "RI", "HI"] as const;

export type TradePerk = {
  id: string;
  label: string;
  emoji: string;
};

/**
 * Extracts recognized American skilled-trade perks, certifications, and benefits
 * from job descriptions to display as highlights for job seekers.
 */
export function extractTradePerks(text?: string | null): TradePerk[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const perks: TradePerk[] = [];

  if (/\b(truck|van|company vehicle|take-home|take home)\b/.test(lower)) {
    perks.push({ id: "truck", label: "Take-Home Truck", emoji: "🚐" });
  }
  if (/\b(401k|401\(k\)|retirement)\b/.test(lower)) {
    perks.push({ id: "401k", label: "401(k) Match", emoji: "💰" });
  }
  if (/\b(health|dental|vision|medical insurance)\b/.test(lower)) {
    perks.push({ id: "health", label: "Health / Dental", emoji: "🏥" });
  }
  if (/\b(sign-on|sign on|signing bonus)\b/.test(lower)) {
    perks.push({ id: "bonus", label: "Sign-on Bonus", emoji: "🎁" });
  }
  if (/\b(tool allowance|boot allowance|tools provided)\b/.test(lower)) {
    perks.push({ id: "tools", label: "Tool Allowance", emoji: "🧰" });
  }
  if (/\b(overtime|time and a half|1\.5x)\b/.test(lower)) {
    perks.push({ id: "overtime", label: "Overtime Available", emoji: "⏱️" });
  }
  if (/\b(epa 608|epa universal)\b/.test(lower)) {
    perks.push({ id: "epa", label: "EPA 608", emoji: "📜" });
  }
  if (/\b(journeyman|master plumber|master electrician)\b/.test(lower)) {
    perks.push({ id: "license", label: "Licensed Tech", emoji: "⚡" });
  }
  if (/\b(veteran|military|helmets to hardhats)\b/.test(lower)) {
    perks.push({ id: "veteran", label: "Veteran Friendly", emoji: "🎖️" });
  }
  if (/\b(pto|paid time off|paid holidays|vacation)\b/.test(lower)) {
    perks.push({ id: "pto", label: "Paid Time Off", emoji: "🌴" });
  }

  return perks.slice(0, 4);
}

export type TradeFaq = { question: string; answer: string };

export const TRADE_FAQS: Record<string, TradeFaq[]> = {
  hvac: [
    {
      question: "How much does a licensed HVAC technician make in the US?",
      answer:
        "Journeyman HVAC technicians earn between $36 and $52 per hour ($75,000 to $108,000 annually), depending on state and commercial experience. Commercial refrigeration (HVAC/R) technicians and industrial chillermen often earn $120,000+ with overtime and on-call emergency pay.",
    },
    {
      question: "What certifications are required to work in HVAC?",
      answer:
        "Federal law mandates an EPA Section 608 technician certification (Universal is preferred) to handle refrigerants. Many employers also seek NATE (North American Technician Excellence) certification and state mechanical contractor or journeyman licenses.",
    },
    {
      question: "How do I become an HVAC apprentice?",
      answer:
        "You can apply directly to mechanical contractors hiring helpers, enroll in a local vocational school program, or apply to an accredited union apprenticeship through the United Association (UA). Most apprenticeships pay full wages while providing classroom training.",
    },
  ],
  electrical: [
    {
      question: "What are the requirements to become a Journeyman Electrician?",
      answer:
        "Most states require 4 to 5 years (typically 8,000 verified on-the-job hours) as a registered apprentice under a licensed master electrician, plus 576 to 900 hours of classroom instruction in the National Electrical Code (NEC), followed by passing the state licensing exam.",
    },
    {
      question: "What is the average wage for an electrician?",
      answer:
        "Licensed journeyman electricians earn an average of $38 to $55 per hour ($80,000 to $115,000 annually). Commercial inside wiremen working on high-voltage systems and industrial control systems frequently surpass $125,000 with overtime.",
    },
    {
      question: "Do electricians need an OSHA 10 or OSHA 30 card?",
      answer:
        "Yes. Most commercial general contractors and municipal projects mandate an OSHA 10 Construction card for apprentices and OSHA 30 for foremen and lead electricians before dispatching to jobsites.",
    },
  ],
  plumbing: [
    {
      question: "How long does a plumbing apprenticeship take?",
      answer:
        "A standard plumbing apprenticeship takes 4 to 5 years, combining 8,000 hours of paid field work with 600+ hours of technical code training. Apprentices receive structured pay increases every 6 to 12 months as they pass proficiency milestones.",
    },
    {
      question: "What does a licensed plumber earn in 2026?",
      answer:
        "Journeyman plumbers earn between $37 and $54 per hour ($78,000 to $112,000/yr). Master plumbers, service company owners, and commercial medical gas / backflow specialists can earn over $130,000 annually.",
    },
    {
      question: "What licenses do plumbers need to pull permits?",
      answer:
        "To pull plumbing permits and bid subcontract work, you must hold a state Master Plumber License or Contractor Plumbing License and carry statutory general liability insurance and surety bonds.",
    },
  ],
  welding: [
    {
      question: "Which welding certifications pay the highest hourly rates?",
      answer:
        "The highest-paying certifications include AWS D1.1 (Structural Steel), ASME Section IX (Boiler & Pressure Vessel 6G Pipe), API 1104 (Cross-Country Pipeline), and AWS D17.1 (Aerospace). Traveling pipeline and rig welders frequently earn between $45 and $70+ per hour plus daily per diem.",
    },
    {
      question: "Can welders make six figures without a college degree?",
      answer:
        "Yes. Traveling pipe welders, shutdown turnaround welders, underwater welders, and industrial fabricators consistently earn $100,000 to $150,000+ per year through combination TIG/stick welding and overtime.",
    },
  ],
  carpentry: [
    {
      question: "What is the difference between rough framing and finish carpentry?",
      answer:
        "Rough framing focuses on structural timber, trusses, shear walls, and subfloors for residential and commercial framing. Finish carpentry demands millimeter-exact craftsmanship for trim, cabinetry, crown molding, stairs, and doors.",
    },
    {
      question: "How much do carpenters make per hour?",
      answer:
        "Journeyman carpenters earn between $30 and $45 per hour ($62,000 to $94,000 annually). Commercial union carpenters (UBC) working on heavy civil, acoustic ceilings, and concrete formwork often earn $45 to $55/hr in total package benefits.",
    },
  ],
  automotive: [
    {
      question: "What ASE certifications are most valuable for automotive technicians?",
      answer:
        "ASE Master Automotive Technician status (passing all tests A1 through A8) is the industry benchmark. Technicians with L1 (Advanced Engine Performance) or high-voltage EV certifications command top dealer and fleet service rates.",
    },
    {
      question: "Do diesel mechanics earn more than gas automotive techs?",
      answer:
        "Generally yes. Heavy-duty diesel technicians working on Class 8 trucks, construction machinery, and power generators average $34 to $50 per hour, typically 10% to 20% higher than light automotive consumer repair.",
    },
  ],
  machining: [
    {
      question: "What skills do modern CNC machinists need to earn top pay?",
      answer:
        "Top-earning CNC machinists ($34 to $48/hr) excel in 5-axis mill programming, Mastercam or Fusion 360 CAM software, GD&T (Geometric Dimensioning and Tolerancing), and CMM quality inspection for aerospace and defense manufacturing.",
    },
  ],
  construction: [
    {
      question: "What safety credentials do commercial construction contractors require?",
      answer:
        "Contractors prioritize candidates with an OSHA 10 or OSHA 30 Construction card, First Aid/CPR, and equipment operator cards (Scissor lift, Boom lift, Telehandler/Forklift).",
    },
  ],
  other: [
    {
      question: "How do I find licensed skilled trades jobs on TradeBoard?",
      answer:
        "Browse jobs by trade or state, view transparent hourly wages, and apply directly to hiring contractors with your phone number, license details, and resume. No recruiter middleman.",
    },
  ],
};

export function getTradeFaqs(tradeSlug: string): TradeFaq[] {
  return TRADE_FAQS[tradeSlug] ?? TRADE_FAQS.other;
}

