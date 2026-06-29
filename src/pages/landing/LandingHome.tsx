import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Users, TrendingUp, Zap, Shield, BarChart3, Calendar } from "lucide-react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const benefits = ["Start free — no card needed", "Works with bank transfers & cash", "Setup in under 10 minutes"];

const features = [
  { icon: Users, title: "Member Management", description: "Track every member, their payments, and membership status in one place." },
  { icon: Calendar, title: "Class Scheduling", description: "Manage class bookings, attendance, and trainer assignments effortlessly." },
  { icon: BarChart3, title: "Analytics & Reports", description: "Get real-time insights into revenue, retention, and growth." },
  { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security with 99.9% uptime for your peace of mind." },
];

const stats = [
  { value: "100+", label: "Gyms Onboarded" },
  { value: "10,000+", label: "Members Tracked" },
  { value: "₦0", label: "To Get Started" },
  { value: "5 min", label: "Setup Time" },
];

export default function LandingHome() {
  return (
    <>
      <PageMeta title="GymMateHub - Simple Gym Management for Africa" description="Track members, collect payments, and stop missing renewals." />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 dark:bg-brand-500/10 dark:border-brand-500/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                </span>
                <span className="text-sm font-medium text-brand-600 dark:text-brand-400">Built for Growing Gyms</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
                Track Members.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">
                  Collect Payments.
                </span>
                <span className="block text-3xl sm:text-4xl mt-2 text-gray-500 dark:text-gray-400 font-semibold">
                  Stop Missing Renewals.
                </span>
              </h1>

              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                The simplest way for gyms to manage members, track who paid, and never miss a renewal — built for Africa and emerging markets.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
                >
                  Start Tracking Members Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white font-semibold rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <Play className="mr-2 h-5 w-5" />
                  See How It Works
                </Link>
              </div>

              <div className="flex flex-wrap gap-6">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success-500" />
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-blue-500/20 z-10" />
                <img
                  alt="Gym management dashboard"
                  className="w-full h-auto rounded-2xl"
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
                />
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                    <Users className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">5 min</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quick Setup</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-6 -right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">₦0</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To Get Started</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-brand-500 mb-2">{stat.value}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Everything Your Gym Needs</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">One platform to run your entire gym operation.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-brand-500/10 to-blue-500/10 border border-brand-200 dark:border-brand-500/20"
          >
            <Zap className="h-12 w-12 text-brand-500 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Ready to Transform Your Gym?
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join gyms across Africa using GymMateHub to streamline operations and stop missing renewals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:scale-105">
                Start Free Trial
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white font-semibold rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                Schedule Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
