"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const isAr = usePathname().startsWith("/ar");

  /* ── link data ───────────────────────────────────────────── */
  const cols = {
    /* >> KEEPING THESE ENTRIES UNCHANGED << */
    about: {
      heading: isAr ? "حول" : "ABOUT",
      links: [
        { href: "#", en: "Society Registration", ar: "تسجيل الجمعية" },
        { href: "#", en: "FCRA Registration",    ar: "تسجيل FCRA" },
        { href: "#", en: "Our Management",       ar: "إدارتنا" },
      ],
    },

    /* Slimmed-down: only real pages */
    quick: {
      heading: isAr ? "روابط سريعة" : "QUICK LINKS",
      links: [
        { href: isAr ? "/ar"            : "/",          en: "Home",            ar: "الرئيسية" },
        { href: isAr ? "/ar/projects"   : "/projects",  en: "Projects",        ar: "المشاريع" },
        { href: isAr ? "/ar/donate"     : "/donate",    en: "Donate",          ar: "التبرع"   },
        { href: isAr ? "/ar/about"      : "/about",     en: "About Us",        ar: "من نحن"   },
        { href: isAr ? "/ar/contact"    : "/contact",   en: "Contact",         ar: "تواصل"    },
        { href: "#recent",                               en: "Recent Activities", ar: "أنشطة حديثة" },
      ],
    },

    /* Only links that are live today */
    helpful: {
      heading: isAr ? "روابط مفيدة" : "HELPFUL",
      links: [
        { href: isAr ? "/ar/donate"   : "/donate",   en: "Donate",     ar: "التبرع" },
        { href: isAr ? "/ar/contact"  : "/contact",  en: "Get Involved",ar: "شارك" },
      ],
    },
  };

  /* ── component markup ───────────────────────────────────── */
  return (
    <footer
      className="bg-gradient-to-r from-green-700 to-green-800 text-white pt-10"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10">

        {/* ABOUT column (unchanged) */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg mb-2">{cols.about.heading}</h3>
          <img src="/logo.png" alt="logo" className="h-16 w-auto" />
          <ul className="space-y-1 text-sm text-gray-200">
            {cols.about.links.map((l) => (
              <li key={l.en} className="flex items-start gap-1">
                <span>›</span>
                <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg mb-2">{cols.quick.heading}</h3>
          <ul className="space-y-1 text-sm text-gray-200">
            {cols.quick.links.map((l) => (
              <li key={l.en} className="flex items-start gap-1">
                <span>›</span>
                <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* HELPFUL */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg mb-2">{cols.helpful.heading}</h3>
          <ul className="space-y-1 text-sm text-gray-200">
            {cols.helpful.links.map((l) => (
              <li key={l.en} className="flex items-start gap-1">
                <span>›</span>
                <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SOCIAL + inline Contact button */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">
              {isAr ? "وسائل التواصل" : "SOCIAL MEDIA"}
            </h3>
            <Link
              href={isAr ? "/ar/contact" : "/contact"}
              className="bg-white text-green-800 font-semibold px-3 py-1 rounded shadow hover:bg-gray-100 transition text-sm"
            >
              {isAr ? "تواصل" : "Contact"}
            </Link>
          </div>
          <div className="w-full min-h-[100px] bg-gray-300 rounded overflow-hidden"> {/* Minimum height for visibility */}
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmymeed&width=340&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="340"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-[#fef9ef] text-center text-xs text-black py-4 flex flex-col sm:flex-row justify-center gap-4">
        <div>
          {isAr ? "عداد الزوار" : "Visitor counter"}:
          <span className="inline-block bg-white text-green-800 font-mono px-2 py-0.5 rounded ml-1">
            70599
          </span>
        </div>
        <span className="hidden sm:inline">|</span>
        <div>© {new Date().getFullYear()} {isAr ? "جميع الحقوق محفوظة" : "All Rights Reserved"}</div>
      </div>
    </footer>
  );
}