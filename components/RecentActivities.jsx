"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Project data from ProjectsPage (same structure)
const projectData = {
  food: {
    titleEn: "Food Distribution",
    titleAr: "توزيع الطعام",
    projects: [
      { id: 1, titleEn: "Ramadan Iftar 2025", titleAr: "إفطار رمضان 2025", date: "2025-03-15", venue: "Hojai, Assam", image: "/meed1.jpg", snippetEn: "Distributed 500 Iftar meals to families.", snippetAr: "تم توزيع 500 وجبة إفطار على العائلات." },
      { id: 2, titleEn: "Flood Relief Food Kits", titleAr: "حقائب غذائية لإغاثة الفيضانات", date: "2024-07-10", venue: "Nagaon, Assam", image: "/meed1.jpg", snippetEn: "Provided food kits to 300 flood-affected households.", snippetAr: "تم توفير حقائب غذائية لـ 300 أسرة متضررة من الفيضانات." },
    ],
  },
  education: {
    titleEn: "Education Initiatives",
    titleAr: "مبادرات التعليم",
    projects: [
      { id: 3, titleEn: "Scholarship Program 2024", titleAr: "برنامج المنح الدراسية 2024", date: "2024-09-20", venue: "Guwahati, Assam", image: "/meed2.jpg", snippetEn: "Awarded scholarships to 100 students.", snippetAr: "تم منح منح دراسية لـ 100 طالب." },
      { id: 4, titleEn: "Madrasah Modernization", titleAr: "تحديث المدارس الدينية", date: "2024-05-12", venue: "Dhubri, Assam", image: "/meed2.jpg", snippetEn: "Upgraded facilities for 200 students.", snippetAr: "تم تحديث المرافق لـ 200 طالب." },
    ],
  },
  handpumps: {
    titleEn: "Handpump Installations",
    titleAr: "تركيب المضخات اليدوية",
    projects: [
      { id: 5, titleEn: "Handpump Project 2024", titleAr: "مشروع المضخات اليدوية 2024", date: "2024-06-15", venue: "Barpeta, Assam", image: "/tanki1.jpeg", snippetEn: "Installed 50 new handpumps.", snippetAr: "تم تركيب 50 مضخة يدوية جديدة." },
      { id: 6, titleEn: "Village Water Access", titleAr: "توفير المياه للقرى", date: "2024-03-10", venue: "Kamrup, Assam", image: "/tanki2.jpeg", snippetEn: "Provided water access to 150 households.", snippetAr: "تم توفير المياه لـ 150 أسرة." },
    ],
  },
  wells: {
    titleEn: "Well Construction",
    titleAr: "بناء الآبار",
    projects: [
      { id: 7, titleEn: "Community Well 2024", titleAr: "بئر المجتمع 2024", date: "2024-08-05", venue: "Morigaon, Assam", image: "/tanki1.jpeg", snippetEn: "Constructed a well for 200 villagers.", snippetAr: "تم بناء بئر لـ 200 قروي." },
      { id: 8, titleEn: "Agricultural Well", titleAr: "بئر زراعي", date: "2024-04-20", venue: "Sonitpur, Assam", image: "/tanki2.jpeg", snippetEn: "Supported 50 farmers with irrigation.", snippetAr: "تم دعم 50 مزارعاً بالري." },
    ],
  },
  mosques: {
    titleEn: "Mosque Projects",
    titleAr: "مشاريع المساجد",
    projects: [
      { id: 9, titleEn: "Mosque Renovation 2024", titleAr: "تجديد المسجد 2024", date: "2024-07-25", venue: "Nalbari, Assam", image: "/masjid1.jpeg", snippetEn: "Renovated a mosque for 300 worshippers.", snippetAr: "تم تجديد مسجد لـ 300 مصلٍ." },
      { id: 10, titleEn: "New Mosque Construction", titleAr: "بناء مسجد جديد", date: "2024-02-15", venue: "Darrang, Assam", image: "/masjid2.jpeg", snippetEn: "Built a new mosque for the community.", snippetAr: "تم بناء مسجد جديد للمجتمع." },
    ],
  },
  general: {
    titleEn: "General Initiatives",
    titleAr: "مبادرات عامة",
    projects: [
      { id: 11, titleEn: "Medical Camp 2024", titleAr: "معسكر طبي 2024", date: "2024-10-10", venue: "Jorhat, Assam", image: "/tanki1.jpeg", snippetEn: "Provided free check-ups for 500 people.", snippetAr: "تم توفير فحوصات مجانية لـ 500 شخص." },
      { id: 12, titleEn: "Tree Planting Drive", titleAr: "حملة زراعة الأشجار", date: "2024-09-05", venue: "Sivasagar, Assam", image: "/masjid2.jpeg", snippetEn: "Planted 1,000 trees.", snippetAr: "تم زراعة 1000 شجرة." },
    ],
  },
};

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

  /* Fetch top 10 recent projects */
  const [recentProjects, setRecentProjects] = useState([]);
  useEffect(() => {
    const allProjects = Object.values(projectData)
      .flatMap(category => category.projects)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    setRecentProjects(allProjects);
  }, []);

  /* Carousel state */
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    if (recentProjects.length > 0) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % recentProjects.length);
      }, 5000); // Auto-scroll every 5 seconds
    }
    return () => clearInterval(autoScrollRef.current);
  }, [recentProjects.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recentProjects.length);
    clearInterval(autoScrollRef.current); // Reset auto-scroll on manual navigation
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentProjects.length);
    }, 5000);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? recentProjects.length - 1 : prev - 1));
    clearInterval(autoScrollRef.current); // Reset auto-scroll on manual navigation
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentProjects.length);
    }, 5000);
  };

  /* Animation variants */
  const cardVariants = {
    hidden: { opacity: 0, x: isAr ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: isAr ? -50 : 50, transition: { duration: 0.5, ease: "easeOut" } },
  };

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

      {/* Carousel */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-10">
        {recentProjects.length > 0 ? (
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100/50" dir={isAr ? "rtl" : "ltr"}>
            <AnimatePresence mode="wait">
              <motion.article
                key={currentIndex}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-4xl mx-auto"
              >
                <div className="md:w-1/2 w-full">
                  <Image
                    src={recentProjects[currentIndex].image || "/placeholder.png"}
                    alt={isAr ? recentProjects[currentIndex].titleAr : recentProjects[currentIndex].titleEn}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="md:w-1/2 w-full flex flex-col justify-center text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {isAr ? recentProjects[currentIndex].titleAr : recentProjects[currentIndex].titleEn}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {isAr ? recentProjects[currentIndex].snippetAr : recentProjects[currentIndex].snippetEn}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>{isAr ? "التاريخ" : "Date"}:</strong> {recentProjects[currentIndex].date}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>{isAr ? "المكان" : "Venue"}:</strong> {recentProjects[currentIndex].venue}
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-full shadow-lg"
              whileHover={{ scale: 1.2, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isAr ? "السابق" : "Previous"}
            >
              <FaArrowLeft />
            </motion.button>
            <motion.button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-full shadow-lg"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isAr ? "التالي" : "Next"}
            >
              <FaArrowRight />
            </motion.button>

            {/* Dots for Carousel */}
            <div className="flex justify-center gap-2 mt-6">
              {recentProjects.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? "bg-emerald-600 scale-125" : "bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">{isAr ? "لا توجد مشاريع متاحة" : "No projects available"}</p>
        )}
      </div>

      {/* Explore More Button */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-8 text-center">
        <Link
          href={isAr ? "/ar/projects" : "/projects"}
          className="inline-block bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {isAr ? "استكشف المزيد من الأنشطة والمشاريع" : "Explore More Activities and Projects"}
        </Link>
      </div>
    </section>
  );
}