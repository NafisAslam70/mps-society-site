// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion } from "framer-motion";

// export default function AboutStrip() {
//   const pathname = usePathname();
//   const isAr = pathname?.startsWith("/ar");
//   const href = isAr ? "/ar/about" : "/about";

//   const heading = isAr ? "من نحن" : "ABOUT US";
//   const body = isAr
//     ? "تسعى <strong>جمعية ميد العامة للمدارس</strong> لدعم الشرائح المتأخرة اقتصاديًا وتعليميًا في الهند منذ تأسيسها. أطلقت مبادرات في <strong>توفير المياه النظيفة</strong>، <strong>التعليم الشامل</strong>، و<strong>تنمية المجتمع</strong>، بالإضافة إلى برامج لتمكين الشباب من خلال التدريب المهني. حصلت الجمعية على تقدير واسع لجهودها في تعزيز التغيير الإيجابي والنمو المستدام، حيث نفذت أكثر من 5000 مشروع لخدمة أكثر من 150,000 مستفيد."
//     : "<strong>Meed Public School Society</strong> is dedicated to supporting economically and educationally disadvantaged communities in India since its inception. It has initiated programs in <strong>clean water provision</strong>, <strong>inclusive education</strong>, and <strong>community development</strong>, alongside youth empowerment through vocational training. The society has earned widespread recognition for its efforts in promoting positive change and sustainable growth, completing over 5000 projects to benefit more than 150,000 individuals.";
//   const legal = isAr
//     ? "📜 مسجلة بموجب قانون تسجيل الجمعيات لعام 1860 (رقم 646/2007-2008) ومعتمدة بموجب FCRA"
//     : "📜 Registered under Societies Registration Act XXI of 1860 (No. 646/2007-08) • FCRA approved";
//   const cta = isAr ? "اعرف المزيد" : "Know More";

//   // Typing animation variants for the heading (runs once)
//   const headingVariants = {
//     hidden: { width: 0, opacity: 0 },
//     visible: {
//       width: "auto",
//       opacity: 1,
//       transition: {
//         duration: 1.5,
//         ease: "easeInOut",
//         staggerChildren: 0.1,
//       },
//     },
//   };
//   const letterVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 },
//   };

//   // Split heading into "ABOUT" and "US" for separate coloring
//   const [aboutPart, usPart] = isAr ? ["من ", "نحن"] : ["ABOUT ", "US"];

//   return (
//     <section className="relative bg-gradient-to-b from-[#f0ede4] to-[#e7e5de] py-10">
//       <svg className="absolute -top-10 w-full h-24 -translate-y-1/2 z-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
//         <path d="M0,0 C400,60 1000,60 1440,0 L1440,120 L0,120 Z" fill="url(#waveGradient)" />
//         <defs>
//           <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" style={{ stopColor: "#f0ede4", stopOpacity: 1 }} />
//             <stop offset="100%" style={{ stopColor: "#e7e5de", stopOpacity: 1 }} />
//           </linearGradient>
//         </defs>
//       </svg>

//       <div className="mx-auto max-w-7xl -top-5 flex flex-col lg:flex-row gap-8 px-6" dir={isAr ? "rtl" : "ltr"}>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="lg:basis-1/2 relative lg:order-2"
//         >
//           <figure className="border-4 border-white rounded-xl overflow-hidden shadow-lg">
//             <img
//               src="/meed2.jpg"
//               alt="Society building"
//               className="w-full h-[400px] object-cover"
//             />
//           </figure>
//           <div className="absolute -top-10 left-0 translate-x-[20%] z-10">
//             <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-lg shadow-md">
//               <motion.h2
//                 className="text-3xl font-extrabold overflow-hidden"
//                 variants={headingVariants}
//                 initial="hidden"
//                 animate="visible"
//               >
//                 <motion.span className="text-teal-600" variants={letterVariants}>
//                   {aboutPart.split("").map((char, index) => (
//                     <motion.span key={index}>{char}</motion.span>
//                   ))}
//                 </motion.span>
//                 <motion.span className="text-white-700" variants={letterVariants}>
//                   {usPart.split("").map((char, index) => (
//                     <motion.span key={index}>{char}</motion.span>
//                   ))}
//                 </motion.span>
//               </motion.h2>
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: isAr ? 50 : -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//           className={`lg:basis-1/2 px-6 py-8 flex flex-col items-center justify-center ${
//             isAr ? "text-right font-arabic" : "text-left"
//           } lg:order-1`}
//         >
//           <div className="flex flex-col items-center w-full text-center">
//             <p
//               className="text-lg text-gray-700 text-justify leading-relaxed w-full max-w-prose"
//               style={{ lineHeight: "1.6" }}
//               dangerouslySetInnerHTML={{ __html: body }}
//             />
//             <div className="mt-4">
//               <Link
//                 href={href}
//                 className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-colors duration-200"
//               >
//                 {cta}
//               </Link>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.4 }}
//         className="mt-8"
//       >
//         <div className="mx-auto max-w-none">
//           <div className="bg-gradient-to-r mb-15 mt-15 from-[#1270a3] to-[#0f6b9c] text-white text-center shadow-inner py-5 px-6 text-sm font-medium">
//             {legal}
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

export default function AboutStrip() {
  const pathname = usePathname();
  const isAr = pathname?.startsWith("/ar");
  const href = isAr ? "/ar/about" : "/about";
  const { websiteData, isLoadingWebsiteData } = useAppContext();

  const heading = isAr ? "من نحن" : "ABOUT US";
  const body = isAr
    ? "تسعى <strong>جمعية ميد العامة للمدارس</strong> لدعم الشرائح المتأخرة اقتصاديًا وتعليميًا في الهند منذ تأسيسها. أطلقت مبادرات في <strong>توفير المياه النظيفة</strong>، <strong>التعليم الشامل</strong>، و<strong>تنمية المجتمع</strong>، بالإضافة إلى برامج لتمكين الشباب من خلال التدريب المهني. حصلت الجمعية على تقدير واسع لجهودها في تعزيز التغيير الإيجابي والنمو المستدام، حيث نفذت أكثر من 5000 مشروع لخدمة أكثر من 150,000 مستفيد."
    : "<strong>Meed Public School Society</strong> is dedicated to supporting economically and educationally disadvantaged communities in India since its inception. It has initiated programs in <strong>clean water provision</strong>, <strong>inclusive education</strong>, and <strong>community development</strong>, alongside youth empowerment through vocational training. The society has earned widespread recognition for its efforts in promoting positive change and sustainable growth, completing over 5000 projects to benefit more than 150,000 individuals.";
  const legal = isAr
    ? "📜 مسجلة بموجب قانون تسجيل الجمعيات لعام 1860 (رقم 646/2007-2008) ومعتمدة بموجب FCRA"
    : "📜 Registered under Societies Registration Act XXI of 1860 (No. 646/2007-08) • FCRA approved";
  const cta = isAr ? "اعرف المزيد" : "Know More";

  // Typing animation variants for the heading (runs once)
  const headingVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "auto",
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };
  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Split heading into "ABOUT" and "US" for separate coloring
  const [aboutPart, usPart] = isAr ? ["من ", "نحن"] : ["ABOUT ", "US"];

  // Use database image if available, fallback to default
  const imageSrc = isLoadingWebsiteData
    ? "/meed2.jpg"
    : websiteData.mainPage?.about?.images?.[0] || "/meed2.jpg";

  return (
    <section className="relative bg-gradient-to-b from-[#f0ede4] to-[#e7e5de] py-10">
      <svg className="absolute -top-10 w-full h-24 -translate-y-1/2 z-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,0 C400,60 1000,60 1440,0 L1440,120 L0,120 Z" fill="url(#waveGradient)" />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#f0ede4", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#e7e5de", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl -top-5 flex flex-col lg:flex-row gap-8 px-6" dir={isAr ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:basis-1/2 relative lg:order-2"
        >
          <figure className="border-4 border-white rounded-xl overflow-hidden shadow-lg">
            <Image
              src={imageSrc}
              alt="Society building"
              width={600}
              height={400}
              className="w-full h-[400px] object-cover"
              onError={(e) => {
                e.target.src = "/meed2.jpg"; // Fallback to default if database image fails
                console.error(`Image load failed for ${imageSrc}`);
              }}
            />
          </figure>
          <div className="absolute -top-10 left-0 translate-x-[20%] z-10">
            <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-lg shadow-md">
              <motion.h2
                className="text-3xl font-extrabold overflow-hidden"
                variants={headingVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.span className="text-teal-600" variants={letterVariants}>
                  {aboutPart.split("").map((char, index) => (
                    <motion.span key={index}>{char}</motion.span>
                  ))}
                </motion.span>
                <motion.span className="text-white-700" variants={letterVariants}>
                  {usPart.split("").map((char, index) => (
                    <motion.span key={index}>{char}</motion.span>
                  ))}
                </motion.span>
              </motion.h2>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isAr ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`lg:basis-1/2 px-6 py-8 flex flex-col items-center justify-center ${
            isAr ? "text-right font-arabic" : "text-left"
          } lg:order-1`}
        >
          <div className="flex flex-col items-center w-full text-center">
            <p
              className="text-lg text-gray-700 text-justify leading-relaxed w-full max-w-prose"
              style={{ lineHeight: "1.6" }}
              dangerouslySetInnerHTML={{ __html: body }}
            />
            <div className="mt-4">
              <Link
                href={href}
                className="inline-block bg-gradient-to-r from-[#1270a3] to-[#0f6b9c] hover:from-[#0f6b9c] hover:to-[#0c5680] text-white font-semibold py-2 px-6 rounded-full shadow-md transition-colors duration-200"
              >
                {cta}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <div className="mx-auto max-w-none">
          <div className="bg-gradient-to-r mb-15 mt-15 from-[#1270a3] to-[#0f6b9c] text-white text-center shadow-inner py-5 px-6 text-sm font-medium">
            {legal}
          </div>
        </div>
      </motion.div>
    </section>
  );
}