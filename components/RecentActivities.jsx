"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RecentActivities() {
  const isAr = usePathname().startsWith("/ar");

  /* headline parts */
  const HEAD_EN_PREFIX = "OUR RECENT";
  const HEAD_EN_WORD = "ACTIVITIES";
  const HEAD_AR = "أحدث أنشطتنا";

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

  /* cards */
  const items = [
    { img: "/masjid1.jpeg", titleEn: "Scholarship Meet Program organised by Markazul Ma'arif (NGO)", titleAr: "برنامج منح دراسية نظمته مركز المعرفة", snippetEn: "A scholarship holders' meet was organized to felicitate students who completed their studies...", snippetAr: "تم تنظيم لقاء للطلاب الحاصلين على منح دراسية للاحتفاء بإنجازاتهم..." },
    { img: "/tanki1.jpeg", titleEn: "10-day farmer training program at KVK, Hojai", titleAr: "برنامج تدريب للمزارعين لمدة 10 أيام في هوجاي", snippetEn: "Successful completion of a 10-day farmer camp to improve agricultural practices...", snippetAr: "تم الانتهاء بنجاح من معسكر تدريب لمدة 10 أيام لتحسين الممارسات الزراعية..." },
    { img: "/masjid2.jpeg", titleEn: "Amrit Brikshya Andolan observed", titleAr: "مبادرة أَمْرِت بريكشيا", snippetEn: "Students and staff planted saplings under the state-wide drive...", snippetAr: "قام الطلاب والموظفون بزراعة الشتلات ضمن حملة على مستوى الولاية..." },
    { img: "/tanki2.jpeg", titleEn: "Financial aid reaches 70 needy individuals in Hojai", titleAr: "مساعدات مالية لـ 70 محتاجًا", snippetEn: "Essential assistance was provided to widows and under-privileged families...", snippetAr: "تم تقديم مساعدات أساسية للأرامل والأسر المحتاجة..." },
  ];

  /* animation variants for zoom effect */
  const cardVariants = {
    normal: { scale: 1, transition: { duration: 0.5 } },
    zoomed: { scale: 1.1, transition: { duration: 0.5 } },
  };

  const [zoomedIndex, setZoomedIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setZoomedIndex((prev) => (prev + 1) % items.length);
    }, 1000); // Change zoom focus every 3 seconds
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <section className="relative pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
      {/* headline box */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-2xl"
      >
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 px-12 py-4 rounded-lg text-center shadow-2xl shadow-gray-800/80 transition-all duration-300 hover:shadow-gray-600/70">
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

      {/* banner image */}
      <div className="relative -mt-20 overflow-hidden h-[400px]">
        <motion.img
          src="/tanki1.jpeg"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 brightness-50"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
      </div>

      {/* cards grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-10">
        {items.map((it, index) => (
          <motion.article
            key={it.img}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            custom={index === zoomedIndex}
            variants={cardVariants}
            animate={index === zoomedIndex ? "zoomed" : "normal"}
            initial="normal"
          >
            <div className="relative">
              <img src={it.img} alt={isAr ? it.titleAr : it.titleEn} className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-3">
                {isAr ? it.titleAr : it.titleEn}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {isAr ? it.snippetAr : it.snippetEn}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}