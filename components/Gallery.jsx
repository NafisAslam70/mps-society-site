export default function Gallery() {
  const items = [
    { src: "/images/tanki1.jpeg",  captionEn: "Water Tank",      captionAr: "خزان مياه" },
    { src: "/images/masjid1.jpeg", captionEn: "Community Mosque",captionAr: "مسجد مجتمعي"},
    { src: "/images/masjid2.jpeg", captionEn: "Madrasah",        captionAr: "مدرسة دينية"},
    { src: "/images/tanki2.jpeg",  captionEn: "Hand Pump",       captionAr: "مضخة يدوية"},
  ];
  const isAr = typeof window !== "undefined" && window.location.pathname.startsWith("/ar");

  return (
    <section className="py-12 px-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
        {isAr ? "معرض الصور" : "Gallery"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((i) => (
          <figure key={i.src} className="overflow-hidden rounded shadow">
            <img src={i.src} alt={isAr ? i.captionAr : i.captionEn} className="w-full h-48 object-cover" />
            <figcaption className="p-2 text-center text-sm text-gray-700">
              {isAr ? i.captionAr : i.captionEn}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
