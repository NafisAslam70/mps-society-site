"use client";
import { usePathname } from "next/navigation";
import { FaUsers, FaHandHoldingHeart, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

export default function GreenButtonsStrip() {
  const isAr = usePathname().startsWith("/ar");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const buttons = [
    { icon: <FaUsers />, en: "SCHOOL", ar: "المدرسة", href: "https://www.facebook.com/meed.pss", isExternal: true },
    { icon: <FaUsers />, en: "WHO WE ARE", ar: "من نحن", href: "/about" },
    { icon: <FaHandHoldingHeart />, en: "HELP US", ar: "ساعدنا", href: "/donate" },
    { icon: <FaUserPlus />, en: "OUR PROJECTS", ar: "مشاريعنا", href: "/projects" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const buttonVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: {
      scale: 1.08,
      boxShadow: "0px 10px 30px rgba(0, 128, 0, 0.4)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const dividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="w-screen px-4 py-16 bg-[#ffffff]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Animated Gradient Divider */}
      <motion.div
        className="h-1.5 bg-gradient-to-r from-green-500 to-green-800 rounded-full mb-10 max-w-7xl mx-auto animate-pulse-soft"
        variants={dividerVariants}
      ></motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto">
        {buttons.map((b, index) => (
          <motion.a
            key={b.en}
            href={b.isExternal ? b.href : isAr ? `/ar${b.href}` : b.href}
            className={`
              relative flex flex-col items-center justify-center 
              py-12 px-8 rounded-3xl shadow-xl 
              bg-gradient-to-br from-green-600/90 to-green-800/90 
              text-white overflow-hidden w-full
              backdrop-blur-md bg-opacity-80
              border border-green-300/20
              ${isAr ? "font-arabic" : "font-sans"}
            `}
            style={{ minWidth: "200px" }}
            variants={buttonVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            aria-label={isAr ? b.ar : b.en}
            target={b.isExternal ? "_blank" : undefined}
            rel={b.isExternal ? "noopener noreferrer" : undefined}
          >
            {/* Hover Background Ripple Effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-green-400/40 to-green-600/40 
                         opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ opacity: hoveredIndex === index ? 0.3 : 0 }}
            ></div>
            {/* Click Ripple Effect */}
            <div
              className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 
                         group-active:animate-ripple rounded-3xl"
            ></div>

            {/* Icon */}
            <motion.div
              className="text-5xl mb-5"
              animate={{ scale: hoveredIndex === index ? 1.2 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {b.icon}
            </motion.div>

            {/* Text */}
            <span className="text-xl font-semibold tracking-wide text-center">
              {isAr ? b.ar : b.en}
            </span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}