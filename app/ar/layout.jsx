
// ------------------------------
// app/ar/layout.jsx  (Arabic wrapper, RTL only)
// ------------------------------
export const metadata = {
  title: "جمعية ميد للمدرسة العامة",
  description: "أكثر من 2000 مشروع خيري في جميع أنحاء الهند لخدمة الإنسانية.",
};

export default function ArabicLayout({ children }) {
  return (
    <div dir="rtl" className="min-h-screen bg-white text-gray-800 font-sans">
      {children}
    </div>
  );
}
