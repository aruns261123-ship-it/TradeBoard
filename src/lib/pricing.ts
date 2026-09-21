export const PRODUCTS = {
  standard: {
    name: "Standard Job Post",
    description: "30 days online · company logo · apply-by-email or link",
    priceCents: 14900,
    envKey: "STRIPE_PRICE_STANDARD",
  },
  featured: {
    name: "Featured Job Post",
    description: "30 days · top of every list · highlighted card · included in newsletter",
    priceCents: 24900,
    envKey: "STRIPE_PRICE_FEATURED",
  },
  pack5: {
    name: "5-Pack of Posts",
    description: "5 standard posts · never expires · best for growing teams",
    priceCents: 49500,
    envKey: "STRIPE_PRICE_PACK5",
  },
  agency: {
    name: "Staffing Agency Plan",
    description: "Unlimited posts while subscribed · perfect for recruiters",
    priceCents: 49900,
    interval: "month",
    envKey: "STRIPE_PRICE_AGENCY",
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

export function isProductKey(v: string): v is ProductKey {
  return v === "standard" || v === "featured" || v === "pack5" || v === "agency";
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  const isHourly = Boolean((min && min < 250) || (max && max < 250));
  if (isHourly) {
    if (min && max) return min === max ? `$${min}/hr` : `$${min} – $${max}/hr`;
    return `$${min ?? max}+/hr`;
  }
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  if (min && max) return min === max ? `${fmt(min)}/yr` : `${fmt(min)} – ${fmt(max)}/yr`;
  return `${fmt((min ?? max)!)}+/yr`;
}

export function daysUntil(date: Date | null | undefined) {
  if (!date) return 0;
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000));
}
