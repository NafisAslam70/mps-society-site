"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // Using Next.js Image component for better image handling

/*──────────────── CSS key-frames ────────────────*/
const css = `
@keyframes kenBurns { 0%{transform:scale(1)} 100%{transform:scale(1.15)} }
@keyframes slideIn  { 0%{transform:translateX(100%)} 100%{transform:translateX(0)} }
@keyframes slideOut { 0%{transform:translateX(0)}   100%{transform:translateX(-100%)} }
`;

export default function HeroSection() {
  const isAr = usePathname().startsWith("/ar");

  /*──────────────── slide data with goals and donation focus ─────────────*/
  const slides = [
    {
      src: "/meed1.jpg",
      alt: isAr ? "مبنى جمعية ميد" : "Meed PSS Building",
      head: isAr ? "جمعية ميد للتنمية" : "Meed Development Society",
      body: isAr
        ? "نهدف لخدمة الإنسانية بكرامة منذ 2007 من خلال التعليم والمياه والمجتمع. ادعم أهدافنا بالتبرع اليوم!"
        : "Our mission since 2007: empower through education, water, and community. Support our goals with a donation today!",
      cta: isAr ? "تبرع الآن" : "Donate Now",
      href: isAr ? "/ar/donate" : "/donate",
      logo: "/logo.png",
    },
    {
      src: "/tanki1.jpeg",
      alt: isAr ? "مشروع خزان مياه" : "Water Tank Project",
      head: isAr ? "مياه نقية للجميع" : "Clean Water for All",
      body: isAr
        ? "نعيد الحياة للقرى بمشاريع المياه. ساعدنا بتبرعاتك لنوسع هذه الجهود!"
        : "Reviving villages with water projects. Help us expand with your donations!",
      cta: isAr ? "تبرع للمياه" : "Donate for Water",
      href: isAr ? "/ar/donate" : "/donate",
    },
    {
      src: "/masjid1.jpeg",
      alt: isAr ? "مسجد مجتمعي" : "Community Mosque",
      head: isAr ? "نبني الأمل" : "Building Hope",
      body: isAr
        ? "ندعم المراكز الروحية والتعليمية. انضم إلينا بالتبرع لدعم المجتمعا!"
        : "Supporting spiritual and educational hubs. Join us with a donation to uplift communities!",
      cta: isAr ? "تبرع للمجتمع" : "Donate for Community",
      href: isAr ? "/ar/donate" : "donate",
    },
    {
      src: "/masjid2.jpeg",
      alt: isAr ? "التعليم الديني" : "Madrasah Education",
      head: isAr ? "تعليم يغير الحياة" : "Education Changes Lives",
      body: isAr
        ? "نربي الأجيال بمناهج حديثة. تبرع لضمان مستقبل أفضل!"
        : "Nurturing generations with modern madrasahs. Donate to secure a brighter future!",
      cta: isAr ? "تبرع للتعليم" : "Donate for Education",
      href: isAr ? "/ar/donate" : "/donate",
    },
    {
      src: "/tanki2.jpeg",
      alt: isAr ? "تركيب مضخة يدوية" : "Hand-Pump Installation",
      head: isAr ? "مصادر مياه آمنة" : "Safe Water Sources",
      body: isAr
        ? "أكثر من 2000 مضخة تركيبها. دعمك يمكننا من المزيد!"
        : "Over 2,000 hand-pumps installed. Your support fuels more!",
      cta: isAr ? "ادعم الآن" : "Support Now",
      href: isAr ? "/ar/donate" : "/donate",
    },
  ];

  /*──────────────── state & timers ─────────────*/
  const [cur, setCur] = useState(0);
  const prevIdx = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      prevIdx.current = cur;
      setCur((p) => (p + 1) % slides.length);
    }, 7000);
    return () => clearInterval(id);
  }, [cur, slides.length]);

  const go = (n) => { prevIdx.current = cur; setCur(n); };
  const next = () => go((cur + 1) % slides.length);
  const prev = () => go(cur === 0 ? slides.length - 1 : cur - 1);

  const anim = (i) =>
    i === cur ? "animate-[slideIn_0.8s_ease-out]" : i === prevIdx.current ? "animate-[slideOut_0.4s_ease-in_forwards]" : "hidden";

  /*──────────────── render ─────────────*/
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-t from-gray-400 via-gray-500 to-white select-none">
        {/* backgrounds with image fallback */}
        <AnimatePresence>
          {slides.map((s, i) => (
            <motion.div
              key={s.src + i}
              className={`absolute inset-0 ${anim(i)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: i === cur ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Using Next.js Image with fallback */}
              <Image
                src={s.src}
                alt={s.alt}
                width={1440} // Match section width
                height={800} // Approximate height for h-[80vh]
                className="w-full h-full object-cover filter grayscale(50%)"
                onError={(e) => {
                  e.target.style.display = "none"; // Hide on error to avoid rubbish text
                  console.error(`Image load failed for ${s.src}`);
                }}
                style={{ animation: i === cur ? "kenBurns 7s linear infinite" : "none" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" /> {/* Subtle gradient */}
              {/* Subtle shadow overlay to suggest enveloping */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-black/20 opacity-60 transition-opacity duration-500" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* foreground text with smaller fonts */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative z-20 text-center px-6 py-12 ${isAr ? "font-arabic" : ""}`}
          dir={isAr ? "rtl" : "ltr"}
        >
          {slides[cur].logo && (
            <motion.img
              src={slides[cur].logo}
              alt="Logo"
              className="mx-auto mb-4 h-24 w-24 object-contain drop-shadow-2xl"
              onError={(e) => {
                e.target.style.display = "none"; // Hide on error
                console.error(`Logo load failed for ${slides[cur].logo}`);
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-2xl mb-4 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            {slides[cur].head}
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-white/90 mb-6 leading-relaxed drop-shadow-md">
            {slides[cur].body}
          </p>
          <motion.a
            href={slides[cur].href}
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-base font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {slides[cur].cta}
          </motion.a>
        </motion.div>

        <motion.button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-6 md:left-12 z-30 text-white/80 hover:text-white text-3xl font-bold bg-black/30 p-2 rounded-full transition-colors"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ‹
        </motion.button>
        <motion.button
          onClick={next}
          aria-label="Next"
          className="absolute right-6 md:right-12 z-30 text-white/80 hover:text-white text-3xl font-bold bg-black/30 p-2 rounded-full transition-colors"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ›
        </motion.button>

        <div className="absolute bottom-28 left-0 right-0 flex justify-center gap-3 z-30">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => go(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === cur ? "bg-white scale-150" : "bg-white/40"
              }`}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </section>
    </>
  );
}