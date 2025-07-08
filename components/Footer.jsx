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
      className="bg-gradient-to-r from-green-700 to-green-800 text-white pt-12"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 pb-12">
        {/* Single column on mobile, centered columns */}

        {/* ABOUT column */}
        <div className="flex flex-col items-center space-y-4">
          <div className={`flex flex-col ${isAr ? "items-end sm:items-start" : "items-start"} w-full max-w-[300px]`}>
            <img src="/logo.png" alt="Meed Public School Society Logo" className="h-20 w-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">{cols.about.heading}</h3>
            <ul className={`space-y-3 text-lg text-gray-200 ${isAr ? "items-end sm:items-start" : "items-start"} flex flex-col`}>
              {cols.about.links.map((l) => (
                <li key={l.en}>
                  <span className={`inline-flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : "flex-row"}`} style={isAr ? { direction: "ltr" } : {}}>
                    <span>{isAr ? "‹" : "›"}</span>
                    <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-col items-center space-y-4">
          <div className={`flex flex-col ${isAr ? "items-end sm:items-start" : "items-start"} w-full max-w-[300px]`}>
            <h3 className="font-bold text-lg mb-2">{cols.quick.heading}</h3>
            <ul className={`space-y-3 text-lg text-gray-200 ${isAr ? "items-end sm:items-start" : "items-start"} flex flex-col`}>
              {cols.quick.links.map((l) => (
                <li key={l.en}>
                  <span className={`inline-flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : "flex-row"}`} style={isAr ? { direction: "ltr" } : {}}>
                    <span>{isAr ? "‹" : "›"}</span>
                    <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* HELPFUL */}
        <div className="flex flex-col items-center space-y-4">
          <div className={`flex flex-col ${isAr ? "items-end sm:items-start" : "items-start"} w-full max-w-[300px]`}>
            <h3 className="font-bold text-lg mb-2">{cols.helpful.heading}</h3>
            <ul className={`space-y-3 text-lg text-gray-200 ${isAr ? "items-end sm:items-start" : "items-start"} flex flex-col`}>
              {cols.helpful.links.map((l) => (
                <li key={l.en}>
                  <span className={`inline-flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : "flex-row"}`} style={isAr ? { direction: "ltr" } : {}}>
                    <span>{isAr ? "‹" : "›"}</span>
                    <Link href={l.href}>{isAr ? l.ar : l.en}</Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SOCIAL + inline Contact button */}
        <div className="flex flex-col items-center space-y-4">
          <div className={`flex ${isAr ? "flex-row-reverse" : "flex-row"} items-center justify-between w-full max-w-[300px]`}>
            <h3 className="font-bold text-lg">{isAr ? "وسائل التواصل" : "SOCIAL MEDIA"}</h3>
            <Link
              href={isAr ? "/ar/contact" : "/contact"}
              className="bg-white text-green-800 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition text-base"
            >
              {isAr ? "تواصل" : "Contact"}
            </Link>
          </div>
          <div className="w-full max-w-[300px] min-h-[100px] bg-gray-300 rounded overflow-hidden">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmymeed&width=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="300"
              className="w-full"
              style={{ border: "none", overflow: "hidden", minHeight: "100px" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-[#fef9ef] text-center text-base text-black py-6 flex flex-col gap-4">
        <div>
          {isAr ? "عداد الزوار" : "Visitor counter"}:
          <span className="inline-block bg-white text-green-800 font-mono px-3 py-1 rounded ml-2 text-base">
            70599
          </span>
        </div>
        <div>Proudly created by Nafees © {new Date().getFullYear()} {isAr ? "جميع الحقوق محفوظة" : "All Rights Reserved"}</div>
      </div>
    </footer>
  );
}