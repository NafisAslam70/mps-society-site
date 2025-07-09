"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

// Initial projectData structure (server-safe default)
const initialProjectData = {
  food: { titleEn: "Food Distribution", titleAr: "توزيع الطعام", projects: [] },
  education: { titleEn: "Education Initiatives", titleAr: "مبادرات التعليم", projects: [] },
  handpumps: { titleEn: "Handpump Installations", titleAr: "تركيب المضخات اليدوية", projects: [] },
  wells: { titleEn: "Well Construction", titleAr: "بناء الآبار", projects: [] },
  mosques: { titleEn: "Mosque Projects", titleAr: "مشاريع المساجد", projects: [] },
  general: { titleEn: "General Initiatives", titleAr: "مبادرات عامة", projects: [] },
};

// Sample impact highlights
const impactHighlights = [
  { id: 1, titleEn: "1.5M+ Beneficiaries", titleAr: "أكثر من 1.5 مليون مستفيد", descriptionEn: "Our projects have impacted over 1.5 million lives across India.", descriptionAr: "أثرت مشاريعنا على أكثر من 1.5 مليون شخص في جميع أنحاء الهند.", icon: <FaStar /> },
  { id: 2, titleEn: "2,000+ Handpumps", titleAr: "أكثر من 2000 مضخة يدوية", descriptionEn: "Installed safe water sources for thousands of households.", descriptionAr: "تم تركيب مصادر مياه آمنة لآلاف الأسر.", icon: <FaStar /> },
  { id: 3, titleEn: "10,000+ Trees Planted", titleAr: "أكثر من 10000 شجرة مزروعة", descriptionEn: "Contributing to a greener future through reforestation.", descriptionAr: "نساهم في مستقبل أخضر من خلال إعادة التشجير.", icon: <FaStar /> },
];

// Sample recent posts
const recentPosts = [
  { id: 1, titleEn: "New Water Project Launched", titleAr: "إطلاق مشروع مياه جديد", date: "2025-01-10", snippetEn: "We launched a new handpump project in rural Assam.", snippetAr: "أطلقنا مشروع مضخات يدوية جديد في ريف آسام.", image: "/tanki1.jpeg" },
  { id: 2, titleEn: "Education Drive Success", titleAr: "نجاح حملة التعليم", date: "2024-12-20", snippetEn: "Our scholarship program empowered 50 students.", snippetAr: "مكّن برنامج المنح الدراسية 50 طالبًا.", image: "/meed2.jpg" },
  { id: 3, titleEn: "Community Iftar Event", titleAr: "حدث إفطار المجتمع", date: "2024-03-25", snippetEn: "Hosted a community Iftar for 200 families.", snippetAr: "استضفنا إفطارًا مجتمعيًا لـ 200 عائلة.", image: "/meed1.jpg" },
];

export default function ProjectsPage() {
  const isAr = usePathname().startsWith("/ar");
  const [activeCategory, setActiveCategory] = useState("food");
  const [carouselIndices, setCarouselIndices] = useState({});
  const [projectData, setProjectData] = useState(initialProjectData); // State to hold projectData
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  // Load projectData from localStorage on client side
  useEffect(() => {
    const savedData = localStorage.getItem("projectData");
    if (savedData) {
      setProjectData(JSON.parse(savedData));
    }
  }, []);

  // Initialize carousel indices
  useEffect(() => {
    const initialIndices = {};
    Object.keys(projectData).forEach((category) => {
      initialIndices[category] = 0;
    });
    setCarouselIndices(initialIndices);
  }, [projectData]);

  // Handle carousel navigation
  const handleNext = (category) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [category]: (prev[category] + 1) % projectData[category].projects.length,
    }));
  };

  const handlePrev = (category) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [category]: prev[category] === 0 ? projectData[category].projects.length - 1 : prev[category] - 1,
    }));
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, x: isAr ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: isAr ? -50 : 50, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const highlightVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section ref={sectionRef} className="relative py-16 bg-gradient-to-br from-gray-100 via-gray-50 to-white min-h-screen overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className={`text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 ${isAr ? "font-arabic" : "font-sans"}`}>
          {isAr ? "مشاريعنا" : "Our Projects"}
        </h1>
        <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-700 leading-relaxed">
          {isAr
            ? "استكشف مجموعتنا المتنوعة من المشاريع التي تهدف إلى رفع مستوى المجتمعات من خلال التعليم، والمياه، والتنمية الاجتماعية."
            : "Explore our diverse range of projects aimed at uplifting communities through education, water access, and social development."}
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Main Content (Categories, Carousel, and Impact Highlights) */}
        <div className="lg:w-3/4 space-y-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {Object.keys(projectData).map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 backdrop-blur-sm border border-transparent ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "bg-white/50 text-gray-700 hover:bg-white/80 hover:border-emerald-300"
                }`}
                whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0, 128, 128, 0.2)" }}
                whileTap={{ scale: 0.95}}
              >
                {isAr ? projectData[category].titleAr : projectData[category].titleEn}
              </motion.button>
            ))}
          </div>

          {/* Category Content */}
          {Object.keys(projectData).map(
            (category) =>
              activeCategory === category && (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100/50"
                >
                  <h2 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 mb-4 ${isAr ? "font-arabic" : ""}`}>
                    {isAr ? projectData[category].titleAr : projectData[category].titleEn}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {isAr ? projectData[category].descriptionAr : projectData[category].descriptionEn}
                  </p>

                  {/* Carousel */}
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={carouselIndices[category]}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col md:flex-row gap-6"
                      >
                        <div className="md:w-1/2">
                          <Image
                            src={projectData[category].projects[carouselIndices[category]]?.images[0] || "/placeholder.png"}
                            alt={
                              isAr
                                ? projectData[category].projects[carouselIndices[category]]?.titleAr || "Project image"
                                : projectData[category].projects[carouselIndices[category]]?.titleEn || "Project image"
                            } // Fallback alt text
                            width={500}
                            height={300}
                            className="w-full h-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="md:w-1/2 flex flex-col justify-center">
                          <h3 className="text-2xl font-semibold text-gray-900">
                            {isAr ? projectData[category].projects[carouselIndices[category]]?.titleAr : projectData[category].projects[carouselIndices[category]]?.titleEn}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            {isAr ? projectData[category].projects[carouselIndices[category]]?.snippetAr : projectData[category].projects[carouselIndices[category]]?.snippetEn}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <strong>{isAr ? "التاريخ" : "Date"}:</strong> {projectData[category].projects[carouselIndices[category]]?.date}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>{isAr ? "المكان" : "Venue"}:</strong> {projectData[category].projects[carouselIndices[category]]?.venue}
                          </p>
                          <Link
                            href={isAr ? "/ar/donate" : "/donate"}
                            className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full hover:from-emerald-700 hover:to-teal-800 transition-all duration-300"
                          >
                            {isAr ? "دعم المشروع" : "Support Project"}
                          </Link>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <motion.button
                      onClick={() => handlePrev(category)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-full shadow-lg"
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaArrowLeft />
                    </motion.button>
                    <motion.button
                      onClick={() => handleNext(category)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-full shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaArrowRight />
                    </motion.button>
                  </div>
                </motion.div>
              )
          )}

          {/* Impact Highlights Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-white/90 to-gray-100/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100/50"
          >
            <h2 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 mb-6 ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "إنجازاتنا المميزة" : "Our Impact Highlights"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {impactHighlights.map((highlight) => (
                <motion.div
                  key={highlight.id}
                  variants={highlightVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="bg-white/50 backdrop-blur-md rounded-xl p-6 border border-gray-100/30 hover:bg-white/80 transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 128, 128, 0.15)" }}
                >
                  <div className="text-3xl text-emerald-600 mb-4">{highlight.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{isAr ? highlight.titleAr : highlight.titleEn}</h3>
                  <p className="text-gray-600 mt-2">{isAr ? highlight.descriptionAr : highlight.descriptionEn}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Posts Sidebar */}
        <div className="lg:w-1/4">
          <motion.div
            initial={{ opacity: 0, x: isAr ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100/50"
          >
            <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 mb-6 ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "آخر الأخبار" : "Recent Posts"}
            </h2>
            <div className="space-y-8">
              {recentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  className="flex flex-col gap-3"
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                >
                  <Image
                    src={post.image}
                    alt={isAr ? post.titleAr : post.titleEn} // Fallback alt text
                    width={300}
                    height={150}
                    className="w-full h-36 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{isAr ? post.titleAr : post.titleEn}</h3>
                  <p className="text-sm text-gray-600">{isAr ? post.snippetAr : post.snippetEn}</p>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </motion.div>
              ))}
            </div>
            <Link
              href={isAr ? "/ar/projects" : "/projects"}
              className="mt-6 block text-center px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full hover:from-emerald-700 hover:to-teal-800 transition-all duration-300"
            >
              {isAr ? "عرض المزيد" : "View More"}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}