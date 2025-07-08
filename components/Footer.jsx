"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const isAr = usePathname().startsWith("/ar");

  /* ── link data ───────────────────────────────────────────── */
  const cols = {
    about: {
      heading: isAr ? "حول" : "ABOUT",
      links: [
        { href: "#", en: "Society Registration", ar: "تسجيل الجمعية" },
        { href: "#", en: "FCRA Registration", ar: "تسجيل FCRA" },
        { href: "#", en: "Our Management", ar: "إدارتنا" },
      ],
    },
    quick: {
      heading: isAr ? "روابط سريعة" : "QUICK LINKS",
      links: [
        { href: isAr ? "/ar" : "/", en: "Home", ar: "الرئيسية" },
        { href: isAr ? "/ar/projects" : "/projects", en: "Projects", ar: "المشاريع" },
        { href: isAr ? "/ar/donate" : "/donate", en: "Donate", ar: "التبرع" },
        { href: isAr ? "/ar/about" : "/about", en: "About Us", ar: "من نحن" },
        { href: isAr ? "/ar/contact" : "/contact", en: "Contact", ar: "تواصل" },
        { href: "#recent", en: "Recent Activities", ar: "أنشطة حديثة" },
      ],
    },
    helpful: {
      heading: isAr ? "روابط مفيدة" : "HELPFUL",
      links: [
        { href: isAr ? "/ar/donate" : "/donate", en: "Donate", ar: "التبرع" },
        { href: isAr ? "/ar/contact" : "/contact", en: "Get Involved", ar: "شارك" },
      ],
    },
  };

  /* ── component markup ───────────────────────────────────── */
  return (
    <footer
      className="bg-gradient-to-r from-green-700 to-green-800 text-white pt-8"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 mobile:grid-cols-2 md:grid-cols-4 gap-6 pb-8">
        {/* Replaced sm:grid-cols-2 with mobile:grid-cols-2 for 480px breakpoint */}

        {/* ABOUT column */}
        <div className="space-y-2">
          <h3 className="font-bold text-base mb-1">{cols.about.heading}</h3>
          <img src="/logo.png" alt="logo" className="h-12 w-auto" />
          <ul className="space-y-1 text-xs text-gray-200">
            {cols.about.links.map((l) => (
              <li key={l.en} className="flex items-start gap-1">
                <span>›</span>
                <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-2">
          <h3 className="font-bold text-base mb-1">{cols.quick.heading}</h3>
          <ul className="space-y-1 text-xs text-gray-200">
            {cols.quick.links.map((l) => (
              <li key={l.en} className="flex items-start gap-1">
                <span>›</span>
                <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* HELPFUL */}
        <div className="space-y-2">
          <h3 className="font-bold text-base mb-1">{cols.helpful.heading}</h3>
          <ul className="space-y-1 text-xs text-gray-200">
            {cols.helpful.links.map((l) => (
              <li key={l.en} className="flex items-start gap-1">
                <span>›</span>
                <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SOCIAL + inline Contact button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">{isAr ? "وسائل التواصل" : "SOCIAL MEDIA"}</h3>
            <Link
              href={isAr ? "/ar/contact" : "/contact"}
              className="bg-white text-green-800 font-semibold px-2 py-1 rounded shadow hover:bg-gray-100 transition text-xs"
            >
              {isAr ? "تواصل" : "Contact"}
            </Link>
          </div>
          <div className="w-full min-h-[80px] bg-gray-300 rounded overflow-hidden max-w-full">
            {/* Added max-w-full to prevent iframe overflow */}
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmymeed&width=240&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="240"
              className="w-full"
              style={{ border: "none", overflow: "hidden", minHeight: "80px" }}
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