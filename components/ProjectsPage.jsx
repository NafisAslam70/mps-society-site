"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useAppContext } from "@/context/AppContext";

// Default project data structure
const defaultProjectData = {
  food: { titleEn: "Food Distribution", titleAr: "توزيع الطعام", descriptionEn: "Providing food to those in need.", descriptionAr: "توفير الطعام للمحتاجين.", projects: [] },
  ramadan: { titleEn: "Ramadan Distributions", titleAr: "توزيعات رمضان", descriptionEn: "Delivering Ramadan-specific aid and meals.", descriptionAr: "تقديم المساعدات والوجبات الخاصة برمضان.", projects: [] },
  waterTanks: { titleEn: "Water Tanks", titleAr: "خزانات المياه", descriptionEn: "Supplying clean water through storage solutions.", descriptionAr: "توفير المياه النظيفة عبر الخزانات.", projects: [] },
  handpump: { titleEn: "Handpump", titleAr: "مضخة يدوية", descriptionEn: "Single handpump initiatives.", descriptionAr: "مبادرات مضخة يدوية مفردة.", projects: [] },
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [detailProject, setDetailProject] = useState(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [showAllModal, setShowAllModal] = useState(false);
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
    if (typeof window !== "undefined") {
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
        const filled = ensureMinimumPosts(data, localProjectData, 4);
        setRecentPosts(filled);
        setRecentPostsError(null);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        setRecentPostsError(error.message);
        // Fallback to static recent posts
        setRecentPosts(ensureMinimumPosts([
          { id: 1, titleEn: "New Water Project Launched", titleAr: "إطلاق مشروع مياه جديد", date: "2025-01-10", snippetEn: "We launched a new handpump project in rural Assam.", snippetAr: "أطلقنا مشروع مضخات يدوية جديد في ريف آسام.", image: "/tanki1.jpeg" },
          { id: 2, titleEn: "Education Drive Success", titleAr: "نجاح حملة التعليم", date: "2024-12-20", snippetEn: "Our scholarship program empowered 50 students.", snippetAr: "مكّن برنامج المنح الدراسية 50 طالبًا.", image: "/meed2.jpg" },
          { id: 3, titleEn: "Community Iftar Event", titleAr: "حدث إفطار المجتمع", date: "2024-03-25", snippetEn: "Hosted a community Iftar for 200 families.", snippetAr: "استضفنا إفطارًا مجتمعيًا لـ 200 عائلة.", image: "/meed1.jpg" },
          { id: 4, titleEn: "Mosque Rehabilitation", titleAr: "تأهيل المسجد", date: "2024-06-05", snippetEn: "Repaired and repainted a village mosque for daily prayers.", snippetAr: "تم ترميم وإعادة طلاء مسجد القرية للصلاة اليومية.", image: "/masjid2.jpeg" },
        ], localProjectData, 4));
      } finally {
        setRecentPostsLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  // Helper to pad recent posts so the sidebar height matches main content
  const ensureMinimumPosts = (posts, projectDataSource, min = 4) => {
    const list = Array.isArray(posts) ? [...posts] : [];
    if (list.length >= min) return list;
    const extra = [];
    Object.entries(projectDataSource || {}).forEach(([category, data]) => {
      (data?.projects || []).forEach((p) => {
        if (extra.length + list.length >= min) return;
        extra.push({
          id: `${category}-${p.id || p.titleEn}`,
          category,
          titleEn: p.titleEn,
          titleAr: p.titleAr,
          date: p.date,
          snippetEn: p.snippetEn,
          snippetAr: p.snippetAr,
          images: p.images,
        });
      });
    });
    const filler = [
      {
        id: "filler-1",
        category: "general",
        titleEn: "Community Uplift",
        titleAr: "رفع المجتمع",
        date: "2024-01-15",
        snippetEn: "Ongoing support for families in need.",
        snippetAr: "دعم مستمر للأسر المحتاجة.",
        images: ["/meed1.jpg"],
      },
      {
        id: "filler-2",
        category: "general",
        titleEn: "Sadaqah Outreach",
        titleAr: "حملة صدقة",
        date: "2024-02-10",
        snippetEn: "Direct aid delivered to remote villages.",
        snippetAr: "تم إيصال المساعدات المباشرة إلى القرى النائية.",
        images: ["/meed2.jpg"],
      },
    ];
    const filled = list.concat(extra).concat(filler);
    return filled.slice(0, min);
  };

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

  const handleNext = (category, projectsOverride = null) => {
    setIsAutoScrolling(false);
    setImageIndices((prev) => {
      const sourceProjects = projectsOverride || localProjectData[category]?.projects || [];
      const currentProject = sourceProjects[carouselIndices[category]] || sourceProjects[0];
      const totalImages = currentProject?.images?.length || 1;
      const currentImageIndex = prev[category] || 0;
      const nextImageIndex = currentImageIndex + 1;

      if (nextImageIndex >= totalImages) {
        const totalProjects = sourceProjects.length || 1;
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

  const handleProjectNextOnly = (category, totalProjects) => {
    setIsAutoScrolling(false);
    setCarouselIndices((prev) => {
      const nextIndex = ((prev[category] || 0) + 1) % totalProjects;
      return { ...prev, [category]: nextIndex };
    });
    setImageIndices((prev) => ({ ...prev, [category]: 0 }));
  };

  const handleProjectPrevOnly = (category, totalProjects) => {
    setIsAutoScrolling(false);
    setCarouselIndices((prev) => {
      const prevIndex = (prev[category] - 1 + totalProjects) % totalProjects;
      return { ...prev, [category]: prevIndex };
    });
    setImageIndices((prev) => ({ ...prev, [category]: 0 }));
  };

  const handlePrev = (category, projectsOverride = null) => {
    setIsAutoScrolling(false);
    setImageIndices((prev) => {
      const sourceProjects = projectsOverride || localProjectData[category]?.projects || [];
      const currentImageIndex = prev[category] || 0;
      const prevImageIndex = currentImageIndex - 1;

      if (prevImageIndex < 0) {
        const totalProjects = sourceProjects.length || 1;
        const prevProjectIndex = (carouselIndices[category] - 1 + totalProjects) % totalProjects;
        const newProject = sourceProjects[prevProjectIndex];
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
        <h1 className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 ${isAr ? "font-arabic" : "font-sans"} tracking-tight drop-shadow-sm`}>
          {isAr ? "مشاريعنا" : "Our Projects"}
        </h1>
        <p className="max-w-2xl mx-auto mt-3 text-base md:text-lg text-gray-600 leading-relaxed">
          {isAr
            ? "استكشف مجموعتنا المتنوعة من المشاريع التي تهدف إلى رفع مستوى المجتمعات من خلال التعليم، والمياه، والتنمية الاجتماعية."
            : "Explore our diverse range of projects aimed at uplifting communities through education, water access, and social development."}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            isAr ? "صدقة جارية مضمونة الأثر" : "Sadaqah Jariyah Impact",
            isAr ? "صديقة للزكاة*" : "Zakat-friendly*",
            isAr ? "شفافية 100% في التتبع" : "100% Transparency",
          ].map((label) => (
            <span key={label} className="px-3 py-1 rounded-full text-xs md:text-sm bg-white/80 border border-emerald-200 text-emerald-800 shadow-sm">
              {label}
            </span>
          ))}
        </div>
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
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-100"
                    : "bg-white/80 text-gray-700 hover:bg-white/90 hover:border-emerald-200"
                }`}
                whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0, 128, 128, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                {isAr ? localProjectData[category].titleAr : localProjectData[category].titleEn}
              </motion.button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isAr ? "ابحث عن مشروع..." : "Search projects..."}
              className="flex-1 min-w-[220px] px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="newest">{isAr ? "الأحدث أولاً" : "Newest first"}</option>
              <option value="oldest">{isAr ? "الأقدم أولاً" : "Oldest first"}</option>
            </select>
          </div>

          {Object.keys(localProjectData).map(
            (category) => {
              if (activeCategory !== category) return null;

              const projects = (localProjectData[category]?.projects || [])
                .filter((p) => {
                  const text = `${p.titleEn} ${p.titleAr} ${p.snippetEn} ${p.snippetAr} ${p.venue}`.toLowerCase();
                  return text.includes(searchTerm.toLowerCase());
                })
                .sort((a, b) => {
                  const da = new Date(a.date);
                  const db = new Date(b.date);
                  return sortOrder === "newest" ? db - da : da - db;
                });

              const hasProjects = projects.length > 0;
              const currentProjectIndex = Math.min(carouselIndices[category] || 0, Math.max(projects.length - 1, 0));
              const currentImageIndex = Math.min(imageIndices[category] || 0, Math.max((projects[currentProjectIndex]?.images?.length || 1) - 1, 0));

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100/50"
                >
                  <div className="relative flex items-center justify-between">
                    <motion.button
                      onClick={() => handlePrev(category, projects)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-teal-600/50 text-white p-2 rounded-full shadow-md hover:bg-teal-600/70 transition-all duration-300 z-10"
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaArrowLeft />
                    </motion.button>
                    <h2 className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 text-center flex-1 ${isAr ? "font-arabic" : ""}`}>
                      {isAr ? localProjectData[category].titleAr : localProjectData[category].titleEn}
                    </h2>
                    <motion.button
                      onClick={() => handleNext(category, projects)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600/50 text-white p-2 rounded-full shadow-md hover:bg-teal-600/70 transition-all duration-300 z-10"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaArrowRight />
                    </motion.button>
                  </div>
                  <div className="flex justify-center gap-3 mt-2">
                    <button
                      onClick={() => handleProjectPrevOnly(category, projects.length)}
                      className="px-3 py-1 text-sm border border-emerald-500 text-emerald-700 rounded-full hover:bg-emerald-50 transition-all"
                      disabled={projects.length === 0}
                    >
                      {isAr ? "المشروع السابق" : "Prev Project"}
                    </button>
                    <button
                      onClick={() => handleProjectNextOnly(category, projects.length)}
                      className="px-3 py-1 text-sm border border-emerald-500 text-emerald-700 rounded-full hover:bg-emerald-50 transition-all"
                      disabled={projects.length === 0}
                    >
                      {isAr ? "المشروع التالي" : "Next Project"}
                    </button>
                  </div>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center mt-2 mb-6">
                    {isAr ? localProjectData[category].descriptionAr : localProjectData[category].descriptionEn}
                  </p>
                  {!hasProjects ? (
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center">
                      {searchTerm
                        ? isAr
                          ? "لا توجد نتائج مطابقة لبحثك في هذه الفئة."
                          : "No results match your search in this category."
                        : isAr
                          ? "لا توجد مشاريع متاحة في هذه الفئة بعد."
                          : "No projects available in this category yet."}
                    </p>
                  ) : (
                    <div
                      className="relative bg-white/90 rounded-2xl border border-emerald-50 shadow-[0_8px_30px_rgba(16,185,129,0.12)] p-4"
                      onMouseEnter={() => setIsAutoScrolling(false)}
                      onMouseLeave={() => setIsAutoScrolling(true)}
                    >
                      {/* Project-level nav arrows (different styling) */}
                      <button
                        onClick={() => handleProjectPrevOnly(category, projects.length)}
                        className="hidden md:flex absolute left-[-18px] top-1/2 -translate-y-1/2 text-emerald-700 border border-emerald-300/70 w-10 h-10 rounded-full bg-transparent hover:border-emerald-500 hover:text-emerald-800 transition-all backdrop-blur-sm"
                        aria-label={isAr ? "المشروع السابق" : "Previous project"}
                      >
                        <FiArrowLeft className="mx-auto text-lg" />
                      </button>
                      <button
                        onClick={() => handleProjectNextOnly(category, projects.length)}
                        className="hidden md:flex absolute right-[-18px] top-1/2 -translate-y-1/2 text-emerald-700 border border-emerald-300/70 w-10 h-10 rounded-full bg-transparent hover:border-emerald-500 hover:text-emerald-800 transition-all backdrop-blur-sm"
                        aria-label={isAr ? "المشروع التالي" : "Next project"}
                      >
                        <FiArrowRight className="mx-auto text-lg" />
                      </button>
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
                              key={`${category}-${currentProjectIndex}-${currentImageIndex}`}
                              variants={imageVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <Image
                                src={projects[currentProjectIndex]?.images[currentImageIndex] || "/placeholder.png"}
                                alt={
                                  isAr
                                    ? projects[currentProjectIndex]?.titleAr || "Project image"
                                    : projects[currentProjectIndex]?.titleEn || "Project image"
                                }
                                width={500}
                                height={300}
                                className="w-full h-64 md:h-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                              />
                            </motion.div>
                          </AnimatePresence>
                          <div className="flex justify-center gap-2 mt-4">
                            {projects[currentProjectIndex]?.images?.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => handleDotClick(category, index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  currentImageIndex === index ? "bg-teal-600" : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {/* mobile project nav buttons */}
                          <div className="mt-3 flex justify-between gap-2 md:hidden">
                            <button
                              onClick={() => handleProjectPrevOnly(category, projects.length)}
                              className="flex-1 px-3 py-2 text-xs md:text-sm bg-white/90 border border-emerald-100 text-emerald-700 rounded-lg shadow-sm hover:border-emerald-300 transition-all disabled:opacity-50"
                              disabled={projects.length === 0}
                            >
                              {isAr ? "المشروع السابق" : "Prev Project"}
                            </button>
                            <button
                              onClick={() => handleProjectNextOnly(category, projects.length)}
                              className="flex-1 px-3 py-2 text-xs md:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50"
                              disabled={projects.length === 0}
                            >
                              {isAr ? "المشروع التالي" : "Next Project"}
                            </button>
                          </div>
                        </div>
                        <div className="md:w-1/2 flex flex-col justify-center">
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                            {isAr ? projects[currentProjectIndex]?.titleAr : projects[currentProjectIndex]?.titleEn}
                          </h3>
                          <p className="text-gray-600 text-sm md:text-base mt-2">
                            {isAr ? projects[currentProjectIndex]?.snippetAr : projects[currentProjectIndex]?.snippetEn}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <strong>{isAr ? "التاريخ" : "Date"}:</strong> {projects[currentProjectIndex]?.date}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>{isAr ? "المكان" : "Venue"}:</strong> {projects[currentProjectIndex]?.venue}
                          </p>
                          <div className="flex justify-center mt-4 gap-3 flex-wrap">
                            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
                              {isAr ? "صدقة جارية" : "Sadaqah Jariyah"}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 rounded-full">
                              {isAr ? "مؤهل للزكاة*" : "Zakat-friendly*"}
                            </span>
                          </div>
                          <div className="flex justify-center mt-2 gap-3 flex-wrap">
                            <Link
                              href={isAr ? "/ar/donate" : "/donate"}
                              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 text-center"
                            >
                              {isAr ? "دعم المشروع" : "Support Project"}
                            </Link>
                            <button
                              onClick={() => {
                                setDetailProject(projects[currentProjectIndex]);
                                setDetailImageIndex(0);
                              }}
                              className="px-6 py-2 border border-emerald-600 text-emerald-700 rounded-full hover:bg-emerald-50 transition-all duration-300 text-center"
                            >
                              {isAr ? "عرض التفاصيل" : "View details"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            }
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-xl p-8 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {isAr ? "كن جزءًا من رسالتنا" : "Be a Part of the Mission"}
            </h2>
            <p className="text-lg md:text-xl text-emerald-50 max-w-3xl mx-auto mb-6">
              {isAr
                ? "سهم في الصدقة الجارية؛ كل تبرع يساعد في توفير الماء، الطعام، التعليم، وبناء المساجد للمجتمعات المحتاجة."
                : "Give Sadaqah Jariyah—your support funds water, food, education, and mosques for communities in need."}
            </p>
            <Link
              href={isAr ? "/ar/donate" : "/donate"}
              className="inline-block px-8 py-3 bg-white text-emerald-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-transform duration-200"
            >
              {isAr ? "تبرع الآن" : "Donate Now"}
            </Link>
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
            <button
              onClick={() => setShowAllModal(true)}
              className="mt-6 w-full text-center px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all duration-300"
            >
              {isAr ? "عرض المزيد" : "View More"}
            </button>
          </motion.div>
        </div>
      </div>

      {detailProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative">
            <button
              onClick={() => setDetailProject(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Image
                    src={detailProject.images?.[detailImageIndex] || "/placeholder.png"}
                    alt={isAr ? detailProject.titleAr : detailProject.titleEn}
                    width={600}
                    height={360}
                    className="w-full h-64 md:h-80 object-cover rounded-xl shadow-md"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <button
                      onClick={() =>
                        setDetailImageIndex((prev) =>
                          prev === 0 ? (detailProject.images?.length || 1) - 1 : prev - 1
                        )
                      }
                      className="m-2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                    >
                      <FaArrowLeft />
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      onClick={() =>
                        setDetailImageIndex((prev) =>
                          prev >= (detailProject.images?.length || 1) - 1 ? 0 : prev + 1
                        )
                      }
                      className="m-2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {detailProject.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDetailImageIndex(idx)}
                      className={`w-16 h-12 rounded-md overflow-hidden border ${detailImageIndex === idx ? "border-emerald-600" : "border-transparent"}`}
                    >
                      <Image src={img || "/placeholder.png"} alt={`thumb-${idx}`} width={80} height={60} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isAr ? detailProject.titleAr : detailProject.titleEn}
                </h3>
                <p className="text-gray-700 text-sm md:text-base">
                  {isAr ? detailProject.snippetAr : detailProject.snippetEn}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>{isAr ? "التاريخ" : "Date"}:</strong> {detailProject.date}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>{isAr ? "المكان" : "Venue"}:</strong> {detailProject.venue}
                </p>
                <div className="flex gap-3 mt-4">
                  <Link
                    href={isAr ? "/ar/donate" : "/donate"}
                    className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 text-center"
                  >
                    {isAr ? "دعم المشروع" : "Support Project"}
                  </Link>
                  <button
                    onClick={() => setDetailProject(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300"
                  >
                    {isAr ? "إغلاق" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAllModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowAllModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              {isAr ? "جميع المشاريع حسب الفئة" : "All Projects by Category"}
            </h3>
            <div className="space-y-6">
              {Object.entries(localProjectData).map(([cat, data]) => (
                <div key={cat} className="border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold text-emerald-700">
                      {isAr ? data.titleAr : data.titleEn}
                    </h4>
                    <span className="text-sm text-gray-500">{data.projects?.length || 0} {isAr ? "مشروع" : "projects"}</span>
                  </div>
                  {(!data.projects || data.projects.length === 0) ? (
                    <p className="text-gray-500 text-sm">{isAr ? "لا توجد مشاريع في هذه الفئة." : "No projects in this category."}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {data.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition cursor-pointer flex gap-3"
                          onClick={() => {
                            setActiveCategory(cat);
                            setCarouselIndices((prev) => ({ ...prev, [cat]: data.projects.findIndex((p) => p.id === proj.id) }));
                            setImageIndices((prev) => ({ ...prev, [cat]: 0 }));
                            setDetailProject(proj);
                            setDetailImageIndex(0);
                            setShowAllModal(false);
                          }}
                        >
                          <div className="w-20 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 border border-gray-200">
                            <Image
                              src={proj.images?.[0] || "/placeholder.png"}
                              alt={isAr ? proj.titleAr : proj.titleEn}
                              width={80}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">{proj.date}</p>
                            <h5 className="text-base font-semibold text-gray-900">
                              {isAr ? proj.titleAr : proj.titleEn}
                            </h5>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {isAr ? proj.snippetAr : proj.snippetEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
