"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import { useAppContext } from "@/context/AppContext";

// Default project data structure
const defaultProjectData = {
  food: { titleEn: "Food Distribution", titleAr: "توزيع الطعام", descriptionEn: "Providing food to those in need.", descriptionAr: "توفير الطعام للمحتاجين.", projects: [] },
  education: { titleEn: "Education Initiatives", titleAr: "مبادرات التعليم", descriptionEn: "Empowering communities through education.", descriptionAr: "تمكين المجتمعات من خلال التعليم.", projects: [] },
  handpumps: { titleEn: "Handpump Installations", titleAr: "تركيب المضخات اليدوية", descriptionEn: "Ensuring access to clean water.", descriptionAr: "ضمان الوصول إلى المياه النظيفة.", projects: [] },
  wells: { titleEn: "Well Construction", titleAr: "بناء الآبار", descriptionEn: "Building sustainable water sources.", descriptionAr: "بناء مصادر مياه مستدامة.", projects: [] },
  mosques: { titleEn: "Mosque Projects", titleAr: "مشاريع المساجد", descriptionEn: "Supporting places of worship.", descriptionAr: "دعم أماكن العبادة.", projects: [] },
  general: { titleEn: "General Initiatives", titleAr: "مبادرات عامة", descriptionEn: "Diverse community projects.", descriptionAr: "مشاريع مجتمعية متنوعة.", projects: [] },
};

// Sample impact highlights
const impactHighlights = [
  { id: 1, titleEn: "1.5M+ Beneficiaries", titleAr: "أكثر من 1.5 مليون مستفيد", descriptionEn: "Our projects have impacted over 1.5 million lives across India.", descriptionAr: "أثرت مشاريعنا على أكثر من 1.5 مليون شخص في جميع أنحاء الهند.", icon: <FaStar /> },
  { id: 2, titleEn: "2,000+ Handpumps", titleAr: "أكثر من 2000 مضخة يدوية", descriptionEn: "Installed safe water sources for thousands of households.", descriptionAr: "تم تركيب مصادر مياه آمنة لآلاف الأسر.", icon: <FaStar /> },
  { id: 3, titleEn: "10,000+ Trees Planted", titleAr: "أكثر من 10000 شجرة مزروعة", descriptionEn: "Contributing to a greener future through reforestation.", descriptionAr: "نساهم في مستقبل أخضر من خلال إعادة التشجير.", icon: <FaStar /> },
];

export default function ProjectsPage() {
  const { projectData, isLoadingProjects, projectFetchError } = useAppContext();
  const isAr = usePathname().startsWith("/ar");
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("food");
  const [carouselIndices, setCarouselIndices] = useState({});
  const [imageIndices, setImageIndices] = useState({});
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [localProjectData, setLocalProjectData] = useState(defaultProjectData);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentPostsLoading, setRecentPostsLoading] = useState(true);
  const [recentPostsError, setRecentPostsError] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  useEffect(() => {
    // Sync localProjectData with context projectData
    const updatedData = { ...defaultProjectData, ...projectData };
    setLocalProjectData(updatedData);
    console.log("Updated localProjectData:", updatedData);
  }, [projectData]);

  useEffect(() => {
    // Initialize carousel and image indices
    const initialIndices = {};
    const initialImageIndices = {};
    Object.keys(localProjectData).forEach((category) => {
      initialIndices[category] = 0;
      initialImageIndices[category] = 0;
    });
    setCarouselIndices(initialIndices);
    setImageIndices(initialImageIndices);
    console.log("Initialized carouselIndices:", initialIndices, "imageIndices:", initialImageIndices);
  }, [localProjectData]);

  useEffect(() => {
    // Handle URL query params for pre-selecting a project
    const category = searchParams.get("category");
    const projectId = searchParams.get("id");
    if (category && projectId && localProjectData[category]) {
      const projectIndex = localProjectData[category].projects.findIndex((project) => project.id === projectId);
      if (projectIndex !== -1) {
        setActiveCategory(category);
        setCarouselIndices((prev) => ({ ...prev, [category]: projectIndex }));
        setImageIndices((prev) => ({ ...prev, [category]: 0 }));
        setIsAutoScrolling(false);
        console.log(`Pre-selected project: ID ${projectId}, Category ${category}, Index ${projectIndex}`);
      } else {
        console.warn(`Project ID ${projectId} not found in category ${category}`);
      }
    }
  }, [searchParams, localProjectData]);

  useEffect(() => {
    // Fetch recent posts
    const fetchRecentPosts = async () => {
      try {
        setRecentPostsLoading(true);
        const response = await fetch("/api/projects?recent=true");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched recent posts:", data);
        setRecentPosts(data);
        setRecentPostsError(null);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        setRecentPostsError(error.message);
        // Fallback to static recent posts
        setRecentPosts([
          { id: 1, titleEn: "New Water Project Launched", titleAr: "إطلاق مشروع مياه جديد", date: "2025-01-10", snippetEn: "We launched a new handpump project in rural Assam.", snippetAr: "أطلقنا مشروع مضخات يدوية جديد في ريف آسام.", image: "/tanki1.jpeg" },
          { id: 2, titleEn: "Education Drive Success", titleAr: "نجاح حملة التعليم", date: "2024-12-20", snippetEn: "Our scholarship program empowered 50 students.", snippetAr: "مكّن برنامج المنح الدراسية 50 طالبًا.", image: "/meed2.jpg" },
          { id: 3, titleEn: "Community Iftar Event", titleAr: "حدث إفطار المجتمع", date: "2024-03-25", snippetEn: "Hosted a community Iftar for 200 families.", snippetAr: "استضفنا إفطارًا مجتمعيًا لـ 200 عائلة.", image: "/meed1.jpg" },
        ]);
      } finally {
        setRecentPostsLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  useEffect(() => {
    if (!isAutoScrolling) return;
    const interval = setInterval(() => {
      setImageIndices((prev) => {
        const currentProject = localProjectData[activeCategory]?.projects[carouselIndices[activeCategory]];
        const totalImages = currentProject?.images?.length || 1;
        const nextImageIndex = (prev[activeCategory] || 0) + 1;

        if (nextImageIndex >= totalImages) {
          const totalProjects = localProjectData[activeCategory]?.projects.length || 1;
          const nextProjectIndex = (carouselIndices[activeCategory] + 1) % totalProjects;
          setCarouselIndices((prevCarousel) => ({
            ...prevCarousel,
            [activeCategory]: nextProjectIndex,
          }));
          console.log(`Switching to project index ${nextProjectIndex} in ${activeCategory}`);
          return { ...prev, [activeCategory]: 0 };
        }

        console.log(`Switching to image index ${nextImageIndex} in ${activeCategory}`);
        return { ...prev, [activeCategory]: nextImageIndex };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoScrolling, activeCategory, carouselIndices, localProjectData]);

  const handleDotClick = (category, imageIndex) => {
    setImageIndices((prev) => ({
      ...prev,
      [category]: imageIndex,
    }));
    setIsAutoScrolling(false);
    console.log(`Dot clicked: ${category}, image index ${imageIndex}`);
  };

  const handleNext = (category) => {
    setIsAutoScrolling(false);
    setImageIndices((prev) => {
      const currentProject = localProjectData[category]?.projects[carouselIndices[category]];
      const totalImages = currentProject?.images?.length || 1;
      const currentImageIndex = prev[category] || 0;
      const nextImageIndex = currentImageIndex + 1;

      if (nextImageIndex >= totalImages) {
        const totalProjects = localProjectData[category]?.projects.length || 1;
        const nextProjectIndex = (carouselIndices[category] + 1) % totalProjects;
        setCarouselIndices((prevCarousel) => ({
          ...prevCarousel,
          [category]: nextProjectIndex,
        }));
        console.log(`Next button: Switching to project index ${nextProjectIndex} in ${category}`);
        return { ...prev, [category]: 0 };
      }

      console.log(`Next button: Switching to image index ${nextImageIndex} in ${category}`);
      return { ...prev, [category]: nextImageIndex };
    });
  };

  const handlePrev = (category) => {
    setIsAutoScrolling(false);
    setImageIndices((prev) => {
      const currentImageIndex = prev[category] || 0;
      const prevImageIndex = currentImageIndex - 1;

      if (prevImageIndex < 0) {
        const totalProjects = localProjectData[category]?.projects.length || 1;
        const prevProjectIndex = (carouselIndices[category] - 1 + totalProjects) % totalProjects;
        const newProject = localProjectData[category]?.projects[prevProjectIndex];
        const newImageIndex = (newProject?.images?.length || 1) - 1;
        setCarouselIndices((prevCarousel) => ({
          ...prevCarousel,
          [category]: prevProjectIndex,
        }));
        console.log(`Prev button: Switching to project index ${prevProjectIndex} in ${category}`);
        return { ...prev, [category]: newImageIndex };
      }

      console.log(`Prev button: Switching to image index ${prevImageIndex} in ${category}`);
      return { ...prev, [category]: prevImageIndex };
    });
  };

  const handleRecentPostClick = (postId, category) => {
    if (!localProjectData[category]) {
      console.warn(`Category ${category} not found in localProjectData`);
      return;
    }
    const projectIndex = localProjectData[category].projects.findIndex((project) => project.id === postId);
    if (projectIndex === -1) {
      console.warn(`Project with ID ${postId} not found in category ${category}`);
      return;
    }
    setActiveCategory(category);
    setCarouselIndices((prev) => ({ ...prev, [category]: projectIndex }));
    setImageIndices((prev) => ({ ...prev, [category]: 0 }));
    setIsAutoScrolling(false);
    console.log(`Recent post clicked: ID ${postId}, Category ${category}, Project index ${projectIndex}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, x: isAr ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: isAr ? -50 : 50, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const highlightVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section ref={sectionRef} className="relative py-8 bg-gradient-to-br from-gray-50 via-white to-teal-50 min-h-screen overflow-hidden font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 ${isAr ? "font-arabic" : "font-sans"} tracking-tight`}>
          {isAr ? "مشاريعنا" : "Our Projects"}
        </h1>
        <p className="max-w-2xl mx-auto mt-3 text-base md:text-lg text-gray-600 leading-relaxed">
          {isAr
            ? "استكشف مجموعتنا المتنوعة من المشاريع التي تهدف إلى رفع مستوى المجتمعات من خلال التعليم، والمياه، والتنمية الاجتماعية."
            : "Explore our diverse range of projects aimed at uplifting communities through education, water access, and social development."}
        </p>
      </motion.div>

      {isLoadingProjects ? (
        <div className="text-center text-gray-600 text-lg">
          {isAr ? "جاري تحميل المشاريع..." : "Loading projects..."}
        </div>
      ) : projectFetchError ? (
        <div className="text-center text-red-600 text-lg">
          {isAr ? "فشل في تحميل المشاريع. يتم استخدام البيانات الافتراضية." : "Failed to load projects. Using fallback data."}
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 relative z-10">
        <div className="lg:w-3/4 space-y-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.keys(localProjectData).map((category) => (
              <motion.button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setCarouselIndices((prev) => ({ ...prev, [category]: 0 }));
                  setImageIndices((prev) => ({ ...prev, [category]: 0 }));
                  console.log(`Category switched to ${category}`);
                }}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 backdrop-blur-md border border-transparent ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md"
                    : "bg-white/70 text-gray-700 hover:bg-white/90 hover:border-teal-300"
                }`}
                whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0, 128, 128, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                {isAr ? localProjectData[category].titleAr : localProjectData[category].titleEn}
              </motion.button>
            ))}
          </div>

          {Object.keys(localProjectData).map(
            (category) =>
              activeCategory === category && (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100/50"
                >
                  <h2 className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 text-center ${isAr ? "font-arabic" : ""}`}>
                    {isAr ? localProjectData[category].titleAr : localProjectData[category].titleEn}
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center mt-2 mb-6">
                    {isAr ? localProjectData[category].descriptionAr : localProjectData[category].descriptionEn}
                  </p>
                  {localProjectData[category].projects.length === 0 ? (
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center">
                      {isAr ? "لا توجد مشاريع متاحة في هذه الفئة بعد." : "No projects available in this category yet."}
                    </p>
                  ) : (
                    <div
                      className="relative"
                      onMouseEnter={() => setIsAutoScrolling(false)}
                      onMouseLeave={() => setIsAutoScrolling(true)}
                    >
                      <motion.div
                        key={`${category}-${carouselIndices[category]}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row gap-6"
                      >
                        <div className="md:w-1/2">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`${category}-${carouselIndices[category]}-${imageIndices[category]}`}
                              variants={imageVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <Image
                                src={localProjectData[category].projects[carouselIndices[category]]?.images[imageIndices[category]] || "/placeholder.png"}
                                alt={
                                  isAr
                                    ? localProjectData[category].projects[carouselIndices[category]]?.titleAr || "Project image"
                                    : localProjectData[category].projects[carouselIndices[category]]?.titleEn || "Project image"
                                }
                                width={500}
                                height={300}
                                className="w-full h-64 md:h-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                              />
                            </motion.div>
                          </AnimatePresence>
                          <div className="flex justify-center gap-2 mt-4">
                            {localProjectData[category].projects[carouselIndices[category]]?.images?.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => handleDotClick(category, index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  imageIndices[category] === index ? "bg-teal-600" : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="md:w-1/2 flex flex-col justify-center">
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                            {isAr ? localProjectData[category].projects[carouselIndices[category]]?.titleAr : localProjectData[category].projects[carouselIndices[category]]?.titleEn}
                          </h3>
                          <p className="text-gray-600 text-sm md:text-base mt-2">
                            {isAr ? localProjectData[category].projects[carouselIndices[category]]?.snippetAr : localProjectData[category].projects[carouselIndices[category]]?.snippetEn}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <strong>{isAr ? "التاريخ" : "Date"}:</strong> {localProjectData[category].projects[carouselIndices[category]]?.date}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>{isAr ? "المكان" : "Venue"}:</strong> {localProjectData[category].projects[carouselIndices[category]]?.venue}
                          </p>
                          <Link
                            href={isAr ? "/ar/donate" : "/donate"}
                            className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all duration-300"
                          >
                            {isAr ? "دعم المشروع" : "Support Project"}
                          </Link>
                        </div>
                      </motion.div>
                      <motion.button
                        onClick={() => handlePrev(category)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-3 rounded-full shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaArrowLeft />
                      </motion.button>
                      <motion.button
                        onClick={() => handleNext(category)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-3 rounded-full shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaArrowRight />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100/50"
          >
            <h2 className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 text-center ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "إنجازاتنا المميزة" : "Our Impact Highlights"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {impactHighlights.map((highlight) => (
                <motion.div
                  key={highlight.id}
                  variants={highlightVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-gray-100/30 hover:bg-white/90 transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 128, 128, 0.15)" }}
                >
                  <div className="text-3xl text-teal-600 mb-4">{highlight.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 text-center">{isAr ? highlight.titleAr : highlight.titleEn}</h3>
                  <p className="text-gray-600 text-sm md:text-base mt-2 text-center">{isAr ? highlight.descriptionAr : highlight.descriptionEn}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:w-1/4">
          <motion.div
            initial={{ opacity: 0, x: isAr ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 sticky top-20 border border-gray-100/50"
          >
            <h2 className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 text-center ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "آخر الأخبار" : "Recent Posts"}
            </h2>
            {recentPostsLoading ? (
              <div className="text-center text-gray-600 text-base mt-4">
                {isAr ? "جاري تحميل الأخبار..." : "Loading recent posts..."}
              </div>
            ) : recentPostsError ? (
              <div className="text-center text-red-600 text-base mt-4">
                {isAr ? "فشل في تحميل الأخبار. يتم استخدام البيانات الافتراضية." : "Failed to load recent posts. Using fallback data."}
              </div>
            ) : (
              <div className="space-y-6 mt-6">
                {recentPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="flex flex-col gap-3 cursor-pointer"
                    onClick={() => handleRecentPostClick(post.id, post.category)}
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={post.images?.[0] || "/placeholder.png"}
                      alt={isAr ? post.titleAr : post.titleEn}
                      width={300}
                      height={150}
                      className="w-full h-36 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 text-center">{isAr ? post.titleAr : post.titleEn}</h3>
                    <p className="text-gray-600 text-sm text-center">{isAr ? post.snippetAr : post.snippetEn}</p>
                    <p className="text-xs text-gray-500 text-center">{post.date}</p>
                  </motion.div>
                ))}
              </div>
            )}
            <Link
              href={isAr ? "/ar/projects" : "/projects"}
              className="mt-6 block text-center px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all duration-300"
            >
              {isAr ? "عرض المزيد" : "View More"}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}