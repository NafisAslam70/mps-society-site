// "use client";
// import { useState, useEffect, useRef } from "react";
// import { usePathname } from "next/navigation";
// import { motion, AnimatePresence, useInView } from "framer-motion";
// import { useSwipeable } from "react-swipeable";

// // Default video fallback
// const DEFAULT_VIDEO = "https://www.youtube.com/embed/dQw4w9WgXcQ";

// export default function VideoGallery() {
//   const isAr = usePathname().startsWith("/ar");

//   // Video data
//   const videos = [
//     { src: "https://www.youtube.com/embed/sVrWLkGXwu8?si=b-gSSPe_Hbd-B_0s", title: isAr ? "فيديو 1" : "Video 1" },
//     { src: "https://www.youtube.com/embed/J3dRmJOtr2Y?si=7r8iVTeFZmgyEEQ7", title: isAr ? "فيديو 2" : "Video 2" },
//     { src: "https://www.youtube.com/embed/uuAg_l3RMqQ?si=hnoI_Vb9HeNi4x54", title: isAr ? "فيديو 3" : "Video 3" },
//     { src: "https://www.youtube.com/embed/EhQuxiSmS_A?si=649ZhqnK4vhmeqmR", title: isAr ? "فيديو 4" : "Video 4" },
//     { src: "https://www.youtube.com/embed/VIDEO_ID5", title: isAr ? "فيديو 5" : "Video 5" },
//     { src: "https://www.youtube.com/embed/VIDEO_ID6", title: isAr ? "فيديو 6" : "Video 6" },
//   ];

//   // Typing effect state
//   const HEAD_EN_PREFIX = "VIDEO";
//   const HEAD_EN_WORD = "GALLERY";
//   const HEAD_AR = "معرض الفيديو";
//   const [typed, setTyped] = useState("");
//   useEffect(() => {
//     const WORD = isAr ? HEAD_AR : HEAD_EN_PREFIX;
//     let i = 0, dir = 1;
//     const id = setInterval(() => {
//       i += dir;
//       if (i === WORD.length + 6) dir = -1;
//       if (i === 0) dir = 1;
//       setTyped(WORD.slice(0, Math.min(Math.max(i, 0), WORD.length)));
//     }, 90);
//     return () => clearInterval(id);
//   }, [isAr]);

//   // State for video loading errors
//   const [videoErrors, setVideoErrors] = useState(new Set());

//   const handleIframeError = (url) => {
//     console.error(`Video failed to load: ${url}`);
//     setVideoErrors((prev) => new Set(prev).add(url));
//   };

//   // Ref for scroll detection
//   const sectionRef = useRef(null);
//   const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

//   // Moving particles
//   const [particles, setParticles] = useState([]);
//   useEffect(() => {
//     setParticles(
//       Array.from({ length: 5 }).map((_, i) => ({
//         id: i,
//         left: `${Math.random() * 100}%`,
//         top: `${Math.random() * 100}%`,
//         size: `${Math.random() * 6 + 2}px`,
//       }))
//     );

//     const animateParticles = () => {
//       setParticles((prevParticles) =>
//         prevParticles.map((particle) => ({
//           ...particle,
//           left: `${Math.max(0, Math.min(100, parseFloat(particle.left) + (Math.random() - 0.5)))}%`,
//           top: `${Math.max(0, Math.min(100, parseFloat(particle.top) + (Math.random() - 0.5)))}%`,
//         }))
//       );
//     };

//     const interval = setInterval(animateParticles, 100);
//     return () => clearInterval(interval);
//   }, []);

//   // Swipe handlers for video navigation
//   const handlers = useSwipeable({
//     onSwipedLeft: () => {},
//     onSwipedRight: () => {},
//     trackMouse: true,
//   });

//   return (
//     <section
//       ref={sectionRef}
//       className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
//     >
//       {/* Particle Background */}
//       {particles.map((particle) => (
//         <motion.div
//           key={particle.id}
//           className="absolute rounded-full bg-teal-300/20"
//           style={{
//             left: particle.left,
//             top: particle.top,
//             width: particle.size,
//             height: particle.size,
//           }}
//           animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
//           transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//         />
//       ))}

//       {/* Header with Typing Effect */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="relative z-10 text-center mb-12"
//       >
//         <div className="inline-block bg-white/90 backdrop-blur-md border border-gray-200 px-12 py-4 rounded-lg text-center shadow-2xl shadow-gray-800/80 transition-all duration-300 hover:shadow-gray-600/70">
//           {isAr ? (
//             <h2 className={`text-5xl font-bold text-black tracking-tight inline-block border-b-4 border-green-600 pb-2 ${isAr ? "font-amiri" : "font-inter"}`}>
//               {typed}
//             </h2>
//           ) : (
//             <h2 className={`text-5xl font-bold tracking-tight ${isAr ? "font-amiri" : "font-inter"}`}>
//               <span className="inline-block border-b-4 border-green-600 pb-2 text-black">{HEAD_EN_WORD}</span>{" "}
//               <span className="inline-block text-green-600">{typed}</span>
//             </h2>
//           )}
//         </div>
//       </motion.div>

//       {/* Description */}
//       <motion.p
//         initial={{ opacity: 0, y: 30 }}
//         animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
//         transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
//         className={`max-w-4xl mx-auto text-justify text-lg text-gray-600 mb-16 ${isAr ? "font-amiri" : "font-inter"}`}
//       >
//         {isAr
//           ? "مدرسة ميد العامة تقدم تعليمًا عالي الجودة مع مناهج متقدمة، تركز على التميز الأكاديمي والنمو الشخصي، وتوفر بيئة داعمة للطلاب."
//           : "Meed Public School offers high-quality education with advanced curricula, fostering academic excellence and personal growth in a supportive environment."}
//       </motion.p>

//       {/* Video Grid */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
//         transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
//         className="max-w-7xl mx-auto px-8 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl mb-16"
//         {...handlers}
//       >
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
//           {videos.map((video, idx) => (
//             <motion.div
//               key={video.src}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
//               transition={{ duration: 0.4, delay: 0.4 + idx * 0.1, ease: "easeOut" }}
//               className="relative w-full h-0 pb-[56.25%] rounded-xl overflow-hidden shadow-md"
//               whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
//             >
//               <iframe
//                 src={videoErrors.has(video.src) ? DEFAULT_VIDEO : video.src}
//                 title={videoErrors.has(video.src) ? (isAr ? "فيديو احتياطي" : "Fallback Video") : video.title}
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 className="absolute top-0 left-0 w-full h-full rounded-xl"
//                 onError={() => handleIframeError(video.src)}
//               />
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </section>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useAppContext } from "@/context/AppContext";

// Default video fallback
const DEFAULT_VIDEO = "https://www.youtube.com/embed/dQw4w9WgXcQ";

export default function VideoGallery() {
  const { websiteData, isLoadingWebsiteData } = useAppContext();
  const isAr = usePathname().startsWith("/ar");

  // Video data
  const defaultVideos = [
    { src: "https://www.youtube.com/embed/sVrWLkGXwu8?si=b-gSSPe_Hbd-B_0s", title: isAr ? "فيديو 1" : "Video 1" },
    { src: "https://www.youtube.com/embed/J3dRmJOtr2Y?si=7r8iVTeFZmgyEEQ7", title: isAr ? "فيديو 2" : "Video 2" },
    { src: "https://www.youtube.com/embed/uuAg_l3RMqQ?si=hnoI_Vb9HeNi4x54", title: isAr ? "فيديو 3" : "Video 3" },
    { src: "https://www.youtube.com/embed/EhQuxiSmS_A?si=649ZhqnK4vhmeqmR", title: isAr ? "فيديو 4" : "Video 4" },
  ];

  // Typing effect state
  const HEAD_EN_PREFIX = "VIDEO";
  const HEAD_EN_WORD = "GALLERY";
  const HEAD_AR = "معرض الفيديو";
  const [typed, setTyped] = useState("");
  const [videos, setVideos] = useState(defaultVideos);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && !isLoadingWebsiteData) {
      const dbVideos = websiteData.mainPage?.video?.videos || [];
      const updatedVideos = dbVideos.map((src, index) => ({
        src: src,
        title: `${isAr ? "فيديو" : "Video"} ${index + 1}`,
      })).length > 0
        ? dbVideos.map((src, index) => ({
            src: src,
            title: `${isAr ? "فيديو" : "Video"} ${index + 1}`,
          }))
        : defaultVideos;
      setVideos(updatedVideos);
      setIsInitialLoad(false);
    }
    const WORD = isAr ? HEAD_AR : HEAD_EN_PREFIX;
    let i = 0, dir = 1;
    const id = setInterval(() => {
      i += dir;
      if (i === WORD.length + 6) dir = -1;
      if (i === 0) dir = 1;
      setTyped(WORD.slice(0, Math.min(Math.max(i, 0), WORD.length)));
    }, 90);
    return () => clearInterval(id);
  }, [isInitialLoad, isLoadingWebsiteData, websiteData.mainPage?.video?.videos, isAr]);

  // State for video loading errors
  const [videoErrors, setVideoErrors] = useState(new Set());

  const handleIframeError = (url) => {
    console.error(`Video failed to load: ${url}`);
    setVideoErrors((prev) => new Set(prev).add(url));
  };

  // Ref for scroll detection
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Moving particles
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 6 + 2}px`,
      }))
    );

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          left: `${Math.max(0, Math.min(100, parseFloat(particle.left) + (Math.random() - 0.5)))}%`,
          top: `${Math.max(0, Math.min(100, parseFloat(particle.top) + (Math.random() - 0.5)))}%`,
        }))
      );
    };

    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, []);

  // Swipe handlers for video navigation (currently disabled)
  const handlers = useSwipeable({
    onSwipedLeft: () => {},
    onSwipedRight: () => {},
    trackMouse: true,
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
    >
      {/* Particle Background */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-teal-300/20"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Header with Typing Effect */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 text-center mb-12"
      >
        <div className="inline-block bg-white/90 backdrop-blur-md border border-gray-200 px-12 py-4 rounded-lg text-center shadow-2xl shadow-gray-800/80 transition-all duration-300 hover:shadow-gray-600/70">
          {isAr ? (
            <h2 className={`text-5xl font-bold text-black tracking-tight inline-block border-b-4 border-green-600 pb-2 ${isAr ? "font-amiri" : "font-inter"}`}>
              {typed}
            </h2>
          ) : (
            <h2 className={`text-5xl font-bold tracking-tight ${isAr ? "font-amiri" : "font-inter"}`}>
              <span className="inline-block border-b-4 border-green-600 pb-2 text-black">{HEAD_EN_WORD}</span>{" "}
              <span className="inline-block text-green-600">{typed}</span>
            </h2>
          )}
        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className={`max-w-4xl mx-auto text-justify text-lg text-gray-600 mb-16 ${isAr ? "font-amiri" : "font-inter"}`}
      >
        {isAr
          ? "مدرسة ميد العامة تقدم تعليمًا عالي الجودة مع مناهج متقدمة، تركز على التميز الأكاديمي والنمو الشخصي، وتوفر بيئة داعمة للطلاب."
          : "Meed Public School offers high-quality education with advanced curricula, fostering academic excellence and personal growth in a supportive environment."}
      </motion.p>

      {/* Video Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-8 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl mb-16"
        {...handlers}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {videos.map((video, idx) => (
            <motion.div
              key={video.src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.4 + idx * 0.1, ease: "easeOut" }}
              className="relative w-full h-0 pb-[56.25%] rounded-xl overflow-hidden shadow-md"
              whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
              <iframe
                src={videoErrors.has(video.src) ? DEFAULT_VIDEO : video.src}
                title={videoErrors.has(video.src) ? (isAr ? "فيديو احتياطي" : "Fallback Video") : video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                onError={() => handleIframeError(video.src)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}