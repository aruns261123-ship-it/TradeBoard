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
