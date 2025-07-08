"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function VisitorCarousel() {
  const isAr = usePathname().startsWith("/ar");

  const quotes = [
    {
      quoteEn: "Hope this centre will become a centre of excellence",
      quoteAr: "آمل أن يصبح هذا المركز مركزًا للتميز",
      nameEn: "Dr. Himanta Biswa Sarma",
      nameAr: "الدكتور سارما",
      titleEn: "Hon'ble Health Minister, Assam",
      titleAr: "وزير الصحة، آسام",
    },
    {
      quoteEn: "Beautiful work and ambitious projects of the NGO have impressed me.",
      quoteAr: "أعجبتني الأعمال والمشاريع الطموحة لهذه المنظمة.",
      nameEn: "Sri Nilomin Sen Deka",
      nameAr: "السيد ديكا",
      titleEn: "Minister of Agriculture, Assam",
      titleAr: "وزير الزراعة، آسام",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentQuote = quotes[currentIndex];

  // Automatic cycling with pause on hover
  useEffect(() => {
    let intervalId;
    const startInterval = () => {
      intervalId = setInterval(() => {
        if (!isPaused) {
          console.log("Switching to next quote:", (currentIndex + 1) % quotes.length); // Debug
          setCurrentIndex((prev) => (prev + 1) % quotes.length);
        }
      }, 5000); // 5-second interval
    };

    startInterval();

    return () => clearInterval(intervalId);
  }, [isPaused, quotes.length]);

  // Navigation handlers
  const goToPrevious = () => {
    console.log("Going to previous quote:", (currentIndex - 1 + quotes.length) % quotes.length); // Debug
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const goToNext = () => {
    console.log("Going to next quote:", (currentIndex + 1) % quotes.length); // Debug
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  // Fallback if quotes array is empty
  if (!quotes.length) {
    return (
      <section className="text-center space-y-6 px-4 py-12 bg-gray-50">
        <h2 className="text-2xl font-extrabold text-gray-800">
          {isAr ? "رسالة الزائر" : "Visitor's Message"}
        </h2>
        <p className="text-gray-600">No visitor messages available.</p>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          {isAr ? "رسالة الزائر" : "Visitor's Message"}
        </h2>

        {/* Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex"
            initial={false}
            animate={{ x: `calc(-${currentIndex * 100}% + ${(100 / quotes.length - 100) / 2}%)` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="min-w-[100%] flex-shrink-0 flex items-center justify-center px-4"
              >
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto text-center">
                  <blockquote className="text-lg italic text-gray-700 mb-4">
                    {isAr ? quote.quoteAr : quote.quoteEn}
                  </blockquote>
                  <div className="font-semibold text-green-700 text-xl mb-2">
                    {isAr ? quote.nameAr : quote.nameEn}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isAr ? quote.titleAr : quote.titleEn}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-3 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-3 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                console.log("Going to dot index:", i); // Debug
                setCurrentIndex(i);
              }}
              className={`w-3 h-3 rounded-full ${currentIndex === i ? "bg-green-600" : "bg-gray-300"} transition-colors`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}