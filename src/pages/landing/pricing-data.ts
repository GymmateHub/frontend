/**
 * Pricing plans and FAQs shown on /pricing. The structured data in
 * src/seo/schema.ts reads from here too, so the page and the schema agree.
 */

export type PricingPlan = {
  name: string;
  description: string;
  price: { monthly: number; annual: number; currency?: string };
  features: string[];
  cta: string;
  popular: boolean;
};

export type Faq = { question: string; answer: string };

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for new gyms just getting started. No card needed.",
    price: { monthly: 0, annual: 0 },
    features: ["Up to 20 members", "Payment tracking", "Basic member profiles", "WhatsApp support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Growth",
    description: "For growing gyms that need renewals automation and visibility.",
    price: { monthly: 15000, annual: 150000, currency: "₦" },
    features: ["Up to 150 members", "Renewal reminders (SMS/WhatsApp)", "Payment history & receipts", "Attendance tracking", "Revenue reports"],
    cta: "Choose Growth",
    popular: true,
  },
  {
    name: "Pro",
    description: "For established gyms that want full control and insights.",
    price: { monthly: 35000, annual: 350000, currency: "₦" },
    features: ["Up to 500 members", "Everything in Growth", "Multiple staff accounts", "Advanced analytics", "Priority support", "Custom branding"],
    cta: "Choose Pro",
    popular: false,
  },
];

export const faqs: Faq[] = [
  { question: "What payment methods do you accept?", answer: "We accept bank transfers, Paystack, Flutterwave, and card payments. You can pay monthly or annually (save 2 months with yearly billing)." },
  { question: "Can my members pay in cash or bank transfer?", answer: "Yes! GymMateHub is built for how gyms actually work. You can record cash payments, bank transfers, POS payments, or online payments. We track it all." },
  { question: "Is the Free plan really free?", answer: "Yes, 100% free for up to 20 members. No credit card required, no hidden fees, no trial that expires. Perfect for getting started." },
  { question: "How do renewal reminders work?", answer: "We automatically send WhatsApp or SMS reminders to members before their membership expires. You choose how many days in advance. No more chasing payments manually." },
  { question: "Can I upgrade or downgrade anytime?", answer: "Absolutely. Upgrade instantly when you need more members. If you downgrade, you'll keep access until your current billing period ends." },
];
