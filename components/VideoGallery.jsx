"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

// Default image fallback
const DEFAULT_IMAGE = "/placeholder.png";

export default function VideoGallery() {
  const isAr = usePathname().startsWith("/ar");

  // Video data with fallback
  const videos = [
     { src: "https://www.youtube.com/embed/sVrWLkGXwu8?si=b-gSSPe_Hbd-B_0s" , title: isAr ? "فيديو 1" : "Video 1" },
    { src: "https://www.youtube.com/embed/J3dRmJOtr2Y?si=7r8iVTeFZmgyEEQ7", title: isAr ? "فيديو 2" : "Video 2" },
   
    { src: "https://www.youtube.com/embed/uuAg_l3RMqQ?si=hnoI_Vb9HeNi4x54", title: isAr ? "فيديو 3" : "Video 3" },
    { src: "https://www.youtube.com/embed/EhQuxiSmS_A?si=649ZhqnK4vhmeqmR", title: isAr ? "فيديو 4" : "Video 4" },
    { src: "https://www.youtube.com/embed/VIDEO_ID5", title: isAr ? "فيديو 5" : "Video 5" },
    { src: "https://www.youtube.com/embed/VIDEO_ID6", title: isAr ? "فيديو 6" : "Video 6" },
  ];
  const fallbackSrc = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Example fallback video

  // Typing effect state
  const [displayedTitle, setDisplayedTitle] = useState("");
  const titleText = isAr ? "معرض الفيديو" : "Video Gallery";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      console.log("Typing Index:", index, "Text Length:", titleText.length); // Debug
      if (index < titleText.length) {
        setDisplayedTitle((prev) => prev + titleText.charAt(index));
        index++;
      } else {
        setTimeout(() => {
          setDisplayedTitle("");
          index = 0;
          console.log("Reset Typing"); // Debug reset
        }, 1000); // Pause for 1 second before restarting
      }
    }, 100);

    return () => clearInterval(typingInterval); // Cleanup
  }, [titleText]);

  // State for video loading errors
  const [videoErrors, setVideoErrors] = useState(new Set());

  const handleIframeError = (url) => {
    console.error(`Video failed to load: ${url}`);
    setVideoErrors((prev) => new Set(prev).add(url));
  };

  // Ref for scroll detection
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" }); // Trigger when 50px from top

  // Moving particles
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 3 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 8 + 3}px`,
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

    const interval = setInterval(animateParticles, 150);
    return () => clearInterval(interval);
  }, []);

  // Swipe handlers for video navigation
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Navigate to next set of videos (e.g., paginate)
      // Note: This requires a state for current video page; for simplicity, we'll assume all videos are shown
    },
    onSwipedRight: () => {
      // Navigate to previous set of videos
    },
    trackMouse: true,
  });

  return (
    <section ref={sectionRef} className="relative py-16 bg-gradient-to-br from-green-50 to-white overflow-hidden">
      {/* Moving Particle Background */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-green-200/30"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Header with Static Title and Typing Effect */}
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`text-center text-4xl font-bold mb-8 ${isAr ? "font-amiri" : "font-pacifico"}`}
      >
        {displayedTitle || ""}
        <span className="inline-block w-2 h-6 bg-green-700 animate-blink ml-1"></span>
      </motion.h2>

      {/* Description about Meed Public School */}
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center text-lg text-gray-600 mb-12"
      >
        {isAr
          ? "في مدرسة ميد العامة، نقدم تعليمًا عالي الجودة غنيًا بالمناهج المتقدمة، مع تركيز على التميز الأكاديمي والنمو الشخصي. تتميز منشآتنا الحديثة وطاقم عملنا المكرس بتوفير بيئة داعمة للطلاب للازدهار، مع أنشطة خارج المنهج المتنوعة لتنمية أفراد متكاملين جاهزين للتحديات المستقبلية."
          : "At Meed Public School, we provide a high-quality education enriched with advanced curricula, fostering academic excellence and personal growth. Our state-of-the-art facilities and dedicated staff ensure a nurturing environment for students to thrive. We also offer diverse extracurricular activities to develop well-rounded individuals ready for future challenges."}
      </motion.p>

      {/* Video Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-12 relative"
        {...handlers} // Apply swipe handlers to the grid container
      >
        <div className="p-4 text-center">
          {/* <h2 className="text-3xl font-bold text-green-700 mb-2">
            {isAr ? "أحدث الفيديوهات" : "Videos"}
          </h2> */}
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {videos.map((video, idx) => (
              <motion.div
                key={video.src}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                className="relative w-full h-0 pb-[56.25%] rounded-lg shadow-md overflow-hidden"
              >
                {videoErrors.has(video.src) ? (
                  <iframe
                    src={fallbackSrc}
                    title={isAr ? "فيديو احتياطي" : "Fallback Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow"
                  />
                ) : (
                  <iframe
                    src={video.src}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow"
                    onError={() => handleIframeError(video.src)}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>


    </section>
  );
}