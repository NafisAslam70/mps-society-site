"use client";
import { useState, useEffect, useRef } from "react";
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

  // Split and color text
  const renderColoredTitle = () => {
    const parts = isAr ? ["تعليم @ ", "ميد"] : ["Education @ ", "Meed"];
    return (
      <>
        <span className={isAr ? "font-amiri" : "font-inter"}>{parts[0]}</span>
        <span className={isAr ? "font-amiri" : "font-inter"}>{parts[1]}</span>
      </>
    );
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const imagesPerSlide = 4;

  // Calculate total slides
  const totalSlides = Math.ceil(slides[currentIndex].images.length / imagesPerSlide);

  // Navigation
  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  // Automatic category cycling
  useEffect(() => {
    const categoryInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setCurrentSlideIndex(0);
    }, 5000);

    return () => clearInterval(categoryInterval);
  }, [slides.length]);

  // Particles
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

  // Scroll detection
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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

      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`text-center text-5xl font-bold mb-12 ${
          isAr ? "font-amiri" : "font-inter"
        } bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600`}
      >
        {renderColoredTitle()}
      </motion.h2>

      {/* Subtitle and Thumbnails */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6 text-center mb-16"
      >
        <p className={`text-xl text-gray-600 mb-8 ${isAr ? "font-amiri" : "font-inter"}`}>
          {isAr ? "تعليم راقٍ في مدرسة ميد العامة" : "High-Class Education at Meed Public School"}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: "easeOut" }}
              className={`relative w-24 h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                currentIndex === index ? "ring-4 ring-teal-500" : "ring-1 ring-gray-200"
              }`}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              onClick={() => {
                setCurrentIndex(index);
                setCurrentSlideIndex(0);
              }}
            >
              <Image
                src={slide.images[0].src}
                alt={slide.images[0].alt}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                placeholder="blur"
                blurDataURL="/placeholder.png"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                  console.error(`Thumbnail image load failed for ${slide.images[0].src}`);
                }}
              />
              <div className="absolute inset-0 bg-teal-900/40 flex items-center justify-center text-sm text-white font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
                {slide.category}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Focus Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-8 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl mb-16"
        >
          <div className="p-8 text-center">
            <h2 className={`text-4xl font-bold text-teal-700 mb-3 ${isAr ? "font-amiri" : "font-inter"}`}>
              {slides[currentIndex].category}
            </h2>
            <p className={`text-lg text-gray-600 ${isAr ? "font-amiri" : "font-inter"}`}>
              {slides[currentIndex].description}
            </p>
          </div>
          <div {...handlers} className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
              {slides[currentIndex].images
                .slice(currentSlideIndex * imagesPerSlide, (currentSlideIndex + 1) * imagesPerSlide)
                .map((image, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.1, ease: "easeOut" }}
                    className="relative w-full h-64 rounded-xl overflow-hidden shadow-md"
                    whileHover={{ scale: 1.03 }}
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
              <div className="flex justify-center gap-3 mt-6">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      currentSlideIndex === idx ? "bg-teal-600 scale-125" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentSlideIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Visit School Button */}
          <div className="p-8 text-center">
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              href="https://www.mymeedpss.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:from-teal-700 hover:to-blue-700 transition-all duration-300 ${
                isAr ? "font-amiri" : "font-inter"
              }`}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
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