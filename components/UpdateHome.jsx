"use client";
import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const UpdateHome = ({ setView }) => {
  const { websiteData, setWebsiteData, isLoadingWebsiteData, websiteFetchError } = useAppContext();
  const pathname = usePathname();
  const isAr = pathname.startsWith("/ar");
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubSection, setSelectedSubSection] = useState(null);
  const [editedSection, setEditedSection] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");

  const sections = [
    { id: "hero", titleEn: "Hero Section", titleAr: "القسم الرئيسي", maxImages: 5, hasLogo: true },
    { id: "about", titleEn: "About Strip", titleAr: "شريط عنا", maxImages: 1 },
    {
      id: "education",
      titleEn: "Education Slider",
      titleAr: "سلايدر التعليم",
      maxImages: 5,
      subSections: [
        { id: "academics", titleEn: "Academics", titleAr: "الأكاديميات" },
        { id: "sports", titleEn: "Sports", titleAr: "الرياضة" },
        { id: "hostel", titleEn: "Hostel", titleAr: "السكن" },
        { id: "mosque", titleEn: "Mosque", titleAr: "المسجد" },
        { id: "islamicEducation", titleEn: "Islamic Education", titleAr: "التعليم الإسلامي" },
      ],
    },
    { id: "video", titleEn: "Video Gallery", titleAr: "معرض الفيديو", maxVideos: 6 },
  ];

  const handleSelectSection = (section, subSection = null) => {
    setSelectedSection(section);
    setSelectedSubSection(subSection);
    setNewVideoUrl("");
    if (section.id === "education" && subSection) {
      setEditedSection({
        id: section.id,
        subId: subSection.id,
        images: websiteData.education?.[subSection.id]?.images || [],
      });
    } else if (section.id === "video") {
      setEditedSection({
        id: section.id,
        videos: websiteData.video?.videos || [],
      });
    } else {
      setEditedSection({
        id: section.id,
        images: section.id === "about" ? [websiteData[section.id]?.image || ""] : websiteData[section.id]?.images || [],
        logo: section.id === "hero" ? websiteData.hero?.logo || null : null,
      });
    }
  };

  const handleImageChange = (e) => {
    const maxImages = selectedSection.maxImages || 5;
    const files = Array.from(e.target.files).slice(0, maxImages - (editedSection.images?.filter(img => img).length || 0));
    if (files.length === 0) return;

    const readers = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setEditedSection((prev) => ({
        ...prev,
        images: selectedSection.id === "about" ? results : [...(prev.images || []), ...results].slice(0, maxImages),
      }));
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedSection((prev) => ({
        ...prev,
        logo: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (index, value) => {
    setEditedSection((prev) => ({
      ...prev,
      videos: prev.videos.map((v, i) => (i === index ? value : v)),
    }));
  };

  const handleAddVideo = () => {
    if (!newVideoUrl || editedSection.videos.length >= selectedSection.maxVideos) return;
    if (!newVideoUrl.match(/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+/)) {
      setMessage(isAr ? "رابط يوتيوب غير صالح!" : "Invalid YouTube embed URL!");
      return;
    }
    setEditedSection((prev) => ({
      ...prev,
      videos: [...prev.videos, newVideoUrl],
    }));
    setNewVideoUrl("");
  };

  const handleDeleteImage = (index) => {
    setEditedSection((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteLogo = () => {
    setEditedSection((prev) => ({
      ...prev,
      logo: null,
    }));
  };

  const handleDeleteVideo = (index) => {
    setEditedSection((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!editedSection || (!editedSection.images?.length && !editedSection.logo && !editedSection.videos?.length)) {
      setMessage(isAr ? "يجب الاحتفاظ بمحتوى واحد على الأقل!" : "At least one content item must remain!");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/website-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedSection),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update content");
      }

      setWebsiteData((prev) => {
        if (selectedSection.id === "education" && selectedSubSection) {
          return {
            ...prev,
            education: {
              ...prev.education,
              [selectedSubSection.id]: { images: editedSection.images },
            },
          };
        }
        return {
          ...prev,
          [selectedSection.id]: {
            ...prev[selectedSection.id],
            images: selectedSection.id === "about" ? editedSection.images[0] || null : editedSection.images,
            videos: selectedSection.id === "video" ? editedSection.videos : undefined,
            ...(selectedSection.id === "hero" && { logo: editedSection.logo }),
          },
        };
      });

      setMessage(isAr ? "تم تحديث المحتوى بنجاح!" : "Content updated successfully!");
      setSelectedSection(null);
      setSelectedSubSection(null);
      setEditedSection(null);
      setNewVideoUrl("");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("Update error:", error.message);
      setMessage(isAr ? `حدث خطأ أثناء التحديث: ${error.message}` : `Error updating content: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
      <button
        onClick={() => setView("manageSociety")}
        className="mb-6 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:shadow-lg transition-all duration-300 text-sm font-semibold"
      >
        {isAr ? "العودة إلى إدارة الجمعية" : "Back to Manage Society"}
      </button>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-teal-600 text-sm text-center mb-4 bg-teal-50 rounded-lg py-2 px-4"
        >
          {message}
        </motion.p>
      )}
      {isLoadingWebsiteData ? (
        <p className="text-center text-gray-600">{isAr ? "جاري تحميل بيانات الموقع..." : "Loading website data..."}</p>
      ) : websiteFetchError ? (
        <p className="text-center text-red-600">{isAr ? `خطأ في تحميل بيانات الموقع: ${websiteFetchError}` : `Error loading website data: ${websiteFetchError}`}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 128, 128, 0.2)" }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:bg-teal-50 transition-all duration-300 cursor-pointer"
                onClick={() => section.id === "education" ? null : handleSelectSection(section)}
              >
                <h3 className="text-lg font-semibold text-teal-900">{isAr ? section.titleAr : section.titleEn}</h3>
                {section.id === "education" ? (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {section.subSections.map((subSection) => (
                      <div
                        key={subSection.id}
                        className="bg-teal-50 p-2 rounded-lg cursor-pointer hover:bg-teal-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSection(section, subSection);
                        }}
                      >
                        <p className="text-sm text-gray-600">{isAr ? subSection.titleAr : subSection.titleEn}</p>
                        <p className="text-sm text-gray-500">
                          {isAr ? `عدد الصور: ${(websiteData.education?.[subSection.id]?.images || []).length}` : `Images: ${(websiteData.education?.[subSection.id]?.images || []).length}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : section.id === "video" ? (
                  <p className="text-sm text-gray-600 mt-1">
                    {isAr ? `عدد الفيديوهات: ${(websiteData.video?.videos || []).length}` : `Videos: ${(websiteData.video?.videos || []).length}`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">
                    {isAr
                      ? `عدد الصور: ${section.id === "about" ? websiteData[section.id]?.image ? 1 : 0 : websiteData[section.id]?.images?.length || 0}`
                      : `Images: ${section.id === "about" ? websiteData[section.id]?.image ? 1 : 0 : websiteData[section.id]?.images?.length || 0}`}
                    {section.hasLogo && ` | ${isAr ? "الشعار: " : "Logo: "} ${websiteData.hero?.logo ? "Set" : "Not Set"}`}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          {selectedSection && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 20 }}
                  className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-teal-200"
                >
                  <h3 className="text-xl font-bold text-teal-900 mb-4">
                    {isAr
                      ? `تعديل ${selectedSubSection ? selectedSubSection.titleAr : selectedSection.titleAr}`
                      : `Edit ${selectedSubSection ? selectedSubSection.titleEn : selectedSection.titleEn}`}
                  </h3>
                  {selectedSection.id === "video" ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isAr ? "إضافة رابط فيديو يوتيوب جديد" : "Add New YouTube Video Embed URL"}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newVideoUrl}
                            onChange={(e) => setNewVideoUrl(e.target.value)}
                            placeholder="https://www.youtube.com/embed/VIDEO_ID"
                            className="w-full p-2 border border-teal-200 rounded-lg"
                            disabled={isSaving}
                          />
                          <button
                            onClick={handleAddVideo}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300"
                            disabled={isSaving || !newVideoUrl}
                          >
                            {isAr ? "إضافة" : "Add"}
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isAr ? "الفيديوهات الحالية" : "Current Videos"}
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {editedSection?.videos.map((video, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={video}
                                onChange={(e) => handleVideoChange(index, e.target.value)}
                                className="w-full p-2 border border-teal-200 rounded-lg"
                                disabled={isSaving}
                              />
                              <button
                                onClick={() => handleDeleteVideo(index)}
                                className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                disabled={isSaving}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {selectedSection.id === "about" ? (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isAr ? "صورة جديدة" : "New Image"}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 border border-teal-200 rounded-lg"
                            disabled={isSaving}
                          />
                        </div>
                      ) : (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isAr ? "إضافة صور جديدة" : "Add New Images"}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="w-full p-2 border border-teal-200 rounded-lg"
                            disabled={isSaving}
                          />
                        </div>
                      )}
                      {selectedSection.hasLogo && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isAr ? "شعار جديد" : "New Logo"}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="w-full p-2 border border-teal-200 rounded-lg"
                            disabled={isSaving}
                          />
                        </div>
                      )}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isAr ? "المحتوى الحالي" : "Current Content"}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {editedSection?.images?.map(
                            (image, index) =>
                              image && (
                                <div key={index} className="relative">
                                  <Image
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="w-full h-20 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => handleDeleteImage(index)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 transition-all"
                                    disabled={isSaving}
                                  >
                                    ✕
                                  </button>
                                </div>
                              )
                          )}
                          {selectedSection.hasLogo && editedSection.logo && (
                            <div className="relative">
                              <Image
                                src={editedSection.logo}
                                alt="Logo"
                                width={100}
                                height={100}
                                className="w-full h-20 object-contain rounded-lg"
                              />
                              <button
                                onClick={handleDeleteLogo}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 transition-all"
                                disabled={isSaving}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => {
                        setSelectedSection(null);
                        setSelectedSubSection(null);
                        setEditedSection(null);
                        setNewVideoUrl("");
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-medium"
                      disabled={isSaving}
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium relative"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white mx-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <span>{isAr ? "حفظ" : "Save"}</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
};

export default memo(UpdateHome);