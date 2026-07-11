import { useEffect, useState } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail, Phone, MapPin, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-theme-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">GM</span>
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-lg">GymMateHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brand-500"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
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
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
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

function LandingFooter() {
  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Sign In", href: "/login" },
      { name: "Start Free", href: "/register" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
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

          <nav className="lg:col-span-3 grid grid-cols-2 gap-8">
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
            &copy; {new Date().getFullYear()} GymMateHub. All rights reserved.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Built in Lagos, for gyms everywhere.</p>
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
