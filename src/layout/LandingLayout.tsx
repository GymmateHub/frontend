import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail, Phone, MapPin, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">GM</span>
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-lg">GymMateHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors relative ${
                  location.pathname === item.href
                    ? "text-brand-500"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors"
            >
              Start Free
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === item.href
                        ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-4 pt-2 flex flex-col gap-2">
                  <Link to="/login" className="block w-full text-center py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold">
                    Sign In
                  </Link>
                  <Link to="/register" className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl text-center">
                    Start Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}


const SocialFb = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "h-5 w-5"}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const SocialTw = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "h-5 w-5"}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const SocialLi = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "h-5 w-5"}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
function LandingFooter() {
  const footerLinks = {
    product: [
      { name: "Features", href: "/services" },
      { name: "Pricing", href: "/pricing" },
      { name: "Demo", href: "/contact" },
      { name: "Updates", href: "/about" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/contact" },
    ],
    support: [
      { name: "Help Center", href: "/contact" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">GM</span>
              </div>
              <span className="font-bold text-gray-800 dark:text-white text-lg">GymMateHub</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
              The simplest gym management platform built for Africa and emerging markets.
            </p>
            <div className="space-y-2">
              <a href="mailto:support@gymmatehub.com" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">
                <Mail className="h-4 w-4 text-brand-500" />
                support@gymmatehub.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">
                <Phone className="h-4 w-4 text-brand-500" />
                +1 (555) 123-4567
              </a>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-brand-500" />
                Lagos, Nigeria
              </div>
            </div>
          </div>

          <nav className="col-span-1 md:col-span-1 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <span className="text-gray-800 dark:text-white font-semibold text-sm mb-4 block capitalize">{category}</span>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="text-gray-500 dark:text-gray-400 hover:text-brand-500 text-sm transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; 2025 GymMateHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[{ name: "Facebook", Icon: SocialFb }, { name: "Twitter", Icon: SocialTw }, { name: "LinkedIn", Icon: SocialLi }].map(({ name, Icon }) => (
              <a key={name} href="#" className="text-gray-400 hover:text-brand-500 transition-colors p-2 rounded-full border border-gray-200 dark:border-gray-700">
                <span className="sr-only">{name}</span>
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <LandingHeader />
      <main>
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}



