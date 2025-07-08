"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function CallToAction() {
  const isAr = usePathname().startsWith("/ar");

  return (
    <section className="bg-gradient-to-r from-green-700 to-green-800 text-white py-16 px-6 overflow-hidden relative">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold tracking-tight"
        >
          {isAr ? "شارك معنا" : "Partner with Us"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-4 text-lg max-w-xl mx-auto text-gray-200"
        >
          {isAr
            ? "ساهم في توسيع أثر مشاريعنا الخيرية."
            : "Help us expand the impact of our humanitarian projects."}
        </motion.p>
        <motion.a
          href={isAr ? "/ar/contact" : "/contact"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }} // Light gray on hover
          className="inline-block mt-8 bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-colors duration-300"
        >
          {isAr ? "تواصل الآن" : "Contact Us"}
        </motion.a>
      </div>
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.1)]"></div>
    </section>
  );
}