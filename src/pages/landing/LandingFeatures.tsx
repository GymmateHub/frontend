import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, CreditCard, MessageSquare, BarChart3, Check, ArrowRight, Zap,
  Calendar, Building2, Package, ShoppingCart, Shield, Mail, Smartphone,
  Brain, TrendingUp, Clock, Watch, Search, Wallet,
} from "lucide-react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

/* ────────────────────────── Product-tour mockups ────────────────────────── */

function MockFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-theme-lg overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40">
          <span className="h-2.5 w-2.5 rounded-full bg-error-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-success-300" />
          <span className="ml-3 text-xs font-medium text-gray-400">{label}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function MembersMock() {
  const rows = [
    { name: "Adewale Okafor", plan: "Monthly · ₦15,000", status: "Active", tone: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400" },
    { name: "Chioma Nwosu", plan: "Quarterly · ₦40,000", status: "Due in 3 days", tone: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400" },
    { name: "Emeka Eze", plan: "Monthly · ₦15,000", status: "Active", tone: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400" },
    { name: "Funke Adeyemi", plan: "Monthly · ₦15,000", status: "Expired", tone: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400" },
  ];
  return (
    <MockFrame label="gymmatehub.com/members">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-800 dark:text-white text-sm">Members</p>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">128 active</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400">
          <Search className="h-4 w-4" />
          <span className="text-xs">Search name or phone…</span>
        </div>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.name} className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800">
              <div className="h-8 w-8 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold flex-shrink-0">{r.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{r.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{r.plan}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${r.tone}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function PaymentsMock() {
  const rows = [
    { name: "Adewale Okafor", method: "Cash", tone: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", amount: "₦15,000" },
    { name: "Chioma Nwosu", method: "Transfer", tone: "bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/15 dark:text-blue-light-400", amount: "₦40,000" },
    { name: "Tunde Bakare", method: "POS", tone: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400", amount: "₦15,000" },
    { name: "Ngozi Obi", method: "Paystack", tone: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400", amount: "₦15,500" },
  ];
  return (
    <MockFrame label="gymmatehub.com/billing">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800 dark:text-white text-sm">Payments · Today</p>
            <p className="text-[11px] text-gray-400">Fri, 11 Jul</p>
          </div>
          <p className="text-lg font-bold text-success-600 dark:text-success-400">₦85,500</p>
        </div>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.name} className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-gray-100 dark:border-gray-700/60">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{r.name}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${r.tone}`}>{r.method}</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-16 text-right">{r.amount}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-brand-500 text-white text-center text-xs font-semibold py-2.5">+ Record payment</div>
      </div>
    </MockFrame>
  );
}

function RenewalsMock() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[300px] rounded-[2rem] border-[6px] border-gray-900 dark:border-gray-600 bg-white dark:bg-gray-900 overflow-hidden shadow-theme-xl">
        {/* WhatsApp-style header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-700 text-white">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">GM</div>
          <div>
            <p className="text-sm font-semibold leading-tight">Iron Temple Fitness</p>
            <p className="text-[10px] text-emerald-100">via GymMateHub</p>
          </div>
        </div>
        {/* Chat */}
        <div className="bg-[#ece5dd] dark:bg-gray-800 px-3 py-4 space-y-3 min-h-[220px]">
          <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-white dark:bg-gray-700 px-3 py-2 shadow-theme-xs">
            <p className="text-xs text-gray-800 dark:text-gray-100 leading-relaxed">
              Hi Adewale 👋 Your membership expires in <b>3 days</b> (Mon, 14 Jul).
              Renew for ₦15,000 — cash at the desk, transfer, or tap below.
            </p>
            <p className="text-[10px] text-gray-400 text-right mt-1">9:02 AM</p>
          </div>
          <div className="max-w-[60%] ml-auto rounded-xl rounded-tr-sm bg-[#dcf8c6] dark:bg-emerald-900/60 px-3 py-2 shadow-theme-xs">
            <p className="text-xs text-gray-800 dark:text-gray-100">Renewing today 💪</p>
            <p className="text-[10px] text-gray-400 text-right mt-1">9:05 AM ✓✓</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400">Sent automatically — you never typed a word.</p>
    </div>
  );
}

function ReportsMock() {
  const bars = [42, 58, 45, 72, 60, 88, 76, 95];
  return (
    <MockFrame label="gymmatehub.com/analytics">
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Revenue · Jul", value: "₦482k", tone: "text-success-600 dark:text-success-400" },
            { label: "Active members", value: "128", tone: "text-brand-500" },
            { label: "Overdue", value: "9", tone: "text-warning-600 dark:text-warning-400" },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-gray-100 dark:border-gray-700/60 p-3">
              <p className={`text-base font-bold ${k.tone}`}>{k.value}</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-gray-100 dark:border-gray-700/60 p-3">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly revenue</p>
          <div className="flex items-end gap-1.5 h-20">
            {bars.map((h, i) => (
              <div key={i} className={`flex-1 rounded-t ${i === bars.length - 1 ? "bg-brand-500" : "bg-brand-500/30"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {[
            { plan: "Monthly", pct: 68 },
            { plan: "Quarterly", pct: 24 },
          ].map((p) => (
            <div key={p.plan} className="flex items-center gap-3">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 w-16">{p.plan}</span>
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
                <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 w-8 text-right">{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ────────────────────────── Tour content ────────────────────────── */

const tourTabs = [
  {
    id: "renewals",
    label: "Renewals",
    icon: MessageSquare,
    title: "Renewals that chase themselves",
    description: "The #1 leak in gym revenue is memberships that quietly expire. GymMateHub sends WhatsApp and SMS reminders before that happens — automatically.",
    bullets: [
      "Automatic WhatsApp & SMS reminders before expiry",
      "You choose how many days in advance",
      "Members renew before they lapse — not weeks after",
    ],
    mock: <RenewalsMock />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    title: "Cash, transfer, POS — all counted",
    description: "Most gym software assumes every payment is a card on file. Yours aren't. Record any payment the way it actually happened, in two taps.",
    bullets: [
      "Cash, bank transfer, POS, Paystack & Flutterwave",
      "Daily totals that match your cashbox",
      "Receipts and payment history for every member",
    ],
    mock: <PaymentsMock />,
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
    title: "Every member, one glance",
    description: "Who's active, who's due this week, who quietly stopped coming — without flipping through a notebook or an Excel sheet.",
    bullets: [
      "Full payment & attendance history per member",
      "Find anyone by name or phone in a second",
      "Import your existing list from Excel",
    ],
    mock: <MembersMock />,
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    title: "Know your numbers",
    description: "Revenue, renewals, and attendance in plain sight — so decisions come from data, not gut feel at the end of a long day.",
    bullets: [
      "Revenue trends month over month",
      "Overdue members surfaced before they're lost",
      "See which plans actually make you money",
    ],
    mock: <ReportsMock />,
  },
];

/* ────────────────────────── Supporting sections ────────────────────────── */

const groundedIn = [
  { icon: Wallet, title: "Cash is a first-class citizen", description: "Record cash and transfer payments as easily as card — because that's how most members actually pay." },
  { icon: MessageSquare, title: "WhatsApp-first communication", description: "Reminders and receipts go where your members already are. No app download required." },
  { icon: Smartphone, title: "Runs on the phone in your pocket", description: "Front desk on a laptop, owner on a phone. No expensive hardware, no installation." },
  { icon: Zap, title: "Set up in minutes, not weeks", description: "Import your member list and take your first payment the same afternoon." },
];

const moreFeatures = [
  { icon: Calendar, title: "Class & trainer scheduling", description: "Timetables, bookings, and attendance." },
  { icon: Building2, title: "Multi-location dashboards", description: "Every branch from one login." },
  { icon: Shield, title: "Staff accounts & roles", description: "Front desk sees less than the owner does." },
  { icon: ShoppingCart, title: "Point of sale", description: "Supplements, water, merch — tracked." },
  { icon: Package, title: "Equipment & inventory", description: "Maintenance logs and stock levels." },
  { icon: Smartphone, title: "Member web & mobile app", description: "Members book and check their status." },
  { icon: Clock, title: "Attendance check-in", description: "Know who trains, and how often." },
  { icon: Mail, title: "Campaigns & newsletters", description: "Win-back and announcement blasts." },
  { icon: TrendingUp, title: "Leads & follow-ups", description: "Walk-ins become members, not sticky notes." },
];

const roadmap = [
  { icon: Brain, title: "AI workout recommendations" },
  { icon: TrendingUp, title: "Churn prediction" },
  { icon: Clock, title: "Smart schedule optimization" },
  { icon: Watch, title: "Wearables sync (Apple Health, Fitbit)" },
];

const integrations = [
  { label: "Payments", items: ["Paystack", "Flutterwave", "Stripe"] },
  { label: "Messaging", items: ["WhatsApp", "SMS (Twilio)", "Email (SendGrid)"] },
  { label: "Access", items: ["Check-in kiosks", "Door access systems"] },
];

/* ────────────────────────── Page ────────────────────────── */

export default function LandingFeatures() {
  const [activeTab, setActiveTab] = useState(tourTabs[0].id);
  const active = tourTabs.find((t) => t.id === activeTab) ?? tourTabs[0];

  return (
    <>
      <PageMeta title="Features | GymMateHub" description="See the actual product: members, payments, WhatsApp renewal reminders, and reports." />

      <div className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="relative pt-16 sm:pt-24 pb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
                Less brochure.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-light-500">More product.</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                No stock photos, no feature bingo. These are the four workflows that run your gym day to day — click through them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="group inline-flex items-center justify-center px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/pricing" className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                  See Pricing
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive product tour */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div role="tablist" aria-label="Product tour" className="flex flex-wrap justify-center gap-2 mb-10">
              {tourTabs.map((tab) => {
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`tour-panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      selected
                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Panel */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 p-6 sm:p-10 lg:p-14 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  id={`tour-panel-${active.id}`}
                  role="tabpanel"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
                >
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">{active.title}</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">{active.description}</p>
                    <ul className="space-y-4">
                      {active.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <span className="mt-0.5 flex-shrink-0 h-6 w-6 rounded-full bg-success-50 dark:bg-success-500/15 flex items-center justify-center">
                            <Check className="h-4 w-4 text-success-600 dark:text-success-400" />
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="max-w-md w-full mx-auto">{active.mock}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Built for reality */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Built for how gyms here actually work</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Most gym software was designed for markets where every member has a card on file. We started from a different reality.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groundedIn.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-5 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1.5">{f.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Everything else */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">And everything else you'd expect</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">The rest of the platform, without the fanfare.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {moreFeatures.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-2">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-0.5">{f.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap + integrations */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">On the roadmap</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                If it's not live yet, it lives here — not on a feature list pretending it ships today.
              </p>
              <div className="flex flex-wrap gap-3">
                {roadmap.map((r) => (
                  <span key={r.title} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300">
                    <r.icon className="h-4 w-4 text-gray-400" />
                    {r.title}
                    <span className="text-[10px] font-bold uppercase tracking-wide text-brand-500">Soon</span>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Plays well with</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">The tools your gym and your members already use.</p>
              <div className="space-y-4">
                {integrations.map((g) => (
                  <div key={g.label} className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-400 w-20">{g.label}</span>
                    {g.items.map((item) => (
                      <span key={item} className="px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA — setup steps */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="p-10 sm:p-12 rounded-3xl bg-gray-900 dark:bg-gray-800 text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">Set up before your next shift ends</h2>
              <div className="grid sm:grid-cols-3 gap-8 mb-10 text-left">
                {[
                  { step: "1", title: "Create your account", description: "Free, no card needed." },
                  { step: "2", title: "Add your members", description: "Import from Excel or add them one by one." },
                  { step: "3", title: "Turn on reminders", description: "WhatsApp does the chasing from now on." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <span className="flex-shrink-0 h-9 w-9 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center">{s.step}</span>
                    <div>
                      <p className="font-semibold text-white mb-1">{s.title}</p>
                      <p className="text-sm text-gray-400">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg">
                  Start Free — 10 Minutes
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/15 transition-all">
                  Talk to Us First
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
