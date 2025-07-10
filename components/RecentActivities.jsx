
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Static fallback project data
const fallbackProjectData = {
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
  const router = useRouter();

  /* Headline parts */
  const HEAD_EN_PREFIX = "OUR RECENT";
  const HEAD_EN_WORD = "ACTIVITIES";
  const HEAD_AR = "أحدث أنشطتنا";

  /* Typing state (prefix in EN, whole phrase in AR) */
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
  const [recentProjectsLoading, setRecentProjectsLoading] = useState(true);
  const [recentProjectsError, setRecentProjectsError] = useState(null);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        setRecentProjectsLoading(true);
        const response = await fetch("/api/projects?recent=true&limit=10");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched recent projects:", data);
        setRecentProjects(data);
        setRecentProjectsError(null);
      } catch (error) {
        console.error("Error fetching recent projects:", error);
        setRecentProjectsError(error.message);
        // Fallback to static project data
        const allProjects = Object.values(fallbackProjectData)
          .flatMap(category => category.projects)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10);
        setRecentProjects(allProjects);
      } finally {
        setRecentProjectsLoading(false);
      }
    };
    fetchRecentProjects();
  }, []);

  /* Carousel state */
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    if (recentProjects.length > 0) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % recentProjects.length);
      }, 5000);
    }
    return () => clearInterval(autoScrollRef.current);
  }, [recentProjects.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recentProjects.length);
    clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentProjects.length);
    }, 5000);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? recentProjects.length - 1 : prev - 1));
    clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentProjects.length);
    }, 5000);
  };

  const handleProjectClick = (projectId, category) => {
    const path = isAr ? `/ar/projects?category=${category}&id=${projectId}` : `/projects?category=${category}&id=${projectId}`;
    router.push(path);
    console.log(`Project clicked: ID ${projectId}, Category ${category}, Navigating to ${path}`);
  };

  /* Animation variants */
  const cardVariants = {
    hidden: { opacity: 0, x: isAr ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: isAr ? -50 : 50, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative py-8 bg-gradient-to-br from-gray-50 via-white to-teal-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Headline box */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 text-center z-10"
      >
        <div className="bg-white/80 backdrop-blur-md border border-gray-100/50 px-8 py-3 rounded-lg text-center shadow-lg transition-all duration-300 hover:shadow-xl inline-block">
          {isAr ? (
            <h2 className="text-3xl md:text-4xl font-bold text-teal-900 tracking-tight border-b-4 border-emerald-600 pb-2 font-arabic">
              {typed}
            </h2>
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold text-teal-900 tracking-tight">
              <span className="inline-block border-b-4 border-emerald-600 pb-2">{HEAD_EN_WORD}</span>{" "}
              <span className="inline-block text-emerald-700">{typed}</span>
            </h2>
          )}
        </div>
      </motion.div>

      {/* Carousel */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {recentProjectsLoading ? (
          <p className="text-center text-gray-600 text-lg">
            {isAr ? "جاري تحميل الأنشطة..." : "Loading activities..."}
          </p>
        ) : recentProjectsError ? (
          <p className="text-center text-red-600 text-lg">
            {isAr ? "فشل في تحميل الأنشطة. يتم استخدام البيانات الافتراضية." : "Failed to load activities. Using fallback data."}
          </p>
        ) : recentProjects.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100/50" dir={isAr ? "rtl" : "ltr"}>
            <AnimatePresence mode="wait">
              <motion.article
                key={currentIndex}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-4xl mx-auto cursor-pointer"
                onClick={() => handleProjectClick(recentProjects[currentIndex].id, recentProjects[currentIndex].category)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="md:w-1/2 w-full">
                  <Image
                    src={recentProjects[currentIndex].images?.[0] || "/placeholder.png"}
                    alt={isAr ? recentProjects[currentIndex].titleAr : recentProjects[currentIndex].titleEn}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="md:w-1/2 w-full flex flex-col justify-center text-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                    {isAr ? recentProjects[currentIndex].titleAr : recentProjects[currentIndex].titleEn}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mt-2">
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
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-3 rounded-full shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.2, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isAr ? "السابق" : "Previous"}
            >
              <FaArrowLeft />
            </motion.button>
            <motion.button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-3 rounded-full shadow-md hover:shadow-lg"
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
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-teal-600 scale-125" : "bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            {isAr ? "لا توجد أنشطة متاحة" : "No activities available"}
          </p>
        )}
      </div>

      {/* Explore More Button */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-center">
        <Link
          href={isAr ? "/ar/projects" : "/projects"}
          className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {isAr ? "استكشف المزيد من الأنشطة والمشاريع" : "Explore More Activities and Projects"}
        </Link>
      </div>
    </section>
  );
}
