import { motion } from "framer-motion";
import { Heart, Target, Lightbulb, Shield, Eye, TrendingUp, Rocket, Users, Award, CheckCircle } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const coreValues = [
  { icon: Lightbulb, title: "Innovation", description: "We constantly push the boundaries of technology to deliver cutting-edge solutions for the fitness industry." },
  { icon: Shield, title: "Reliability", description: "Our platform is built to be robust, secure, and always available, so you can run your business with confidence." },
  { icon: Heart, title: "Customer Success", description: "Your success is our success. We are dedicated to providing exceptional support and partnership." },
  { icon: Eye, title: "Transparency", description: "We believe in open communication and honest practices in everything we do." },
];

const milestones = [
  { icon: Rocket, color: "text-brand-400", year: "2024", title: "Market Entry", description: "GymMateHub launched, entering the market with a vision to simplify gym management for Africa." },
  { icon: Users, color: "text-blue-400", year: "2025", title: "100+ Gyms Onboarded", description: "Achieved a significant customer acquisition milestone, helping over 100 gyms transform their operations." },
  { icon: TrendingUp, color: "text-purple-400", year: "2025", title: "$1M ARR Target", description: "Reached our first major revenue goal, demonstrating strong market fit and growth." },
  { icon: Award, color: "text-orange-400", year: "Future", title: "Industry Leader", description: "Our goal is to become the #1 gym management platform globally." },
];

const whyChooseUs = [
  { title: "AI-Powered Advantage", description: "Leverage predictive analytics and personalization to stay ahead of the competition." },
  { title: "All-in-One Platform", description: "Simplify your tech stack with a single, integrated solution for all your gym management needs." },
  { title: "Member-Centric Design", description: "Enhance member retention and satisfaction with our intuitive mobile and web apps." },
  { title: "Scalable & Secure", description: "Grow from a single studio to a multi-location franchise with our enterprise-grade platform." },
];

export default function LandingAbout() {
  return (
    <>
      <PageMeta title="About GymMateHub - Simple Gym Software for Africa" description="Learn about GymMateHub's mission to simplify gym management for Africa." />

      <div className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 dark:bg-brand-500/10 dark:border-brand-500/20 mb-6">
                <Heart className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-medium text-brand-600 dark:text-brand-400">Our Story</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
                Powering the Future of
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">Fitness Businesses</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                We're a team of fitness enthusiasts and tech innovators on a mission to empower gym owners with the tools they need to thrive.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 mb-4">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Our Mission</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Revolutionizing Gym Management</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Our mission is to provide a seamless, intelligent, and comprehensive management platform that empowers fitness businesses of all sizes to streamline their operations, deepen member engagement, and accelerate growth.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">The GymMateHub Story</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  GymMateHub was born from a simple observation: while the fitness world was evolving, the tools to manage gyms were stuck in the past — and completely ignored African markets. We were frustrated with expensive foreign software that didn't understand cash payments, bank transfers, or WhatsApp. We envisioned a simple platform built for how local gyms actually work. That vision became GymMateHub.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">The principles that guide our company, product, and people.</p>
            </motion.div>
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((v) => (
                <motion.div key={v.title} variants={itemVariants} className="text-center p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="inline-flex p-4 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 mb-4">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{v.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Our Journey So Far</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Key achievements that mark our path to success.</p>
            </motion.div>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
              {milestones.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                  className={`flex md:items-center mb-12 w-full ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="hidden md:flex w-1/2" />
                  <div className="hidden md:flex justify-center w-12">
                    <div className="z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-brand-500 flex items-center justify-center">
                      <m.icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <p className="text-brand-500 font-semibold mb-1">{m.year}</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{m.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Why Choose GymMateHub?</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {whyChooseUs.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-brand-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
