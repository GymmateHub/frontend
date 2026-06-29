import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, BookOpen, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";


const SocialFb = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "h-5 w-5"}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const SocialTw = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "h-5 w-5"}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const SocialLi = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "h-5 w-5"}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const contactInfo = [
  { icon: Mail, title: "Email Address", value: "support@gymmatehub.com" },
  { icon: Phone, title: "Phone Number", value: "+234 (0) 801 234 5678" },
  { icon: MapPin, title: "Office Address", value: "Lagos, Nigeria" },
  { icon: Clock, title: "Business Hours", value: "Mon - Fri, 9am - 6pm WAT" },
];

const socialLinks = [
  { name: "Facebook", icon: SocialFb },
  { name: "Twitter", icon: SocialTw },
  { name: "LinkedIn", icon: SocialLi },
];

const quickLinks = [
  { name: "Getting Started Guide", icon: BookOpen },
  { name: "Pricing Plans", icon: HelpCircle },
  { name: "Book a Demo", icon: Send },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export default function LandingContact() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", phone: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent! We'll get back to you shortly.");
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    }, 1500);
  };

  return (
    <>
      <PageMeta title="Contact GymMateHub - Get Support" description="Contact GymMateHub for gym software support or to chat on WhatsApp." />

      <div className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 dark:bg-brand-500/10 dark:border-brand-500/20 mb-6">
              <MessageSquare className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">Get in Touch</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
              We&apos;d Love to Hear
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">From You</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
              Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </motion.div>
        </section>

        {/* Form & Info */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name <span className="text-error-500">*</span></Label>
                    <Input id="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address <span className="text-error-500">*</span></Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" type="tel" placeholder="+234 000 0000" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="company">Gym / Company Name</Label>
                    <Input id="company" type="text" placeholder="My Gym" value={formData.company} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message <span className="text-error-500">*</span></Label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full mt-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg disabled:opacity-60 group"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <item.icon className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{item.title}</p>
                        <p className="text-gray-500 dark:text-gray-400">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Quick Links</h2>
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <a key={link.name} href="#"
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                    >
                      <link.icon className="h-5 w-5 text-brand-500" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{link.name}</span>
                    </a>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Follow us on social media</p>
                  <div className="flex gap-3">
                    {socialLinks.map(({ name, icon: Icon }) => (
                      <a key={name} href="#" className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-500 transition-colors">
                        <span className="sr-only">{name}</span>
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

