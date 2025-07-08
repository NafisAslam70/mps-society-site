"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AboutStrip() {
  const pathname = usePathname();
  const isAr = pathname?.startsWith("/ar");
  const href = isAr ? "/ar/about" : "/about";

  const heading = isAr ? "من نحن" : "ABOUT US";
  const body = isAr
    ? "تسعى <strong>جمعية ميد العامة للمدارس</strong> لدعم الشرائح المتأخرة اقتصاديًا وتعليميًا في الهند. منذ بدايتها، أطلقت مبادرات في <strong>توفير المياه</strong>، <strong>التعليم</strong>، و<strong>تنمية المجتمع</strong>، مما جلب لها تقديرًا واسعًا لالتزامها بالتغيير الإيجابي والنمو المستدام."
    : "<strong>Meed Public School Society</strong> aims to support economically and educationally disadvantaged communities in India. Since its founding, it has launched initiatives in <strong>water access</strong>, <strong>education</strong>, and <strong>community development</strong>, earning wide recognition for its commitment to positive change and sustainable growth.";
  const legal = isAr
    ? "📜 الجمعية مسجلة بموجب قانون تسجيل الجمعيات لعام 1860 (رقم 646/2007-2008) ومعتمدة بموجب FCRA"
    : "📜 Registered under Societies Registration Act XXI of 1860 (No. 646/2007-08) • FCRA approved";
  const cta = isAr ? "المزيد" : "Know More";

  return (
    <section className="relative bg-gradient-to-b from-[#f0ede4] to-[#e7e5de] py-10">
      <svg className="absolute -top-10 w-full h-24 -translate-y-1/2 z-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,0 C400,60 1000,60 1440,0 L1440,120 L0,120 Z" fill="url(#waveGradient)" />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#f0ede4", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#e7e5de", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl -top-5 flex flex-col lg:flex-row gap-8 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:basis-1/2 relative lg:order-2"
        >
          <figure className="border-4 border-white rounded-xl overflow-hidden shadow-2xl shadow-black/90 hover:shadow-gray-500/50 transition-all duration-300">
            <img
              src="/meed2.jpg"
              alt="Society building"
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))" }}
            />
          </figure>
          <div className="absolute -top-10 left-0 translate-x-[20%] z-10">
            <div className="bg-white/90 backdrop-blur-sm px-12 py-5 rounded-lg shadow-lg shadow-gray-300/50">
              <h2 className="text-3xl font-extrabold text-[#1270a3] tracking-wider">{heading}</h2>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isAr ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`lg:basis-1/2 px-6 py-8 flex flex-col items-center justify-center ${isAr ? "text-right font-arabic" : "text-left"} lg:order-1`}
        >
          <p className="text-lg font-sans text-gray-700 text-justify leading-relaxed tracking-tight flex-1" dangerouslySetInnerHTML={{ __html: body }} />
          <div className={`${isAr ? "self-start" : "self-end"} mt-16`}>
            <Link
              href={href}
              className="inline-block bg-[#0f6b9c] hover:bg-[#0c5275] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {cta}
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <div className="mx-auto max-w-none">
          <div className="bg-gradient-to-r mb-15 mt-15 from-[#1270a3] to-[#0f6b9c] text-white text-center shadow-inner py-5 px-6 text-sm font-medium">
            {legal}
          </div>
        </div>
      </motion.div>
    </section>
  );
}