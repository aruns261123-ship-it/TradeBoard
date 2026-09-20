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

// Top 30 states by trade employment — enough for programmatic SEO pages
export const STATES = [
  { code: "TX", name: "Texas" },
  { code: "CA", name: "California" },
  { code: "FL", name: "Florida" },
  { code: "NY", name: "New York" },
  { code: "PA", name: "Pennsylvania" },
  { code: "IL", name: "Illinois" },
  { code: "OH", name: "Ohio" },
  { code: "GA", name: "Georgia" },
  { code: "NC", name: "North Carolina" },
  { code: "MI", name: "Michigan" },
  { code: "AZ", name: "Arizona" },
  { code: "CO", name: "Colorado" },
  { code: "WA", name: "Washington" },
  { code: "MA", name: "Massachusetts" },
  { code: "TN", name: "Tennessee" },
  { code: "IN", name: "Indiana" },
  { code: "MO", name: "Missouri" },
  { code: "WI", name: "Wisconsin" },
  { code: "VA", name: "Virginia" },
  { code: "NJ", name: "New Jersey" },
  { code: "SC", name: "South Carolina" },
  { code: "AL", name: "Alabama" },
  { code: "LA", name: "Louisiana" },
  { code: "KY", name: "Kentucky" },
  { code: "OR", name: "Oregon" },
  { code: "OK", name: "Oklahoma" },
  { code: "UT", name: "Utah" },
  { code: "NV", name: "Nevada" },
  { code: "MN", name: "Minnesota" },
  { code: "KS", name: "Kansas" },
] as const;

export function stateByCode(code: string) {
  return STATES.find((s) => s.code === code.toUpperCase());
}

export function stateName(code: string) {
  return stateByCode(code)?.name ?? code;
}
