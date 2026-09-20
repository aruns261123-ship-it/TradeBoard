import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith("sk_test_REPLACE") || key === "sk_test_...") {
    return null;
  }
  if (!_stripe) {
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/**
 * True when Stripe keys are absent — checkout then runs in dev-mode:
 * orders complete instantly without payment so the whole post-a-job flow
 * is testable locally before connecting Stripe.
 */
export function isDevCheckout() {
  return getStripe() === null;
}
