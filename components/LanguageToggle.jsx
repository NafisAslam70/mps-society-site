// ------------------------------
// components/LanguageToggle.jsx
// ------------------------------
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageToggle() {
  const pathname = usePathname();
  const router   = useRouter();
  const isAr     = pathname.startsWith("/ar");
  const [href, setHref] = useState("/");

  useEffect(() => {
    setHref(isAr ? pathname.replace("/ar", "") || "/" : `/ar${pathname}`);
  }, [pathname, isAr]);

  return (
    <button onClick={() => router.push(href)} className="text-red-600 border px-2 py-1 rounded border-red-600 hover:bg-yellow-300 hover:text-green-900 transition">
      {isAr ? "ENG" : "العربية"}
    </button>
  );
}
