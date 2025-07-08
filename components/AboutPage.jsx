"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Fixed counter hook with 2-second pause and restart
function useCount(ref, end) {
  useEffect(() => {
    if (!ref.current) return;
    let n = 0;
    const step = Math.ceil(end / 20);
    let id;

    const countUp = () => {
      id = setInterval(() => {
        n += step;
        if (n >= end) {
          n = end;
          clearInterval(id);
          setTimeout(() => {
            n = 0;
            countUp();
          }, 2000);
        }
        ref.current.textContent = n.toLocaleString();
      }, 100);
    };
    countUp();

    return () => clearInterval(id);
  }, [end, ref]);
}

export default function AboutPage() {
  const isAr = usePathname().startsWith("/ar");

  // Counters
  const refYears = useRef(null);
  const refProjects = useRef(null);
  const refPeople = useRef(null);
  useCount(refYears, 7);
  useCount(refProjects, 5000);
  useCount(refPeople, 150000);

  // Bilingual content
  const content = {
    heroTitle: isAr ? "جمعية ميد للمدرسة العامة" : window.innerWidth < 768 ? "MPS Society" : "MEED Public School Society",
    heroTagline: isAr ? "تمكين المجتمعات، تغيير الحياة" : "Empowering Communities, Transforming Lives",
    heroText: isAr ? "منظمة غير ربحية لدعم التعليم والتنمية." : "A non-profit dedicated to education and development.",
    introText: isAr
      ? "جمعية ميد للمدرسة العامة، مقرها الرئيسي في قرية شانكوند، جانكند (رقم التسجيل: MPS/2007/123 بموجب قانون تسجيل الجمعيات XXI لعام 1860)، هي منظمة غير ربحية تأسست عام 2007 بهدف تمكين المجتمعات المتخلفة اقتصاديًا وتعليميًا. من خلال التركيز على التعليم الشامل من مرحلة الحضانة إلى المرحلة الثانوية باللغة الإنجليزية، إدارة المكتبات والمراكز التدريبية، وتوفير المياه النظيفة، تسعى الجمعية لخلق تأثير مستدام في جميع أنحاء الهند، بدعم من لجنة تنفيذية مكونة من 7 أعضاء منتخبين."
      : "Meed Public School Society, headquartered in Shankund, Jharkhand (Regd. No. MPS/2007/123 under the Societies Registration Act XXI of 1860), is a non-profit organization established in 2007 to empower economically and educationally disadvantaged communities. Through a focus on inclusive education from nursery to secondary levels in English, managing hostels, libraries, and vocational training centers, and providing clean water, the society aims to create a lasting impact across India, supported by a 7-member elected Executive Committee.",
    quote: isAr
      ? "\"لقد مكنتنا سخاؤكم من لمس حياة الآلاف. معًا سنصل إلى المزيد من التغيير الإيجابي.\""
      : "\"Your generosity has enabled us to touch thousands of lives. Together, we’ll achieve even more positive change.\"",
    visionTitle: isAr ? "رؤيتنا" : "Vision",
    visionText: isAr
      ? "نحو مجتمعات مكتفية ذاتيا وكريمة عبر الهند، مع تعزيز التعليم الشامل والتنمية المستدامة."
      : "To foster self-reliant and dignified communities across India through inclusive education and sustainable development.",
    missionTitle: isAr ? "مهمتنا" : "Mission",
    missionItems: [
      { ar: "تعليم شامل من مرحلة الحضانة إلى الثانوية باللغة الإنجليزية", en: "Inclusive education from nursery to secondary levels in English" },
      { ar: "توفير المياه النظيفة وإدارة المرافق الأساسية", en: "Providing clean water and managing essential facilities" },
      { ar: "تعزيز التنمية المجتمعية والتدريب المهني", en: "Promoting community development and vocational training" },
      { ar: "نمو مستمر كمنظمة رائدة في الخدمات الإنسانية", en: "Continuous growth as a leading humanitarian organization" },
    ],
    aboutText: isAr
      ? "جمعية ميد للمدرسة العامة هي منظمة غير ربحية ملتزمة بخدمة المجتمعات المتخلفة في جانكند منذ تأسيسها عام 2007. مقرها في شانكوند، تركز على التعليم الشامل، تطوير البنية التحتية، ودعم الشباب من خلال مراكز تدريب مهني. الجمعية تعمل تحت إشراف لجنة تنفيذية منتخبة، وتهدف إلى توسيع تأثيرها عبر الهند من خلال مشاريع مثل توفير المياه النظيفة ودعم التعليم. بفضل دعم أعضائها المؤسسين وأكثر من 150,000 مستفيد، استطاعت تنفيذ أكثر من 5000 مشروع لتعزيز الرفاهية الاجتماعية."
      : "Meed Public School Society is a dedicated non-profit committed to serving disadvantaged communities in Jharkhand since its founding in 2007. Based in Shankund, it focuses on inclusive education, infrastructure development, and youth empowerment through vocational training centers. Governed by an elected Executive Committee, the society aims to expand its impact across India through projects like clean water provision and educational support. With the backing of its founder members and over 150,000 beneficiaries, it has successfully implemented over 5000 projects to enhance social welfare.",
    journeyTitle: isAr ? "مسيرتنا" : "Our Journey",
    timeline: [
      { y: 2018, ar: "بدء الجمعية مع برامج تعليمية أولية", en: "Society began with initial education programs" },
      { y: 2020, ar: "إنشاء 100 مضخة مياه في المناطق النائية", en: "Established 100 water pumps in remote areas" },
      { y: 2022, ar: "توسع مع مراكز تدريب مهني جديدة", en: "Expanded with new vocational training centers" },
      { y: 2025, ar: "تسليم المشروع 5000 لدعم التعليم", en: "Delivered 5000th project to support education" },
    ],
    donate: isAr ? "تبرع الآن" : "Donate Now",
    joinUs: isAr ? "انضم إلينا" : "Join Us",
    secretaryMessage: isAr
      ? "\"كأمين الجمعية، أشعر بالفخر العميق بقيادتنا لدعم المجتمعات المتخلفة في جانكند منذ 2007. نسعى بجهد لا ينقطع لتقديم التعليم الشامل والمياه النظيفة كأولوية قصوى. مبادراتنا التنموية تعكس التزامنا اليومي بتحسين حياة الأفراد بكل صدق. من خلال 5000 مشروع ناجح، حققنا تقدمًا كبيرًا بفضل دعمكم المستمر. أدعوكم بحرارة للانضمام إلينا في هذا العمل الخيري الذي يغير المجتمعات. بدعمكم المتزايد، سنتمكن من توسيع نطاق مساعدتنا لتشمل المزيد من الأرواح. نطمح لبناء مجتمعات مزدهرة ومستدامة عبر كل ربوع الهند. شكرًا من القلب لثقتكم ومساهمتكم في تعزيز هذا التأثير الإنساني العظيم. معًا، يمكننا أن نرسم مستقبلًا أفضل للأجيال القادمة بمساعدة برامجنا التعليمية.\""
      : "\"As Secretary of the Society, I take immense pride in leading our efforts to support disadvantaged communities in Jharkhand since 2007. We work tirelessly to prioritize inclusive education and clean water as our core mission. Our development initiatives reflect our unwavering daily commitment to improving lives with sincerity. With 5000 successful projects, we’ve made significant progress thanks to your ongoing support. I warmly invite you to join us in this transformative charitable work that uplifts communities. With your growing support, we can extend our assistance to touch even more lives. We aspire to build thriving, sustainable communities across every corner of India. Heartfelt thanks for your trust and contributions in enhancing this profound humanitarian impact. Together, we can shape a brighter future for generations to come with our educational programs.\"",
  };

  // Ref for the timeline section to trigger animation
  const timelineRef = useRef(null);

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  useEffect(() => {
    const section = timelineRef.current;
    const path = section?.querySelector(".road-path");
    const marker = section?.querySelector(".traveling-marker");
    const items = section?.querySelectorAll(".timeline-item");

    const animateTimeline = () => {
      if (!path || !marker || !items) return;
      // Reset animations
      path.style.strokeDashoffset = "1000";
      marker.style.transform = "translate(0, 0)";
      items.forEach((item) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(40px)";
        const dot = item.querySelector(".timeline-dot");
        dot.style.transform = "scale(1)";
      });

      // Animate path
      path.animate(
        [{ strokeDashoffset: "1000" }, { strokeDashoffset: "0" }],
        {
          duration: 4000,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );

      // Animate marker along sine curve with continuous loop
      const points = [
        { x: 50, y: 0 },
        { x: 150, y: -50 },
        { x: 250, y: 0 },
        { x: 350, y: -50 },
        { x: 450, y: 0 },
        { x: 550, y: -50 },
        { x: 650, y: 0 },
        { x: 750, y: -50 },
        { x: 850, y: 0 },
      ];
      marker.animate(
        points.map((point) => ({
          transform: `translate(${point.x - 50}px, ${point.y}px)`,
        })),
        {
          duration: 4000,
          easing: "linear",
          iterations: Infinity,
          fill: "forwards",
        }
      );

      // Animate timeline items and dots sequentially for desktop
      items.forEach((item, index) => {
        item.animate(
          [
            { opacity: 0, transform: "translateY(40px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 600,
            delay: 800 * (index + 1),
            easing: "ease-out",
            fill: "forwards",
          }
        );
        const dot = item.querySelector(".timeline-dot");
        dot.animate(
          [
            { transform: "scale(1)", boxShadow: "0 0 5px rgba(255, 191, 0, 0.3)" },
            { transform: "scale(1.5)", boxShadow: "0 0 15px rgba(255, 191, 0, 0.7)" },
            { transform: "scale(1)", boxShadow: "0 0 5px rgba(255, 191, 0, 0.3)" },
          ],
          {
            duration: 800,
            delay: 800 * (index + 1),
            easing: "ease-in-out",
            fill: "forwards",
          }
        );
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateTimeline();
        }
      },
      { threshold: 0.3 }
    );

    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#fef9ef]">
      {/* 1 ▸ Hero */}
      <header className="relative h-[65vh] md:h-[70vh] flex items-center justify-center overflow-hidden pt-12">
        {/* Background Image with Parallax Effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src="/meed1.jpg"
            fill
            priority
            alt="Meed Public School Society"
            className="object-cover"
            placeholder="blur"
            blurDataURL="/meed1-blur.jpg"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </motion.div>

        {/* Glassmorphic Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 via-emerald-800/60 to-emerald-950/70 backdrop-blur-md" />

        {/* Content Container */}
        <motion.div
          dir={isAr ? "rtl" : "ltr"}
          className="relative z-10 max-w-5xl px-4 sm:px-6 text-center space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo with Glow Effect */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-4 border-white/90 bg-white/30 p-2 flex-shrink-0 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Image
                src="/logo.png"
                width={112}
                height={112}
                alt="Meed Logo"
                className="object-cover rounded-2xl w-full h-full"
                sizes="(max-width: 768px) 80px, 112px"
              />
            </div>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg"
          >
            {content.heroTitle}
          </motion.h1>

          {/* Hero Tagline with Glassmorphic Card */}
          <motion.div
            variants={itemVariants}
            className="border-2 border-white/80 bg-white/20 backdrop-blur-lg p-2 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            <p className="text-base sm:text-xl md:text-2xl font-semibold text-amber-200">
              {content.heroTagline}
            </p>
          </motion.div>

          {/* Hero Text */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto"
          >
            {content.heroText}
          </motion.p>

          {/* CTA Button with Micro-Interactions */}
          <motion.div variants={itemVariants} className="relative z-20 mt-8">
            <Link
              href={isAr ? "/ar/about" : "/about"}
              prefetch={true}
              className="inline-flex items-center px-6 py-3 bg-white text-emerald-800 font-semibold rounded-xl shadow-[0_6px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:bg-amber-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                {content.joinUs}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Wave Transition */}
        <svg
          className="absolute bottom-0 left-0 w-full h-24"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C250,0 750,0 1000,100"
            className="fill-[#fef9ef]"
            style={{ filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))" }}
          />
        </svg>
      </header>

      {/* 2 ▸ Secretary’s Message Section */}
      <section className="bg-[#fef9ef] py-24 relative" style={{ backgroundColor: "#fff9e6" }}>
        <svg
          className="absolute top-0 left-0 w-full h-16"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C250,0 750,0 1000,50"
            className="fill-[#fff9ef]"
            style={{ filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))" }}
          />
        </svg>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center font-['Roboto',sans-serif] text-shadow-sm" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}>
            Secretary’s Message
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
            <div className="order-first md:order-first md:pr-8">
              <Image
                src="/sec2.png"
                width={300}
                height={450}
                alt="Secretary"
                className="w-3/4 md:w-full h-[450px] object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex flex-col justify-between min-h-[450px] md:pl-8">
              <div>
                <p
                  className="text-gray-700 text-lg leading-loose font-['Roboto',sans-serif] text-justify text-shadow-sm"
                  style={{ lineHeight: "2", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}
                  dir={isAr ? "rtl" : "ltr"}
                >
                  {content.secretaryMessage}
                </p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600 font-['Roboto',sans-serif] text-shadow-sm" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Secretary
                </p>
                <p className="text-gray-600 font-['Roboto',sans-serif] text-shadow-sm" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Aslam Kamal Madani
                </p>
                <p className="text-gray-600 font-['Roboto',sans-serif] text-shadow-sm" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Social Worker
                </p>
                <div className="mt-2 h-12 w-32 mx-auto">
                  {/* Placeholder for signature */}
                  <div className="border-b border-gray-600 w-full h-full flex items-center justify-center text-gray-600 font-['Roboto',sans-serif] text-shadow-sm" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                    Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full h-16"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C250,100 750,100 1000,50"
            className="fill-[#fff9e6]"
            style={{ filter: "drop-shadow(2px -2px 4px rgba(0, 0, 0, 0.2))" }}
          />
        </svg>
      </section>

      {/* 3 ▸ Vision · Mission · Counters */}
      <section className="relative bg-emerald-700 text-white py-24">
        <svg
          className="absolute top-0 left-0 w-full h-24"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C250,100 750,100 1000,0"
            className="fill-[#fef9ef]"
            style={{ filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))" }}
          />
        </svg>
        <div className="absolute top-24 left-0 w-full h-10 bg-emerald-700 clip-path-angle-up" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">About Us</h3>
            <p className="text-white/80 text-base leading-relaxed max-w-2xl mx-auto text-justify">
              {content.aboutText}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/10 rounded-lg p-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <h3 className="text-2xl font-bold mb-3 animate-glow-soft">{content.visionTitle}</h3>
              <p>{content.visionText}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <h3 className="text-2xl font-bold mb-3 animate-glow-soft">{content.missionTitle}</h3>
              <ul className="list-disc ml-5 space-y-1 text-[15px]">
                {content.missionItems.map((item, index) => (
                  <li key={index}>{isAr ? item.ar : item.en}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative z-10 mt-20 flex justify-center gap-10 flex-wrap text-center">
            <div className="border-2 border-white p-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <span
                ref={refYears}
                className="text-4xl font-extrabold block animate-count-up"
                style={{ color: "#2ecc71" }}
              />
              {isAr ? "عامًا" : "Years"}
            </div>
            <div className="border-2 border-white p-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <span
                ref={refProjects}
                className="text-4xl font-extrabold block animate-count-up"
                style={{ color: "#2ecc71" }}
              />
              {isAr ? "مشروعًا" : "Projects"}
            </div>
            <div className="border-2 border-white p-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <span
                ref={refPeople}
                className="text-4xl font-extrabold block animate-count-up"
                style={{ color: "#2ecc71" }}
              />
              {isAr ? "مستفيدًا" : "Beneficiaries"}
            </div>
          </div>
        </div>
      </section>

      {/* 4 ▸ Timeline (Animated Snake-like Roadmap for Desktop, Vertical for Mobile) */}
      <section ref={timelineRef} className="max-w-6xl mx-auto px-4 sm:px-10 py-4 bg-[#fef9ef]">
        <h3 className="text-3xl font-bold text-center mb-12 mt-10 text-emerald-800 animate-glow-soft">
          {content.journeyTitle}
        </h3>
        {/* Desktop Timeline (Horizontal Snake-like Roadmap) */}
        <div className="hidden sm:block relative overflow-visible h-48">
          <svg className="w-full h-48 absolute top-0 left-0" viewBox="0 0 1000 140" preserveAspectRatio="xMidYMid meet">
            <path
              d="M50 110 Q150 60 250 110 Q350 160 450 110 Q550 60 650 110 Q750 160 850 110"
              fill="none"
              stroke="#2ecc71"
              strokeWidth="6"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              className="road-path"
              style={{ filter: "url(#wiggle)" }}
            />
            <rect
              x="0"
              width="12"
              height="12"
              fill="#e67e22"
              className="traveling-marker"
              transform="translate(0, 115)"
              style={{ filter: "drop-shadow(0 0 5px rgba(230, 126, 34, 0.5))" }}
            />
            <filter id="wiggle">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex justify-between items-start">
            {content.timeline.map((event, index) => {
              const xPositions = [100, 300, 500, 700];
              return (
                <div
                  key={index}
                  className="timeline-item flex flex-col items-center"
                  style={{
                    left: `${xPositions[index]}px`,
                    position: "absolute",
                    transform: "translateX(-50%)",
                    width: "150px",
                  }}
                >
                  <div className="relative">
                    <div className="timeline-dot absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-amber-400 rounded-full border-4 border-[#fef9ef] transition-all duration-300 hover:scale-125 hover:bg-amber-300"></div>
                    <h4 className="font-bold text-emerald-800 text-center mt-6 text-sm sm:text-base">{event.y}</h4>
                    <p className="text-gray-700 mt-2 text-center text-xs sm:text-sm max-w-[140px]">
                      {isAr ? event.ar : event.en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Mobile Timeline (Vertical Snake-like Line on Right) */}
        <div className="sm:hidden relative w-full min-h-[400px] flex flex-col items-end">
          <svg className="absolute w-12 h-full right-4" viewBox="0 0 40 400" preserveAspectRatio="none">
            <path
              d="M20 10 Q20 100 20 150 Q20 200 20 250 Q20 300 20 350 Q20 400 20 390"
              fill="none"
              stroke="#2ecc71"
              strokeWidth="6"
              strokeDasharray="400"
              strokeDashoffset="0"
              className="road-path"
            />
            <rect
              x="14"
              y="0"
              width="12"
              height="12"
              fill="#e67e22"
              className="traveling-marker"
              style={{ filter: "drop-shadow(0 0 5px rgba(230, 126, 34, 0.5))" }}
            />
          </svg>
          <div className="relative w-full h-full flex flex-col items-start pr-12 space-y-12 pt-8">
            {content.timeline.map((event, index) => (
              <motion.div
                key={index}
                className="timeline-item flex flex-row items-center"
                style={{ width: "100%" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.3 }}
              >
                <div className="relative flex flex-col items-end">
                  <div className="timeline-dot absolute right-[-28px] top-2 w-5 h-5 bg-amber-400 rounded-full border-4 border-[#fef9ef] transition-all duration-300 hover:scale-125 hover:bg-amber-300"></div>
                  <h4 className="font-bold text-emerald-800 text-base text-right">{event.y}</h4>
                  <p className="text-gray-700 mt-2 text-sm max-w-[80%] text-right">
                    {isAr ? event.ar : event.en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 ▸ Donate Button */}
      <section className="max-w-6xl mx-auto px-6 py-12 bg-[#fef9ef] text-center">
        <Link
          href={isAr ? "/ar/donate" : "/donate"}
          className="inline-flex items-center px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden animate-light-pulse"
          prefetch={true}
        >
          {content.donate}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/4 animate-sparkle" />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/5 animate-sparkle-delayed" />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/6 animate-sparkle-fast" />
          <span className="absolute inset-0 ring-2 ring-emerald-400/50 animate-glow" />
        </Link>
      </section>
    </div>
  );
}