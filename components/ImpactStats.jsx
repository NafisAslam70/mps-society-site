"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ImpactStats() {
  const isAr = usePathname().startsWith("/ar");

  /* headline parts */
  const HEAD_EN_PREFIX = "OUR";
  const HEAD_EN_WORD = "IMPACT";
  const HEAD_AR = "تأثيرنا";

  /* typing state (prefix in EN, whole phrase in AR) */
  const [typed, setTyped] = useState("");
  useEffect(() => {
    const WORD = isAr ? HEAD_AR : HEAD_EN_PREFIX;
    let i = 0, dir = 1;
    const id = setInterval(() => {
      i += dir;
      if (i === WORD.length + 6) dir = -1;
      if (i === 0) dir = 1;
      setTyped(WORD.slice(0, Math.min(Math.max(i, 0), WORD.length)));
    }, 90);
    return () => clearInterval(id);
  }, [isAr]);

  /* stats data with initial and target values */
  const stats = [
    { labelEn: "Beneficiaries", labelAr: "المستفيدون", value: 1504486, initial: 0 },
    { labelEn: "Medical Aids", labelAr: "المساعدات الطبية", value: 520000, initial: 0 },
    { labelEn: "Tree Planted", labelAr: "شجرة زرعت", value: 10256, initial: 0 },
    { labelEn: "Project Complete", labelAr: "مشروع مكتمل", value: 5412, initial: 0 },
    { labelEn: "Skilled and Trained", labelAr: "المتدربون", value: 10254, initial: 0 },
    { labelEn: "Students Benefits", labelAr: "فوائد الطلاب", value: 12056, initial: 0 },
    { labelEn: "Scholarship", labelAr: "منحة دراسية", value: 7256, initial: 0 },
    { labelEn: "Agricultural Benefit", labelAr: "الفائدة الزراعية", value: 6256, initial: 0 },
  ];

  /* state for counting animation */
  const [counted, setCounted] = useState(stats.map(() => 0));

  useEffect(() => {
    let timer; // Declare timer in outer scope
    const countDuration = 3000; // 3 seconds for counting
    const stepTime = 30; // Adjusted step time for smoother counting
    const steps = Math.floor(countDuration / stepTime);

    const animateCount = () => {
      setCounted(stats.map(s => s.initial));
      const increments = stats.map(s => Math.ceil((s.value - s.initial) / steps));
      let currentCounts = stats.map(s => s.initial);

      timer = setInterval(() => {
        setCounted(prev => {
          const newCounts = prev.map((c, i) => {
            const increment = increments[i];
            const nextCount = c + increment;
            return nextCount >= stats[i].value ? stats[i].value : nextCount;
          });
          if (newCounts.every((c, i) => c >= stats[i].value)) {
            clearInterval(timer);
            setTimeout(() => {
              setCounted(stats.map(s => s.value)); // Hold at target for 5 seconds
              setTimeout(animateCount, 3000); // Restart after 5 seconds
            }, 0);
          }
          return newCounts;
        });
      }, stepTime);
    };

    animateCount();

    return () => clearInterval(timer); // Cleanup with the defined timer
  }, []);

  return (
    <section className="relative py-2 bg-[#F5F1E9]">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/tanki1.jpeg')" }}></div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative -top-12 z-10 text-center mb-12"
      >
        <div className="inline-block bg-white/90 backdrop-blur-md border border-gray-200 px-12 py-4 rounded-lg text-center shadow-2xl shadow-gray-800/80 transition-all duration-300 hover:shadow-gray-600/70">
          {isAr ? (
            <h2 className="text-4xl font-bold text-green-900 tracking-tight inline-block border-b-4 border-red-600 pb-2 font-arabic">
              {typed}
            </h2>
          ) : (
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              <span className="inline-block border-b-4 border-red-600 pb-2">{HEAD_EN_WORD}</span>{" "}
              <span className="inline-block text-green-700">{typed}</span>
            </h2>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="relative z-10 -top-12 max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((s, index) => (
          <div key={s.labelEn} className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <motion.div
              className="text-2xl font-semibold text-green-700"
              initial={{ value: 0 }}
              animate={{ value: counted[index] }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              {counted[index].toLocaleString()}+
            </motion.div>
            <div className="mt-2 text-sm text-gray-600">{isAr ? s.labelAr : s.labelEn}</div>
          </div>
        ))}
      </div>
    </section>
  );
}