import AboutPage from "@/components/AboutPage";
export default function Page() { return <AboutPage />; }

// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useRef, useEffect } from "react";
// import { motion } from "framer-motion";

// // Fixed counter hook with 2-second pause and restart
// function useCount(ref, end) {
//   useEffect(() => {
//     if (!ref.current) return;
//     let n = 0;
//     const step = Math.ceil(end / 20); // Faster count (20 steps)
//     let id; // Declare id in outer scope

//     const countUp = () => {
//       id = setInterval(() => {
//         n += step;
//         if (n >= end) {
//           n = end;
//           clearInterval(id);
//           setTimeout(() => {
//             n = 0; // Reset for restart
//             countUp(); // Restart counting
//           }, 2000); // 2-second pause
//         }
//         ref.current.textContent = n.toLocaleString();
//       }, 100); // Faster interval (100ms)
//     };
//     countUp();

//     // Cleanup function with access to id
//     return () => clearInterval(id);
//   }, [end, ref]);
// }

// export default function AboutPage() {
//   // Counters
//   const refYears = useRef(null);
//   const refProjects = useRef(null);
//   const refPeople = useRef(null);
//   useCount(refYears, 7); // Since 2018 (2025 - 7)
//   useCount(refProjects, 5000); // Updated to 5000+
//   useCount(refPeople, 150000); // As per provided code

//   // Timeline reference
//   const timelineRef = useRef(null); // Added to component scope

//   // Arabic content
//   const content = {
//     heroTitle: "جمعية ميد للمدرسة العامة",
//     heroTagline: "تمكين المجتمعات، تغيير الحياة",
//     heroText: "منظمة غير ربحية لدعم التعليم والتنمية.",
//     introText: "جمعية ميد للمدرسة العامة، مقرها الرئيسي في قرية شانكوند، جانكند (رقم التسجيل: MPS/2007/123 بموجب قانون تسجيل الجمعيات XXI لعام 1860)، هي منظمة غير ربحية تأسست عام 2007 بهدف تمكين المجتمعات المتخلفة اقتصاديًا وتعليميًا. من خلال التركيز على التعليم الشامل من مرحلة الحضانة إلى المرحلة الثانوية باللغة الإنجليزية، إدارة المكتبات والمراكز التدريبية، وتوفير المياه النظيفة، تسعى الجمعية لخلق تأثير مستدام في جميع أنحاء الهند، بدعم من لجنة تنفيذية مكونة من 7 أعضاء منتخبين.",
//     quote: "“لقد مكنتنا سخاؤكم من لمس حياة الآلاف. معًا سنصل إلى المزيد من التغيير الإيجابي.”",
//     visionTitle: "رؤيتنا",
//     visionText: "نحو مجتمعات مكتفية ذاتيا وكريمة عبر الهند، مع تعزيز التعليم الشامل والتنمية المستدامة.",
//     missionTitle: "مهمتنا",
//     missionItems: [
//       "تعليم شامل من مرحلة الحضانة إلى الثانوية باللغة الإنجليزية",
//       "توفير المياه النظيفة وإدارة المرافق الأساسية",
//       "تعزيز التنمية المجتمعية والتدريب المهني",
//       "نمو مستمر كمنظمة رائدة في الخدمات الإنسانية",
//     ],
//     aboutText: "جمعية ميد للمدرسة العامة هي منظمة غير ربحية ملتزمة بخدمة المجتمعات المتخلفة في جانكند منذ تأسيسها عام 2007. مقرها في شانكوند، تركز على التعليم الشامل، تطوير البنية التحتية، ودعم الشباب من خلال مراكز تدريب مهني. الجمعية تعمل تحت إشراف لجنة تنفيذية منتخبة، وتهدف إلى توسيع تأثيرها عبر الهند من خلال مشاريع مثل توفير المياه النظيفة ودعم التعليم. بفضل دعم أعضائها المؤسسين وأكثر من 150,000 مستفيد، استطاعت تنفيذ أكثر من 5000 مشروع لتعزيز الرفاهية الاجتماعية.",
//     journeyTitle: "مسيرتنا",
//     timeline: [
//       { y: 2018, ar: "بدء الجمعية مع برامج تعليمية أولية" },
//       { y: 2020, ar: "إنشاء 100 مضخة مياه في المناطق النائية" },
//       { y: 2022, ar: "توسع مع مراكز تدريب مهني جديدة" },
//       { y: 2025, ar: "تسليم المشروع 5000 لدعم التعليم" },
//     ],
//     donate: "تبرع الآن",
//     joinUs: "انضم إلينا",
//     secretaryMessage: [
//       "“كأمين الجمعية، أشعر بالفخر العميق بقيادتنا لدعم المجتمعات المتخلفة في جانكند منذ 2007.”",
//       "“نسعى بجهد لا ينقطع لتقديم التعليم الشامل والمياه النظيفة كأولوية قصوى.”",
//       "“مبادراتنا التنموية تعكس التزامنا اليومي بتحسين حياة الأفراد بكل صدق.”",
//       "“من خلال 5000 مشروع ناجح، حققنا تقدمًا كبيرًا بفضل دعمكم المستمر.”",
//       "“أدعوكم بحرارة للانضمام إلينا في هذا العمل الخيري الذي يغير المجتمعات.”",
//       "“بدعمكم المتزايد، سنتمكن من توسيع نطاق مساعدتنا لتشمل المزيد من الأرواح.”",
//       "“نطمح لبناء مجتمعات مزدهرة ومستدامة عبر كل ربوع الهند.”",
//       "“شكرًا من القلب لثقتكم ومساهمتكم في تعزيز هذا التأثير الإنساني العظيم.”",
//       "“معًا، يمكننا أن نرسم مستقبلًا أفضل للأجيال القادمة بمساعدة برامجنا التعليمية.”"
//     ],
//   };

//   // Animation variants for staggered entrance
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.3,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   useEffect(() => {
//     const section = timelineRef.current;
//     const path = section?.querySelector('.road-path');
//     const marker = section?.querySelector('.traveling-marker');
//     const items = section?.querySelectorAll('.timeline-item');

//     const animateTimeline = () => {
//       if (!path || !marker || !items) return;
//       // Reset animations
//       path.style.strokeDashoffset = '1000';
//       marker.style.transform = 'translate(0, 0)';
//       items.forEach(item => {
//         item.style.opacity = '0';
//         item.style.transform = 'translateY(40px)';
//         const dot = item.querySelector('.timeline-dot');
//         dot.style.transform = 'scale(1)';
//       });

//       // Animate path
//       path.animate(
//         [
//           { strokeDashoffset: '1000' },
//           { strokeDashoffset: '0' }
//         ],
//         {
//           duration: 4000,
//           easing: 'ease-in-out',
//           fill: 'forwards'
//         }
//       );

//       // Animate marker along sine curve with continuous loop
//       const pathLength = path.getTotalLength();
//       const points = [
//         { x: 50, y: 0 },
//         { x: 150, y: -50 },
//         { x: 250, y: 0 },
//         { x: 350, y: -50 },
//         { x: 450, y: 0 },
//         { x: 550, y: -50 },
//         { x: 650, y: 0 },
//         { x: 750, y: -50 },
//         { x: 850, y: 0 }
//       ];
//       marker.animate(
//         points.map((point, index) => ({
//           transform: `translate(${point.x - 50}px, ${point.y}px)`,
//         })),
//         {
//           duration: 4000,
//           easing: 'linear',
//           iterations: Infinity,
//           fill: 'forwards'
//         }
//       );

//       // Animate timeline items and dots sequentially
//       items.forEach((item, index) => {
//         item.animate(
//           [
//             { opacity: 0, transform: 'translateY(40px)' },
//             { opacity: 1, transform: 'translateY(0)' }
//           ],
//           {
//             duration: 600,
//             delay: 800 * (index + 1),
//             easing: 'ease-out',
//             fill: 'forwards'
//           }
//         );
//         const dot = item.querySelector('.timeline-dot');
//         dot.animate(
//           [
//             { transform: 'scale(1)', boxShadow: '0 0 5px rgba(255, 191, 0, 0.3)' },
//             { transform: 'scale(1.5)', boxShadow: '0 0 15px rgba(255, 191, 0, 0.7)' },
//             { transform: 'scale(1)', boxShadow: '0 0 5px rgba(255, 191, 0, 0.3)' }
//           ],
//           {
//             duration: 800,
//             delay: 800 * (index + 1),
//             easing: 'ease-in-out',
//             fill: 'forwards'
//           }
//         );
//       });
//     };

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           animateTimeline();
//         }
//       },
//       { threshold: 0.3 }
//     );

//     if (section) observer.observe(section);

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#fef9ef]">
//       {/* 1 ▸ Hero */}
//       <header className="relative h-[65vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
//         {/* Background Image with Parallax Effect */}
//         <motion.div
//           className="absolute inset-0"
//           initial={{ scale: 1.2 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
//         >
//           <Image
//             src="/meed1.jpg"
//             fill
//             priority
//             alt="Meed Public School Society"
//             className="object-cover"
//             placeholder="blur"
//             blurDataURL="/meed1-blur.jpg" // Create a low-res placeholder image
//             sizes="(max-width: 768px) 100vw, 1200px"
//           />
//         </motion.div>

//         {/* Glassmorphic Overlay with Gradient */}
//         <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 via-emerald-800/60 to-emerald-950/70 backdrop-blur-md" />

//         {/* Content Container */}
//         <motion.div
//           className="relative z-10 max-w-5xl px-4 sm:px-6 text-center space-y-6"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {/* Logo with Glow Effect */}
//           <motion.div variants={itemVariants} className="flex justify-center mb-8">
//             <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white/90 bg-white/30 p-2 flex-shrink-0 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)]">
//               <Image
//                 src="/logo.png"
//                 width={128}
//                 height={128}
//                 alt="Meed Logo"
//                 className="object-cover rounded-2xl w-full h-full"
//                 sizes="(max-width: 768px) 96px, 128px"
//               />
//             </div>
//           </motion.div>

//           {/* Hero Title */}
//           <motion.h1
//             variants={itemVariants}
//             className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg"
//           >
//             {content.heroTitle}
//           </motion.h1>

//           {/* Hero Tagline with Glassmorphic Card */}
//           <motion.div
//             variants={itemVariants}
//             className="border-2 border-white/80 bg-white/20 backdrop-blur-lg p-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
//           >
//             <p className="text-lg sm:text-2xl md:text-3xl font-semibold text-amber-200">
//               {content.heroTagline}
//             </p>
//           </motion.div>

//           {/* Hero Text */}
//           <motion.p
//             variants={itemVariants}
//             className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto"
//           >
//             {content.heroText}
//           </motion.p>

//           {/* CTA Button with Micro-Interactions */}
//           <motion.div variants={itemVariants}>
//             <Link
//               href="/ar/about"
//               prefetch={true}
//               className="inline-flex items-center px-8 py-4 bg-white text-emerald-800 font-semibold mt-6 rounded-xl 
//                          shadow-[0_6px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:bg-amber-50 
//                          transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300"
//             >
//               <motion.span
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex items-center gap-2"
//               >
//                 {content.joinUs}
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   strokeWidth="2"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//               </motion.span>
//             </Link>
//           </motion.div>
//         </motion.div>

//         {/* Animated Wave Transition */}
//         <svg className="absolute bottom-0 left-0 w-full h-24" viewBox="0 0 1000 100" preserveAspectRatio="none">
//           <path
//             d="M0,100 C250,0 750,0 1000,100"
//             className="fill-[#fef9ef]"
//             style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))' }}
//           />
//         </svg>
//       </header>

//       {/* 2 ▸ Secretary’s Message Section */}
//       <section className="bg-[#fef9e6] py-24 relative">
//         <svg className="absolute top-0 left-0 w-full h-16" viewBox="0 0 1000 100" preserveAspectRatio="none">
//           <path d="M0,50 C250,0 750,0 1000,50" className="fill-[#fff9e6]" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))' }} />
//         </svg>
//         <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
//           <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
//             <Image src="/sec2.png" width={300} height={400} alt="Secretary" className="w-full h-full object-cover rounded-lg shadow-md" />
//           </div>
//           <div className="w-full md:w-2/3 md:pl-6">
//             <h2 className="text-2xl font-bold text-emerald-800 italic font-handwriting mb-6">رسالة الأمين</h2>
//             {content.secretaryMessage.map((line, index) => (
//               <p key={index} className="text-gray-700 text-lg leading-loose italic font-handwriting" style={{ lineHeight: '2' }}>
//                 {line}
//               </p>
//             ))}
//             <div className="mt-4 text-right">
//               <span className="text-gray-600 italic font-handwriting">التوقيع</span>
//             </div>
//           </div>
//         </div>
//         <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 1000 100" preserveAspectRatio="none">
//           <path d="M0,50 C250,100 750,100 1000,50" className="fill-[#fff9e6]" style={{ filter: 'drop-shadow(2px -2px 4px rgba(0, 0, 0, 0.2))' }} />
//         </svg>
//       </section>

//       {/* 3 ▸ Vision · Mission · Counters */}
//       <section className="relative bg-emerald-700 text-white py-24">
//         <svg className="absolute top-0 left-0 w-full h-24" viewBox="0 0 1000 100" preserveAspectRatio="none">
//           <path
//             d="M0,0 C250,100 750,100 1000,0"
//             className="fill-[#fef9ef]"
//             style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))' }}
//           />
//         </svg>
//         <div className="absolute top-24 left-0 w-full h-10 bg-emerald-700 clip-path-angle-up" />
//         <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
//           <div className="mb-8">
//             <h3 className="text-2xl font-bold text-white mb-4">حولنا</h3>
//             <p className="text-white/80 text-base leading-relaxed max-w-2xl mx-auto text-justify">
//               {content.aboutText}
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 gap-12">
//             <div className="bg-white/10 rounded-lg p-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
//               <h3 className="text-2xl font-bold mb-3 animate-glow-soft">{content.visionTitle}</h3>
//               <p>{content.visionText}</p>
//             </div>
//             <div className="bg-white/10 rounded-lg p-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
//               <h3 className="text-2xl font-bold mb-3 animate-glow-soft">{content.missionTitle}</h3>
//               <ul className="list-disc ml-5 space-y-1 text-[15px]">
//                 {content.missionItems.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//           <div className="relative z-10 mt-20 flex justify-center gap-10 flex-wrap text-center">
//             <div className="border-2 border-white p-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
//               <span ref={refYears} className="text-4xl font-extrabold block animate-count-up" style={{ color: '#2ecc71' }} />
//               سنوات
//             </div>
//             <div className="border-2 border-white p-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
//               <span ref={refProjects} className="text-4xl font-extrabold block animate-count-up" style={{ color: '#2ecc71' }} />
//               مشاريع
//             </div>
//             <div className="border-2 border-white p-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
//               <span ref={refPeople} className="text-4xl font-extrabold block animate-count-up" style={{ color: '#2ecc71' }} />
//               المستفيدون
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 4 ▸ Timeline (Animated Snake-like Roadmap with Up and Down) */}
//       <section ref={timelineRef} className="max-w-6xl mx-auto px-10 py-20 bg-[#fef9ef]">
//         <h3 className="text-3xl font-bold text-center mb-16 mt-10 text-emerald-800 animate-glow-soft">
//           {content.journeyTitle}
//         </h3>
//         <div className="relative overflow-hidden">
//           <svg className="w-full h-48" viewBox="0 0 1000 140" preserveAspectRatio="xMidYMid meet">
//             <path
//               d="M50 110 Q150 60 250 110 Q350 160 450 110 Q550 60 650 110 Q750 160 850 110"
//               fill="none"
//               stroke="#2ecc71"
//               strokeWidth="6"
//               strokeDasharray="1000"
//               strokeDashoffset="1000"
//               className="road-path"
//               style={{ filter: 'url(#wiggle)' }}
//             />
//             {content.timeline.map((event, index) => {
//               const xPositions = [100, 300, 500, 700];
//               return (
//                 <motion.g
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.3, duration: 0.5 }}
//                 >
//                   <circle
//                     cx={xPositions[index]}
//                     cy="115"
//                     r="5"
//                     fill="#ffbf00"
//                     className="timeline-dot-fixed"
//                   />
//                   <text
//                     x={xPositions[index]}
//                     y="125"
//                     textAnchor="middle"
//                     className="text-emerald-800 font-bold text-sm"
//                   >
//                     {event.y}
//                   </text>
//                   <text
//                     x={xPositions[index]}
//                     y="140"
//                     textAnchor="middle"
//                     className="text-gray-700 text-xs"
//                   >
//                     {event.ar}
//                   </text>
//                 </motion.g>
//               );
//             })}
//             <rect
//               x="0"
//               width="12"
//               height="12"
//               fill="#e67e22"
//               className="traveling-marker"
//               transform="translate(0, 115)"
//               style={{ filter: 'drop-shadow(0 0 5px rgba(230, 126, 34, 0.5))' }}
//             />
//             <filter id="wiggle">
//               <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
//               <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
//             </filter>
//           </svg>
//           <div className="absolute top-0 left-0 w-full h-full flex justify-around items-start">
//             {content.timeline.map((event, index) => {
//               const xPositions = [100, 300, 500, 700];
//               return (
//                 <div
//                   key={index}
//                   className="timeline-item flex flex-col items-center"
//                   style={{ left: `${xPositions[index]}px`, position: 'absolute' }}
//                 >
//                   <div className="relative">
//                     <div className="timeline-dot absolute -top-10 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-amber-400 rounded-full border-4 border-[#fef9ef] transition-all duration-300 hover:scale-125 hover:bg-amber-300"></div>
//                     <h4 className="font-bold text-emerald-800 mt-6 text-sm md:text-base">{event.y}</h4>
//                     <p className="text-gray-700 mt-2 text-center max-w-[200px] text-xs md:text-sm">
//                       {event.ar}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* 5 ▸ Donate Button */}
//       <section className="max-w-6xl mx-auto px-6 py-12 bg-[#fef9ef] text-center">
//         <Link
//           href="/ar/donate"
//           className="inline-flex items-center px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden animate-light-pulse"
//           prefetch={true}
//         >
//           {content.donate}
//           <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/4 animate-sparkle" />
//           <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/5 animate-sparkle-delayed" />
//           <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/6 animate-sparkle-fast" />
//           <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow" />
//         </Link>
//       </section>
//     </div>
//   );
// }