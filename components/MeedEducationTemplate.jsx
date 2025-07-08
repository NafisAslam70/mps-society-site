// ------------------------------
// components/MeedEducationTemplate.jsx
// ------------------------------
"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import MeedEducationSlider from "./ActivitiesSlider"; // Import the component

export default function MeedEducationTemplate() {
  const isAr = usePathname().startsWith("/ar");

  // Navigation items
  const navItems = isAr
    ? ["الرئيسية", "من نحن", "تعليم", "أنشطة", "اتصل بنا"]
    : ["Home", "About Us", "Education", "Activities", "Contact"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="bg-teal-800 text-white py-3 shadow-md shadow-teal-900/20">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-semibold"
          >
            {isAr ? "جمعية ميد" : "Meed Society"}
          </motion.div>
          <nav className="space-x-4">
            {navItems.map((item) => (
              <motion.a
                key={item}
                href={`/${isAr ? "ar/" : ""}${item.toLowerCase().replace(" ", "-")}`}
                className="hover:text-teal-200 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Meed Education Section */}
        <MeedEducationSlider />
      </main>

      {/* Footer */}
      <footer className="bg-teal-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs"
          >
            {isAr
              ? "© 2025 جمعية ميد العامة للمدارس. جميع الحقوق محفوظة."
              : "© 2025 Meed Public School Society. All rights reserved."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-1 space-x-3"
          >
            <a href="#" className="hover:text-teal-200 text-xs">Facebook</a>
            <a href="#" className="hover:text-teal-200 text-xs">Twitter</a>
            <a href="#" className="hover:text-teal-200 text-xs">Instagram</a>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}