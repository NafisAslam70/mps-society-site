"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

// Default image fallback
const DEFAULT_IMAGE = "/placeholder.png";

export default function MeedEducationSlider() {
  const isAr = usePathname().startsWith("/ar");

  // Define slides with descriptions
  const slides = [
    {
      category: isAr ? "الأكاديميات" : "Academics",
      images: [
        { src: "/meed2.jpg", alt: isAr ? "أكاديميات 1" : "Academics 1" },
        { src: "/masjid1.jpeg", alt: isAr ? "أكاديميات 2" : "Academics 2" },
        { src: "/tanki1.jpeg", alt: isAr ? "أكاديميات 3" : "Academics 3" },
        { src: "/masjid2.jpeg", alt: isAr ? "أكاديميات 4" : "Academics 4" },
        { src: "/meed2.jpg", alt: isAr ? "أكاديميات 5" : "Academics 5" },
      ],
      description: isAr ? "مناهج دراسية متطورة" : "Advanced curricula",
    },
    {
      category: isAr ? "الرياضة" : "Sports",
      images: [
        { src: "/masjid1.jpeg", alt: isAr ? "رياضة 1" : "Sports 1" },
        { src: "/tanki1.jpeg", alt: isAr ? "رياضة 2" : "Sports 2" },
        { src: "/masjid2.jpeg", alt: isAr ? "رياضة 3" : "Sports 3" },
        { src: "/meed2.jpg", alt: isAr ? "رياضة 4" : "Sports 4" },
        { src: "/tanki1.jpeg", alt: isAr ? "رياضة 5" : "Sports 5" },
      ],
      description: isAr ? "تنمية اللياقة البدنية" : "Physical fitness development",
    },
    {
      category: isAr ? "السكن" : "Hostel",
      images: [
        { src: "/tanki1.jpeg", alt: isAr ? "سكن 1" : "Hostel 1" },
        { src: "/masjid2.jpeg", alt: isAr ? "سكن 2" : "Hostel 2" },
        { src: "/meed2.jpg", alt: isAr ? "سكن 3" : "Hostel 3" },
        { src: "/masjid1.jpeg", alt: isAr ? "سكن 4" : "Hostel 4" },
        { src: "/tanki1.jpeg", alt: isAr ? "سكن 5" : "Hostel 5" },
      ],
      description: isAr ? "إقامة مريحة للطلاب" : "Comfortable student accommodation",
    },
    {
      category: isAr ? "المسجد" : "Mosque",
      images: [
        { src: "/masjid2.jpeg", alt: isAr ? "مسجد 1" : "Mosque 1" },
        { src: "/meed2.jpg", alt: isAr ? "مسجد 2" : "Mosque 2" },
        { src: "/masjid1.jpeg", alt: isAr ? "مسجد 3" : "Mosque 3" },
        { src: "/tanki1.jpeg", alt: isAr ? "مسجد 4" : "Mosque 4" },
        { src: "/masjid2.jpeg", alt: isAr ? "مسجد 5" : "Mosque 5" },
      ],
      description: isAr ? "مركز روحاني" : "Spiritual center",
    },
    {
      category: isAr ? "التعليم الإسلامي" : "Islamic Education",
      images: [
        { src: "/meed2.jpg", alt: isAr ? "تعليم إسلامي 1" : "Islamic Education 1" },
        { src: "/masjid1.jpeg", alt: isAr ? "تعليم إسلامي 2" : "Islamic Education 2" },
        { src: "/tanki1.jpeg", alt: isAr ? "تعليم إسلامي 3" : "Islamic Education 3" },
        { src: "/masjid2.jpeg", alt: isAr ? "تعليم إسلامي 4" : "Islamic Education 4" },
        { src: "/meed2.jpg", alt: isAr ? "تعليم إسلامي 5" : "Islamic Education 5" },
      ],
      description: isAr ? "قيم إسلامية متكاملة" : "Integrated Islamic values",
    },
  ];

  const titleText = isAr ? "تعليم @ ميد" : "Education @ Meed";

  // Split and color text statically
  const renderColoredTitle = () => {
    const parts = isAr ? ["تعليم @ ", "ميد"] : ["Education @ ", "Meed"];
    return (
      <>
        <span className={isAr ? "font-amiri" : "font-pacifico"} style={{ color: "green" }}>
          {parts[0]}
        </span>
        <span className={isAr ? "font-amiri" : "font-pacifico"} style={{ color: "red" }}>
          {parts[1]}
        </span>
      </>
    );
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const imagesPerSlide = 4; // Number of images per slide in the grid

  // Calculate total slides based on images per slide
  const totalSlides = Math.ceil(slides[currentIndex].images.length / imagesPerSlide);

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  // Automatic category cycling with fade transition
  useEffect(() => {
    const categoryInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setCurrentSlideIndex(0); // Reset to first slide of new category
    }, 5000); // 5-second interval

    return () => clearInterval(categoryInterval);
  }, [slides.length]);

  // Optimized moving particles
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

  // Ref for scroll detection
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" }); // Trigger when 50px from top

  return (
    <section ref={sectionRef} className="relative py-16 bg-gradient-to-br from-green-50 to-white overflow-hidden">
      {/* Optimized Particle Background */}
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

      {/* Header with Static Title */}
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`text-center text-4xl font-bold mb-8 ${isAr ? "font-amiri" : "font-pacifico"}`}
      >
        {renderColoredTitle()}
      </motion.h2>

      {/* High-Class Subtitle and Thumbnails */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="max-w-2xl mx-auto px-4 text-center mb-12 bg-white p-6 rounded-lg shadow-md"
      >
        <p className="text-lg text-gray-600 mb-6">
          {isAr ? "تعليم راقٍ في مدرسة ميد العامة" : "High-Class Education at Meed Public School"}
        </p>
        <div className="flex justify-center gap-6">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.category}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: "easeOut" }}
              className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                currentIndex === index ? "ring-2 ring-green-500" : ""
              }`}
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setCurrentIndex(index);
                setCurrentSlideIndex(0);
              }}
            >
              <Image
                src={slide.images[0].src}
                alt={slide.images[0].alt}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                placeholder="blur"
                blurDataURL="/placeholder.png"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                  console.error(`Thumbnail image load failed for ${slide.images[0].src}`);
                }}
              />
              <div className="absolute inset-0 bg-green-800/20 flex items-center justify-center text-xs text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                {slide.category}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Focus Div with Category Title, Description, and Pictures */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="max-w-6xl mx-auto px-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-12 relative"
        >
          <div className="p-4 text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-2">{slides[currentIndex].category}</h2>
            <p className="text-gray-600">{slides[currentIndex].description}</p>
          </div>
          <div {...handlers} className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
              {slides[currentIndex].images
                .slice(currentSlideIndex * imagesPerSlide, (currentSlideIndex + 1) * imagesPerSlide)
                .map((image, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: 0.4 + idx * 0.1, ease: "easeOut" }}
                    className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = DEFAULT_IMAGE;
                        console.error(`Image load failed for ${image.src}`);
                      }}
                    />
                  </motion.div>
                ))}
            </div>
            {/* Navigation Dots */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full ${currentSlideIndex === idx ? "bg-green-700" : "bg-gray-300"}`}
                    onClick={() => setCurrentSlideIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Visit School Button */}
          <div className="p-4 text-center">
            <motion.a
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              href="https://www.mymeedpss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAr ? "زيارة مدرسة ميد العامة" : "Visit Meed Public School"}
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>

    </section>
  );
}