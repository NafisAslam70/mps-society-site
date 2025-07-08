"use client";
import { useState, useEffect, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";

const NavItem = memo(({ path, ar, en, isExternal, isAr, navigate, pathname }) => {
  const fullPath = isExternal ? path : path === "" ? (isAr ? "/ar" : "/") : isAr ? `/ar${path}` : path;
  const isActive = !isExternal && (pathname === fullPath || (path === "" && pathname === (isAr ? "/ar" : "/")));

  return (
    <motion.button
      onClick={() => navigate(path, isExternal)}
      className={`relative px-4 py-2 rounded-lg font-medium transition-colors duration-200
                 ${isActive ? "text-amber-500 bg-amber-100/20" : "text-gray-700 hover:text-amber-400"} 
                 focus:outline-none focus:ring-2 focus:ring-amber-300`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-current={isActive ? "page" : undefined}
    >
      {isAr ? ar : en}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400"
        initial={{ scaleX: isActive ? 1 : 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
});

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAr = pathname.startsWith("/ar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Sync theme with system preference and persist in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Navigation handler
  const navigate = (path, isExternal = false) => {
    if (isExternal) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      const fullPath = path === "" ? (isAr ? "/ar" : "/") : isAr ? `/ar${path}` : path;
      router.push(fullPath);
    }
    setIsMenuOpen(false);
  };

  // Nav items data
  const navItems = [
    { path: "", ar: "الرئيسية", en: "Home", isExternal: false },
    { path: "/about", ar: "من نحن", en: "About", isExternal: false },
    { path: "/contact", ar: "تواصل", en: "Contact", isExternal: false },
    { path: "/projects", ar: "المشاريع", en: "Projects", isExternal: false },
    { path: "https://www.mymeedpss.com", ar: "الأكاديميات", en: "Academics", isExternal: true },
  ];

  // Donate button props
  const donatePath = isAr ? "/donate" : "/donate";
  const donateLabel = isAr ? "تبرع الآن" : "Donate Now";

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo + Brand */}
        <motion.button
          onClick={() => navigate(isAr ? "/ar" : "/")}
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src="/logo.png"
            alt="Meed Logo"
            className="h-10 w-auto transition-transform duration-300"
          />
          <span className="text-xl font-bold text-green-700 dark:text-green-400">
            {isAr ? "جمعية ميد للمدرسة العامة" : "MPS Society"}
          </span>
        </motion.button>

        {/* Desktop Nav + Controls */}
        <nav className="hidden md:flex items-center gap-4 text-base" role="navigation">
          <LanguageToggle tooltip={isAr ? "Switch to English" : "تبديل إلى العربية"} />
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isAr={isAr}
              navigate={navigate}
              pathname={pathname}
            />
          ))}
          <motion.button
            onClick={() => navigate(donatePath)}
            className="relative px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 
                       text-white rounded-lg shadow-md overflow-hidden animate-light-pulse"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            aria-label={donateLabel}
          >
            {donateLabel}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/4 animate-sparkle" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/5 animate-sparkle-delayed" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/6 animate-sparkle-fast" />
            <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow" />
          </motion.button>
          <motion.button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </motion.button>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <motion.button
            onClick={() => navigate(donatePath)}
            className="relative px-4 py-1.5 bg-emerald-600 dark:bg-emerald-500 text-white text-sm rounded-lg 
                       shadow-md overflow-hidden animate-light-pulse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={donateLabel}
          >
            {donateLabel}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/4 animate-sparkle" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/5 animate-sparkle-delayed" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/6 animate-sparkle-fast" />
            <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow" />
          </motion.button>
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 dark:text-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="md:hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg px-4 py-4 flex flex-col gap-3 border-t border-green-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="navigation"
          >
            <LanguageToggle tooltip={isAr ? "Switch to English" : "تبديل إلى العربية"} />
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                {...item}
                isAr={isAr}
                navigate={navigate}
                pathname={pathname}
              />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}