import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Star, ArrowRight, DollarSign, HelpCircle, Building, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

const pricingPlans = [
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

const comparisonFeatures = [
  { feature: "Member limit", free: "20", growth: "150", pro: "500" },
  { feature: "Payment tracking", free: true, growth: true, pro: true },
  { feature: "Member profiles", free: true, growth: true, pro: true },
  { feature: "Renewal reminders", free: false, growth: true, pro: true },
  { feature: "Attendance tracking", free: false, growth: true, pro: true },
  { feature: "Revenue reports", free: false, growth: true, pro: true },
  { feature: "Multiple staff", free: false, growth: false, pro: true },
  { feature: "Custom branding", free: false, growth: false, pro: true },
  { feature: "Support", free: "WhatsApp", growth: "Priority", pro: "Dedicated" },
];

const faqs = [
  { question: "What payment methods do you accept?", answer: "We accept bank transfers, Paystack, Flutterwave, and card payments. You can pay monthly or annually (save 2 months with yearly billing)." },
  { question: "Can my members pay in cash or bank transfer?", answer: "Yes! GymMateHub is built for how gyms actually work. You can record cash payments, bank transfers, POS payments, or online payments. We track it all." },
  { question: "Is the Free plan really free?", answer: "Yes, 100% free for up to 20 members. No credit card required, no hidden fees, no trial that expires. Perfect for getting started." },
  { question: "How do renewal reminders work?", answer: "We automatically send WhatsApp or SMS reminders to members before their membership expires. You choose how many days in advance. No more chasing payments manually." },
  { question: "Can I upgrade or downgrade anytime?", answer: "Absolutely. Upgrade instantly when you need more members. If you downgrade, you'll keep access until your current billing period ends." },
];

function CheckIcon() { return <Check className="h-5 w-5 text-success-500 mx-auto" />; }
function CrossIcon() { return <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />; }

export default function LandingPricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <PageMeta title="Pricing | GymMateHub" description="Affordable gym management software. Free for up to 20 members." />

      <div className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 dark:bg-brand-500/10 dark:border-brand-500/20 mb-6">
              <DollarSign className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">No Hidden Fees</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
              Simple Pricing for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">Growing Gyms</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Start free. Upgrade when you grow. No expensive hardware. No long-term contracts.
            </p>
          </motion.div>
        </section>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium ${!isAnnual ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
            Annual
            <span className="ml-2 text-xs font-bold px-2 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400">2 MONTHS FREE</span>
          </span>
        </div>

        {/* Cards */}
        <section className="pb-20">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8 items-stretch"
          >
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} variants={itemVariants}
                className={`relative flex flex-col p-8 rounded-2xl border bg-white dark:bg-gray-800 ${plan.popular ? "border-brand-500" : "border-gray-200 dark:border-gray-700"}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500 text-white font-semibold text-sm">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{plan.name}</h3>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">{plan.description}</p>
                  <div className="mt-8">
                    {plan.price.monthly === 0 ? (
                      <div className="flex items-baseline">
                        <span className="text-5xl font-extrabold text-gray-800 dark:text-white">Free</span>
                        <span className="ml-1 text-xl font-semibold text-gray-400">forever</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline">
                          <span className="text-5xl font-extrabold text-gray-800 dark:text-white">
                            {plan.price.currency}{(isAnnual ? Math.round(plan.price.annual / 12) : plan.price.monthly).toLocaleString()}
                          </span>
                          <span className="ml-1 text-xl font-semibold text-gray-400">/month</span>
                        </div>
                        {isAnnual && (
                          <p className="mt-2 text-sm text-gray-400">
                            billed annually · {plan.price.currency}{plan.price.annual.toLocaleString()}/year
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-6 w-6 text-brand-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10">
                  <Link to="/register"
                    className={`flex items-center justify-center w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 group ${plan.popular ? "bg-brand-500 hover:bg-brand-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"}`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Comparison */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Compare All Features</h2>
            </motion.div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-lg font-semibold text-gray-800 dark:text-white bg-white dark:bg-gray-800 rounded-tl-xl">Feature</th>
                    {pricingPlans.map((p) => (
                      <th key={p.name} className="p-4 text-lg font-semibold text-gray-800 dark:text-white bg-white dark:bg-gray-800 text-center last:rounded-tr-xl">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feat) => (
                    <tr key={feat.feature} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">{feat.feature}</td>
                      {([feat.free, feat.growth, feat.pro] as const).map((cell, ci) => (
                        <td key={ci} className="p-4 text-center">
                          {typeof cell === "boolean" ? (cell ? <CheckIcon /> : <CrossIcon />) : <span className="text-gray-500 dark:text-gray-400 text-sm">{cell}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 mb-4">
                <HelpCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
            </motion.div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left text-gray-800 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {faq.question}
                    <ChevronDown className={`ml-4 h-5 w-5 flex-shrink-0 text-gray-400 transform transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-gray-500 dark:text-gray-400">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative p-10 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center"
            >
              <Building className="h-8 w-8 text-brand-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Running Multiple Locations?</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Need more than 500 members, multiple branches, or custom integrations? Let's build a plan that fits your gym chain.
              </p>
              <Link to="/contact"
                className="inline-flex items-center px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg text-lg"
              >
                Chat With Us
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
