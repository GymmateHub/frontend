import { loadStripe, type Stripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

/**
 * Stripe.js instance, or null when `VITE_STRIPE_PUBLISHABLE_KEY` is not configured for this
 * build. Card details are collected by Stripe's hosted `CardElement` and never touch our code.
 */
export const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;
