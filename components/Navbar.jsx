"use client";
import { useState, useEffect, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

const NavItem = memo(({ path, ar, en, isExternal, isAr, navigate, pathname, disabled }) => {
  const fullPath = isExternal ? path : path === "" ? (isAr ? "/ar" : "/") : isAr ? `/ar${path}` : path;
  const isActive = !isExternal && (pathname === fullPath || (path === "" && pathname === (isAr ? "/ar" : "/")));

  return (
    <button
      onClick={disabled ? (e) => e.preventDefault() : () => navigate(path, isExternal)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                 ${isActive ? "text-amber-600 bg-amber-100" : "text-gray-600 hover:text-amber-600"}
                 ${disabled ? "cursor-not-allowed opacity-50" : "focus:outline-none focus:ring-2 focus:ring-amber-300"}`}
      disabled={disabled}
    >
      {isAr ? ar : en}
    </button>
  );
});

const LanguageToggle = ({ isAr, router, pathname, disabled }) => {
  const [href, setHref] = useState("/");

  useEffect(() => {
    setHref(isAr ? pathname.replace("/ar", "") || "/" : `/ar${pathname}`);
  }, [pathname, isAr]);

  return (
    <button
      onClick={disabled ? (e) => e.preventDefault() : () => router.push(href)}
      className={`text-red-600 border px-2 py-1 rounded border-red-600 ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-yellow-300 hover:text-green-900 transition"}`}
      disabled={disabled}
      aria-label={isAr ? "Switch to English" : "Switch to Arabic"}
      suppressHydrationWarning
    >
      {isAr ? "ENG" : "العربية"}
    </button>
  );
};

const LogoutModal = ({ isOpen, onClose, onConfirm, isAr, isLoggingOut }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        >
          <h3 className="text-lg font-bold text-emerald-800 mb-4">{isAr ? "تأكيد الخروج" : "Confirm Logout"}</h3>
          <p className="text-gray-600 mb-6">{isAr ? "هل تريد تسجيل الخروج؟" : "Are you sure you want to log out?"}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              disabled={isLoggingOut}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition relative"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <span>{isAr ? "تسجيل الخروج" : "Logout"}</span>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAr = pathname.startsWith("/ar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useAppContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = (path, isExternal = false) => {
    if (path === "/admin/login" || path === "/admin") {
      router.push(path);
    } else if (isExternal) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      const fullPath = path === "" ? (isAr ? "/ar" : "/") : isAr ? `/ar${path}` : path;
      router.push(fullPath);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async logout
      setIsAdminLoggedIn(false);
      localStorage.removeItem("isAdminLoggedIn");
      setShowLogoutModal(false);
      setShowLogoutSuccess(true);
      setTimeout(() => {
        setShowLogoutSuccess(false);
        router.replace("/admin/login");
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      setShowLogoutSuccess(false);
    }
  };

  const navItems = [
    { path: "", ar: "الرئيسية", en: "Home", isExternal: false },
    { path: "/about", ar: "من نحن", en: "About", isExternal: false },
    { path: "/contact", ar: "تواصل", en: "Contact", isExternal: false },
    { path: "/projects", ar: "المشاريع", en: "Projects", isExternal: false },
    { path: "https://www.facebook.com/meed.pss", ar: "الأكاديميات", en: "Academics", isExternal: true },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <button
          onClick={isAdminLoggedIn ? (e) => e.preventDefault() : () => navigate("", false)}
          className={`flex items-center gap-2 ${isAdminLoggedIn ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={isAdminLoggedIn}
          suppressHydrationWarning
        >
        <img src="/logo.png" alt="MPS Society Logo" className="h-8 w-auto" />
          <span className="text-base sm:text-lg font-semibold text-green-700 md:text-lg">
            {isAr ? "جمعية ميد للمدرسة العامة" : "MPS Society"}
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {!isAdminLoggedIn && (
            <>
              <LanguageToggle isAr={isAr} router={router} pathname={pathname} disabled={isAdminLoggedIn} />
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  {...item}
                  isAr={isAr}
                  navigate={navigate}
                  pathname={pathname}
                  disabled={isAdminLoggedIn}
                />
              ))}
              <button
                onClick={isAdminLoggedIn ? (e) => e.preventDefault() : () => navigate("/donate")}
                className="ml-2 px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md shadow-md animate-light-pulse relative overflow-hidden"
                disabled={isAdminLoggedIn}
                aria-label={isAr ? "تبرع الآن" : "Donate Now"}
                suppressHydrationWarning
              >
                {isAr ? "تبرع الآن" : "Donate Now"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/4 animate-sparkle"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/5 animate-sparkle-delayed"></span>
                <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow"></span>
              </button>
            </>
          )}
          <button
            onClick={() => (isAdminLoggedIn ? setShowLogoutModal(true) : navigate("/admin/login"))}
            className={`ml-2 px-4 py-2 text-sm font-medium rounded-md transition ${
              isAdminLoggedIn ? "bg-red-200 text-red-800 hover:bg-red-300" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            aria-label={isAr ? (isAdminLoggedIn ? "تسجيل الخروج" : "تسجيل الدخول للمشرف") : (isAdminLoggedIn ? "Logout" : "Admin Login")}
            suppressHydrationWarning
          >
            {isAdminLoggedIn ? (isAr ? "تسجيل الخروج" : "Logout") : (
              <>
                <svg
                  className="w-5 h-5 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-2 2-2 2 .896 2 2zm8-2a8 8 0 10-16 0 8 8 0 0016 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
                {isAr ? "تسجيل الدخول" : "Admin"}
              </>
            )}
          </button>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          {!isAdminLoggedIn && (
            <>
              <button
                onClick={isAdminLoggedIn ? (e) => e.preventDefault() : () => navigate("/donate")}
                className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-md whitespace-nowrap min-w-[70px] relative overflow-hidden"
                disabled={isAdminLoggedIn}
                aria-label={isAr ? "تبرع" : "Donate"}
                suppressHydrationWarning
              >
                {isAr ? "تبرع" : "Donate"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/4 animate-sparkle"></span>
                <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow"></span>
              </button>
              <button
                onClick={isAdminLoggedIn ? (e) => e.preventDefault() : () => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600"
                disabled={isAdminLoggedIn}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                suppressHydrationWarning
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </>
          )}
          {isAdminLoggedIn && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 bg-red-200 text-red-800 text-sm font-medium rounded-md hover:bg-red-300 transition"
              aria-label={isAr ? "تسجيل الخروج" : "Logout"}
              suppressHydrationWarning
            >
              {isAr ? "تسجيل الخروج" : "Logout"}
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && !isAdminLoggedIn && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 flex flex-col gap-2">
          <LanguageToggle isAr={isAr} router={router} pathname={pathname} disabled={isAdminLoggedIn} />
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isAr={isAr}
              navigate={navigate}
              pathname={pathname}
              disabled={isAdminLoggedIn}
            />
          ))}
          <button
            onClick={isAdminLoggedIn ? (e) => e.preventDefault() : () => navigate("/donate")}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md shadow-md animate-light-pulse relative overflow-hidden"
            disabled={isAdminLoggedIn}
            aria-label={isAr ? "تبرع الآن" : "Donate Now"}
            suppressHydrationWarning
          >
            {isAr ? "تبرع الآن" : "Donate Now"}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/4 animate-sparkle"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/5 animate-sparkle-delayed"></span>
            <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow"></span>
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition"
            aria-label={isAr ? "تسجيل الدخول للمشرف" : "Admin Login"}
            suppressHydrationWarning
          >
            <svg
              className="w-5 h-5 inline-block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-2 2-2 2 .896 2 2zm8-2a8 8 0 10-16 0 8 8 0 0016 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            {isAr ? "تسجيل الدخول" : "Admin"}
          </button>
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isAr={isAr}
        isLoggingOut={isLoggingOut}
      />
      {showLogoutSuccess && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 bg-emerald-600 text-white rounded-lg p-4 shadow-lg z-50"
          >
            {isAr ? "تم تسجيل الخروج بنجاح!" : "Logged out successfully!"}
          </motion.div>
        </AnimatePresence>
      )}
    </header>
  );
}
