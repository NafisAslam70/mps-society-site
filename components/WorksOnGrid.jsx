// ------------------------------
// components/WorksOnGrid.jsx  (Our Works On)
// ------------------------------
"use client"
import { usePathname } from "next/navigation";
import { FaSchool, FaHandsHelping, FaLeaf, FaClinicMedical, FaChild, FaTree, FaTools, FaHandHoldingUsd } from "react-icons/fa";

export default function WorksOnGrid() {
  const isAr = usePathname().startsWith("/ar");
  const items = [
    { icon: <FaSchool />,  en: "Education",          ar: "التعليم" },
    { icon: <FaHandsHelping />, en: "Relief & Rehab",    ar: "الإغاثة" },
    { icon: <FaLeaf />,    en: "Agriculture",        ar: "الزراعة" },
    { icon: <FaClinicMedical />, en: "Health Care",        ar: "الصحة" },
    { icon: <FaChild />,   en: "Child Care",         ar: "رعاية الطفل" },
    { icon: <FaTree />,    en: "Social Forestry",    ar: "الغابات" },
    { icon: <FaTools />,   en: "Skill Dev.",        ar: "تنمية المهارات" },
    { icon: <FaHandHoldingUsd />, en: "Livelihood Mission", ar: "المعاش" },
  ];
  return (
    <section className="px-6">
      <h2 className="text-2xl font-extrabold text-center text-green-800 mb-8">
        {isAr ? "مجالات عملنا" : "Our Works On"}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {items.map((it) => (
          <div key={it.en} className="flex flex-col items-center text-center space-y-2 p-4 bg-white border rounded shadow">
            <div className="text-4xl text-green-700">{it.icon}</div>
            <span className="font-semibold text-sm text-gray-700">{isAr ? it.ar : it.en}</span>
          </div>
        ))}
      </div>
    </section>
  );
}