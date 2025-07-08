"use client";
import { useState, useEffect, memo } from "react";
import { useRouter, usePathname } from "next/navigation";

const NavItem = memo(({ path, ar, en, isExternal, isAr, navigate, pathname }) => {
  const fullPath = isExternal ? path : path === "" ? (isAr ? "/ar" : "/") : isAr ? `/ar${path}` : path;
  const isActive = !isExternal && (pathname === fullPath || (path === "" && pathname === (isAr ? "/ar" : "/")));

  return (
    <button
      onClick={() => navigate(path, isExternal)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                 ${isActive ? "text-amber-600 bg-amber-100" : "text-gray-600 hover:text-amber-600"}
                 focus:outline-none focus:ring-2 focus:ring-amber-300`}
    >
      {isAr ? ar : en}
    </button>
  );
});

const LanguageToggle = ({ isAr, router, pathname }) => {
  const [href, setHref] = useState("/");

  useEffect(() => {
    setHref(isAr ? pathname.replace("/ar", "") || "/" : `/ar${pathname}`);
  }, [pathname, isAr]);

  return (
    <button
      onClick={() => router.push(href)}
      className="text-red-600 border px-2 py-1 rounded border-red-600 hover:bg-yellow-300 hover:text-green-900 transition"
      aria-label={isAr ? "Switch to English" : "Switch to Arabic"}
    >
      {isAr ? "ENG" : "العربية"}
    </button>
  );
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAr = pathname.startsWith("/ar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = (path, isExternal = false) => {
    if (isExternal) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      const fullPath = path === "" ? (isAr ? "/ar" : "/") : isAr ? `/ar${path}` : path;
      router.push(fullPath);
    }
    setIsMenuOpen(false);
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
        {/* Logo + Brand */}
        <button
          onClick={() => navigate("", false)}
          className="flex items-center gap-2"
        >
          <img src="/logo.png" alt="MEED Public School Society Logo" className="h-8 w-auto" />
          <span className="text-base sm:text-lg font-semibold text-green-700 md:text-lg">
            {isAr ? "جمعية ميد للمدرسة العامة" : window.innerWidth < 768 ? "MPS Society" : "MEED Public School Society"}
          </span>
        </button>

        {/* Desktop Nav + Controls */}
        <nav className="hidden md:flex items-center gap-2">
          <LanguageToggle isAr={isAr} router={router} pathname={pathname} />
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isAr={isAr}
              navigate={navigate}
              pathname={pathname}
            />
          ))}
          <button
            onClick={() => navigate("/donate")}
            className="ml-2 px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md shadow-md animate-light-pulse relative overflow-hidden"
            aria-label={isAr ? "تبرع الآن" : "Donate Now"}
          >
            {isAr ? "تبرع الآن" : "Donate Now"}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/4 animate-sparkle"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/5 animate-sparkle-delayed"></span>
            <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow"></span>
          </button>
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => navigate("/donate")}
            className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-md whitespace-nowrap min-w-[70px] relative overflow-hidden"
            aria-label={isAr ? "تبرع" : "Donate"}
          >
            {isAr ? "تبرع" : "Donate"}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/4 animate-sparkle"></span>
            <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow"></span>
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600"
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
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 flex flex-col gap-2">
          <LanguageToggle isAr={isAr} router={router} pathname={pathname} />
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isAr={isAr}
              navigate={navigate}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </header>
  );
}