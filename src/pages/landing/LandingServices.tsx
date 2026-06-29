import { motion } from "framer-motion";
import {
  Building2, Smartphone, Calendar, CreditCard, Activity, Package,
  Users, BarChart3, ShoppingCart, Shield, Mail, Brain, Scale,
  TrendingUp, Clock, Eye, Zap, Wallet, MessageSquare, Watch, Lock, Puzzle
} from "lucide-react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const corePlatformFeatures = [
  { icon: Building2, title: "Multi-tenant Gym Management", description: "Manage multiple gym locations from a single dashboard with centralized control and reporting." },
  { icon: Smartphone, title: "Member Mobile & Web Apps", description: "Branded mobile and web applications for members to book classes, track progress, and manage memberships." },
  { icon: Calendar, title: "Class & Trainer Booking", description: "Seamless scheduling system for classes, personal training sessions, and facility reservations." },
  { icon: CreditCard, title: "Membership & Billing Management", description: "Automated recurring billing, membership tiers, payment processing, and invoice generation." },
  { icon: Activity, title: "Health & Fitness Tracking", description: "Comprehensive tracking of workouts, body metrics, goals, and progress visualization." },
  { icon: Package, title: "Equipment & Inventory Management", description: "Track equipment maintenance, inventory levels, and automate reordering processes." },
  { icon: Users, title: "Staff & Trainer Management", description: "Schedule management, payroll integration, performance tracking, and certification monitoring." },
  { icon: BarChart3, title: "Financial Reporting & Analytics", description: "Real-time dashboards, revenue tracking, expense management, and comprehensive financial reports." },
  { icon: ShoppingCart, title: "Point of Sale (POS) System", description: "Integrated POS for retail sales, supplements, merchandise, and service add-ons." },
  { icon: Shield, title: "Access Control Integration", description: "Seamless integration with door access systems, check-in kiosks, and security monitoring." },
  { icon: Mail, title: "Marketing Automation Tools", description: "Email campaigns, SMS notifications, member engagement tracking, and retention tools." },
];

const aiPoweredFeatures = [
  { icon: Brain, title: "Personalized Workout Recommendations", description: "AI-driven workout plans tailored to individual goals, fitness levels, and progress patterns." },
  { icon: Scale, title: "Weight Management Coaching", description: "Intelligent nutrition guidance and weight tracking with personalized recommendations." },
  { icon: TrendingUp, title: "Predictive Analytics for Business Insights", description: "Forecast member churn, revenue trends, and optimize pricing strategies with AI." },
  { icon: Clock, title: "Automated Scheduling Optimization", description: "Smart class scheduling based on attendance patterns, trainer availability, and member preferences." },
  { icon: Eye, title: "Member Behavior Analysis", description: "Deep insights into member engagement, usage patterns, and personalized retention strategies." },
];

const integrationCapabilities = [
  { icon: Wallet, title: "Payment Processing", description: "Stripe, Paystack, Flutterwave, and other major payment gateways for seamless transactions." },
  { icon: MessageSquare, title: "Email & SMS Services", description: "Integration with SendGrid, Twilio, Mailchimp for automated communications." },
  { icon: Watch, title: "Fitness Wearables & Apps", description: "Sync with Fitbit, Apple Health, Google Fit, Garmin, and other fitness platforms." },
  { icon: Lock, title: "Access Control Hardware", description: "Compatible with leading access control systems and turnstile manufacturers." },
  { icon: Puzzle, title: "Third-party Fitness Platforms", description: "Integration with MyFitnessPal, Strava, and other popular fitness apps." },
];

function FeatureCard({ icon: Icon, title, description }: { icon: React.FC<{ className?: string }>, title: string, description: string }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 group-hover:bg-brand-100 dark:group-hover:bg-brand-500/20 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-brand-500 transition-colors">{title}</h3>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function SectionHeader({ badge, icon: Icon, title, description, badgeColor = "brand" }: { badge: string, icon: React.FC<{ className?: string }>, title: string, description: string, badgeColor?: string }) {
  const colors: Record<string, string> = {
    brand: "bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-400",
    blue: "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400",
    purple: "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-400",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4 ${colors[badgeColor]}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{badge}</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{description}</p>
    </motion.div>
  );
}

export default function LandingServices() {
  return (
    <>
      <PageMeta title="Features & Services | GymMateHub" description="Explore GymMateHub's complete gym management features." />

      <div className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 dark:bg-brand-500/10 dark:border-brand-500/20 mb-6">
                <Zap className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-medium text-brand-600 dark:text-brand-400">Complete Platform Features</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
                Everything You Need to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">Run Your Gym Successfully</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                From member management to payment tracking, GymMateHub provides all the tools you need to streamline operations and grow your fitness business.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Core Platform" icon={Building2} title="Core Platform Features" description="Comprehensive tools to manage every aspect of your gym operations efficiently" badgeColor="blue" />
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {corePlatformFeatures.map((f, i) => <FeatureCard key={i} {...f} />)}
            </motion.div>
          </div>
        </section>

        {/* AI Features */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="AI-Powered" icon={Brain} title="AI-Powered Features" description="Leverage artificial intelligence to provide personalized experiences and data-driven insights" />
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiPoweredFeatures.map((f, i) => <FeatureCard key={i} {...f} />)}
            </motion.div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Integrations" icon={Puzzle} title="Integration Capabilities" description="Seamlessly connect with your favorite tools and services for a unified ecosystem" badgeColor="purple" />
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrationCapabilities.map((f, i) => <FeatureCard key={i} {...f} />)}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center p-12 rounded-3xl bg-gradient-to-br from-brand-500/10 to-blue-500/10 border border-brand-200 dark:border-brand-500/20"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Ready to Transform Your Gym?</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">Join gyms across Africa using GymMateHub to streamline operations.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:scale-105">
                  Start Free Trial
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                  Schedule Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
