"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Row component for banking tables (unchanged)
function Row({ a, b }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-teal-100 transition-colors">
      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{a}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{b}</td>
    </tr>
  );
}

// TypingText component (unchanged)
const TypingText = ({ text, className, isActive }) => {
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (isActive && charIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else if (!isActive && charIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isActive, charIndex, text]);

  useEffect(() => {
    if (isActive && charIndex === text.length) {
      const resetTimeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayText("");
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [isActive, charIndex, text]);

  return <span className={className}>{displayText}</span>;
};

// TypingCycleText component (unchanged)
const TypingCycleText = ({ text, className }) => {
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (isTyping && charIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else if (!isTyping && charIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, charIndex, text]);

  useEffect(() => {
    if (isTyping && charIndex === text.length) {
      const holdTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(holdTimeout);
    } else if (!isTyping && charIndex === 0) {
      const resetTimeout = setTimeout(() => {
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(resetTimeout);
    }
  }, [isTyping, charIndex, text]);

  return <span className={className}>{displayText || "\u00A0"}</span>;
};

export default function DonatePage() {
  const isAr = usePathname().startsWith("/ar");
  const [showDonating, setShowDonating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowDonating((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Content translations (unchanged)
  const t = {
    quoteHead: isAr ? "لا يفقر أحد" : "NO ONE HAS EVER BECOME POOR",
    quoteDonate: isAr ? "بالتبرع" : "BY DONATING",
    quoteGive: isAr ? "بالعطاء" : "BY GIVING",
    quoteTail: isAr ? "" : "",
    donateNow: isAr ? "تبرع لميد الآن" : "DONATE TO MEED NOW",
    quickPay: isAr ? "دفع فوري" : "QUICK PAY",
    qrCaption: isAr
      ? "امسح الكود للتبرع مباشرة"
      : "SCAN TO DONATE DIRECTLY",
    pleaseHdr: isAr ? "ادعمنا يا أصدقاء" : "SUPPORT US",
    para1: isAr
      ? "جمعية ميد العامة للمدارس تعمل على تعزيز التعليم والمياه والتنمية المجتمعية..."
      : "Meed Public School Society is dedicated to enhancing education, water access, and community development...",
    foreign: isAr ? "لتبرعات الأجنبية" : "FOR FOREIGN DONATIONS",
    indian: isAr ? "لتبرعات داخل الهند" : "FOR INDIAN DONATIONS",
    nb: isAr
      ? "ملاحظة: يرجى ذكر الاسم ورقم PAN للمتبرعين داخل الهند..."
      : "Note: Indian donors are requested to provide their name and PAN number for tax benefits...",
    supportUsNow: isAr ? "ادعمنا الآن" : "Support Us Now",
    scanToDonate: isAr ? "امسح للتبرع" : "Scan to Donate",
    forAbroadPayment: isAr
      ? "لتبرعات من الخارج، انتقل للأسفل..."
      : "For abroad payment scroll down...",
    donationDetails: isAr ? "تفاصيل التبرع" : "Donation Details",
    presidentMessage: isAr
      ? "أدعوكم باسم جمعية ميد العامة للمدارس لدعم مهمتنا في تمكين المجتمعات من خلال التعليم والمياه النظيفة. تبرعاتكم ستمكننا من بناء المدارس، وحفر الآبار، وتعزيز التنمية المستدامة. كل مساهمة، مهما كانت صغيرة، تحدث فرقًا كبيرًا. انضموا إلينا لخلق مستقبل أفضل للأجيال القادمة. معًا، يمكننا تحقيق تغيير دائم. شكرًا على دعمكم السخي!"
      : "On behalf of Meed Public School Society, I invite you to support our mission to empower communities through education and clean water. Your donations will help us build schools, dig wells, and foster sustainable development. Every contribution, no matter how small, makes a significant impact. Join us in creating a brighter future for generations to come. Together, we can achieve lasting change. Thank you for your generous support!"
  };

  // Banking data (unchanged)
  const rowsForeign = isAr
    ? [
        ["اسم الحساب", "MS MEED PUBLIC SCHOOL SOCIETY"],
        ["رقم الحساب", "40013329865 (حساب FCRA جاري)"],
        ["اسم البنك", "بنك الدولة الهندي"],
        ["اسم الفرع", "الفرع الرئيسي في نيودلهي"],
        ["عنوان الفرع", "خلية FCRA، الطابق الرابع، بنك الدولة الهندي، 11، سانساد مارغ، نيودلهي-110001"],
        ["تاريخ فتح الحساب", "18/02/2022"],
        ["كود الفرع", "00861"],
        ["كود IFSC", "SBBIN000861"],
        ["كود SWIFT", "SBBINNBB104"],
      ]
    : [
        ["ACCOUNT NAME", "MS MEED PUBLIC SCHOOL SOCIETY"],
        ["A/C NUMBER", "40013329865 (FCRA CURRENT ACCOUNT)"],
        ["BANK NAME", "STATE BANK OF INDIA"],
        ["BRANCH NAME", "NEW DELHI MAIN BRANCH"],
        ["BRANCH ADDRESS", "FCRA Cell, 4th Floor, State Bank of India, 11, Sansad Marg, New Delhi-110001"],
        ["ACCOUNT OPEN DATE", "18/02/2022"],
        ["BRANCH CODE", "00861"],
        ["IFSC CODE", "SBBIN000861"],
        ["SWIFT CODE", "SBBINNBB104"],
      ];

  const rowsIndian = isAr
    ? [
        ["اسم الحساب", "جمعية ميد العامة للمدارس"],
        ["رقم الحساب", "30871264549"],
        ["اسم البنك", "بنك الدولة الهندي"],
        ["الفرع", "برهاروا"],
        ["العنوان", "صاحبجانج، جهارخاند – 816101"],
        ["كود IFSC", "SBIN0002915"],
        ["كود MICR", "816002602"],
      ]
    : [
        ["ACCOUNT NAME", "Meed Public School Society"],
        ["A/C NUMBER", "30871264549"],
        ["BANK NAME", "State Bank of India"],
        ["BRANCH", "Barharwa"],
        ["ADDRESS", "Sahibganj, Jharkhand – 816101"],
        ["IFSC CODE", "SBIN0002915"],
        ["MICR CODE", "816002602"],
      ];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="bg-gradient-to-b from-teal-50 to-teal-100 min-h-screen font-serif text-gray-900">
      {/* Hero Section (unchanged) */}
      <section className="relative overflow-hidden" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 95%, 0 85%)" }}>
        <div className="absolute inset-0 z-0">
          <img src="/masjid1.jpeg" alt={isAr ? "صورة خلفية" : "Hero Background"} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900 to-black opacity-80"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
              <span>{t.quoteHead}</span>
              <span className="inline-block">
                {showDonating ? (
                  <TypingText
                    text={t.quoteDonate}
                    className="text-red-600 text-lg sm:text-xl md:text-2xl"
                    isActive={showDonating}
                  />
                ) : (
                  <TypingText
                    text={t.quoteGive}
                    className="text-red-600 text-lg sm:text-xl md:text-2xl"
                    isActive={!showDonating}
                  />
                )}
              </span>
              <span>{t.quoteTail}</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-4 text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed"
            >
              {t.para1}
            </motion.p>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-6 flex flex-col sm:flex-row items-center justify-center w-full max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-3"
            >
              <span className="text-base sm:text-lg md:text-xl text-white">{t.supportUsNow}</span>
              <Link href="#donate" className="bg-amber-600 text-white px-5 py-2 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-amber-700 transition-colors whitespace-nowrap">
                {t.quickPay}
              </Link>
            </motion.div>
            <motion.div
              className="absolute w-64 h-64 bg-black-200/30 rounded-full opacity-20 blur-3xl top-12 left-6"
              animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-48 h-48 bg-teal-100/30 rounded-full opacity-20 blur-3xl bottom-12 right-6"
              animate={{ y: [0, 30, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Combined Mission and QR + CTA Section: Adjusted for QR visibility */}
      <section className="relative overflow-visible" style={{ clipPath: "polygon(0 15%, 100% 5%, 100% 90%, 50% 100%, 0 90%)" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white-200 to-teal-130 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <div className="w-full sm:w-1/3 text-center p-2">
              <img
                src="/qr.png"
                alt={isAr ? "رمز التبرع" : "QR Code for Donation"}
                className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-lg shadow-md border-2 border-teal-700 object-contain"
              />
              <p className="mt-1 text-sm sm:text-base text-gray-600">{t.scanToDonate}</p>
            </div>
            <div className="w-full sm:w-1/3 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-800 mb-1 sm:mb-2">
                {t.donateNow}
              </h2>
              <div className="relative min-h-[1.5rem]">
                <TypingCycleText
                  text={t.forAbroadPayment}
                  className="text-xs sm:text-sm md:text-base text-gray-500 inline-block"
                />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 border-b-2 border-gray-500 w-12 sm:w-16 animate-pulse"></span>
              </div>
            </div>
            <div className="w-full sm:w-1/3 text-center">
              <Link
                href="#banking"
                className="bg-amber-600 text-white px-5 py-2 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-amber-700 transition-colors whitespace-nowrap min-w-[100px] sm:min-w-[120px] inline-block"
                aria-label="Quick Pay Donation Link"
              >
                {t.quickPay}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wave before Support Us (unchanged) */}
      <div className="bg-teal-80" style={{ clipPath: "polygon(0 0, 100% 10%, 100% 90%, 50% 100%, 0 90%)", height: "30px" }}></div>

      {/* Support Us Section: Centered title and content, justified text */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/masjid2.jpeg"
              alt={isAr ? "صورة الدعم" : "Support Image"}
              className="w-full max-w-[280px] sm:max-w-[400px] h-56 sm:h-64 object-cover rounded-lg shadow-md"
            />
            <div className="w-full text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-800 mb-4 border-b-4 border-teal-700 pb-1">
                {t.pleaseHdr}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify max-w-3xl mx-auto">
                {t.presidentMessage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Details Section (unchanged) */}
      <section id="banking" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold text-teal-800 mb-8 sm:mb-10 border-b-4 border-teal-700 pb-1 text-center"
          >
            {t.donationDetails}
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-2 border-teal-700 rounded-lg p-4 sm:p-6 bg-teal-50 shadow-lg"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-teal-800 mb-3 sm:mb-4">{t.foreign}</h3>
              <table className="w-full border border-teal-700 rounded-lg overflow-hidden">
                <tbody>
                  {rowsForeign.map(r => <Row key={r[0]} a={r[0]} b={r[1]} />)}
                </tbody>
              </table>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="border-2 border-teal-700 rounded-lg p-4 sm:p-6 bg-teal-50 shadow-lg"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-teal-800 mb-3 sm:mb-4">{t.indian}</h3>
              <table className="w-full border border-teal-700 rounded-lg overflow-hidden">
                <tbody>
                  {rowsIndian.map(r => <Row key={r[0]} a={r[0]} b={r[1]} />)}
                </tbody>
              </table>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 sm:mt-8 text-sm sm:text-base text-gray-600 text-center"
          >
            {t.nb}
          </motion.p>
        </div>
      </section>
    </div>
  );
}