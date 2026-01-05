"use client";
import { useState, useEffect, memo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

// Maximum file size limit: 1MB
const MAX_SIZE = 5 * 1024 * 1024; // 1MB in bytes
const VALID_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

const UpdateHome = ({ setView }) => {
  const { websiteData, setWebsiteData, isLoadingWebsiteData, websiteFetchError, refreshWebsiteData } = useAppContext();
  const pathname = usePathname();
  const isAr = pathname.startsWith("/ar");
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubSection, setSelectedSubSection] = useState(null);
  const [editedSection, setEditedSection] = useState({ images: [], logo: null, videos: [], invalidImages: [] });
  const [pendingChanges, setPendingChanges] = useState({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [saveProgress, setSaveProgress] = useState({ current: "", total: 0, completed: 0, error: null });
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [saveCompleted, setSaveCompleted] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const hasInitialized = useRef(false); // Flag to prevent multiple refreshes

  const debouncedRefresh = useCallback(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(refreshWebsiteData, 300);
    };
  }, [refreshWebsiteData]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted && !hasInitialized.current && !isLoadingWebsiteData) {
      debouncedRefresh()();
      hasInitialized.current = true; // Set flag after first refresh
    }
    return () => { isMounted = false; };
  }, [debouncedRefresh, isLoadingWebsiteData]);

  const sections = [
    { id: "hero", titleEn: "Hero Section", titleAr: "القسم الرئيسي", maxImages: 10, hasLogo: true },
    { id: "about", titleEn: "About Strip", titleAr: "شريط عنا", maxImages: 1 },
    {
      id: "education",
      titleEn: "Education Slider",
      titleAr: "سلايدر التعليم",
      maxImages: 5,
      subSections: [
        { id: "academics", titleEn: "Academics", titleAr: "الأكاديميات" },
        { id: "islamicEducation", titleEn: "Islamic Education", titleAr: "التعليم الإسلامي" },
        { id: "sports", titleEn: "Sports", titleAr: "الرياضة" },
        { id: "hostel", titleEn: "Hostel", titleAr: "السكن" },
        { id: "others", titleEn: "Others", titleAr: "أخرى" },
      ],
    },
    { id: "video", titleEn: "Video Gallery", titleAr: "معرض الفيديو", maxVideos: 6 },
  ];

  const handleSelectSection = (section, subSection = null) => {
    if (editedSection && selectedSection) {
      setPendingChanges((prev) => {
        const currentData = websiteData.mainPage?.[selectedSection.id]?.images || [];
        const currentEducationData = selectedSection.id === "education" && selectedSubSection
          ? websiteData.mainPage?.education?.[selectedSubSection.id]?.images || []
          : [];
        return {
          ...prev,
          [selectedSection.id]: {
            ...(prev[selectedSection.id] || {}),
            ...(selectedSection.id === "education" && selectedSubSection
              ? { [selectedSubSection.id]: { images: editedSection.images } }
              : {
                  images: selectedSection.id === "about" ? [editedSection.images[0] || null] : editedSection.images.filter(img => img || currentData.includes(img)),
                  videos: selectedSection.id === "video" ? editedSection.videos : undefined,
                  ...(selectedSection.id === "hero" && { logo: editedSection.logo }),
                }),
          },
        };
      });
    }

    setSelectedSection(section);
    setSelectedSubSection(subSection);
    setNewVideoUrl("");
    setEditedSection({
      images:
        section.id === "education" && subSection
          ? pendingChanges?.[section.id]?.[subSection.id]?.images || websiteData.mainPage?.education?.[subSection.id]?.images || []
          : pendingChanges?.[section.id]?.images || (section.id === "about" ? [websiteData.mainPage?.about?.images?.[0] || ""] : websiteData.mainPage?.[section.id]?.images || []),
      logo: section.id === "hero" ? pendingChanges?.[section.id]?.logo || websiteData.mainPage?.hero?.logo || null : null,
      videos: section.id === "video" ? pendingChanges?.[section.id]?.videos || websiteData.mainPage?.video?.videos || [] : [],
      invalidImages: [],
    });
  };

  const handleImageChange = (e) => {
    const maxImages = selectedSection.maxImages || 5;
    const files = Array.from(e.target.files).slice(0, maxImages - (editedSection.images.filter(img => img && img.startsWith("data:")).length || 0));
    if (files.length === 0) return;

    const invalidFiles = [];
    const readers = files.map((file) => {
      if (!VALID_TYPES.includes(file.type)) {
        invalidFiles.push(file.name);
        return Promise.resolve(null);
      }
      if (file.size > MAX_SIZE) {
        invalidFiles.push(file.name);
        return Promise.resolve(null);
      }
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      const validResults = results.filter(result => result && result.startsWith("data:"));
      if (validResults.length === 0 && invalidFiles.length > 0) {
        setMessage(isAr ? `الملفات غير صالحة: ${invalidFiles.join(", ")}` : `Invalid files: ${invalidFiles.join(", ")}`);
        setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
        return;
      }
      setEditedSection((prev) => ({
        ...prev,
        images: selectedSection.id === "about" ? [validResults[0] || null] : [...prev.images, ...validResults].slice(0, maxImages),
        invalidImages: [...prev.invalidImages, ...invalidFiles.map(name => ({ name, src: URL.createObjectURL(e.target.files[files.findIndex(f => f.name === name)]) }))],
      }));
      if (invalidFiles.length > 0) {
        setMessage(isAr ? `تم رفض الملفات غير صالحة: ${invalidFiles.join(", ")}` : `Rejected invalid files: ${invalidFiles.join(", ")}`);
        setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
      }
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      setMessage(isAr ? "تنسيق الصورة غير مدعوم. استخدم .png أو .jpg أو .jpeg أو .webp." : "Unsupported image format. Use .png, .jpg, .jpeg, or .webp.");
      setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
      setEditedSection((prev) => ({ ...prev, invalidImages: [{ name: file.name, src: URL.createObjectURL(file) }] }));
      return;
    }
    if (file.size > MAX_SIZE) {
      setMessage(isAr ? "حجم الصورة كبير جدًا. الحد الأقصى 1MB." : "Image size too large. Maximum 1MB.");
      setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
      setEditedSection((prev) => ({ ...prev, invalidImages: [{ name: file.name, src: URL.createObjectURL(file) }] }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedSection((prev) => ({
        ...prev,
        logo: reader.result,
        invalidImages: [],
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
      setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
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
      invalidImages: prev.invalidImages.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteLogo = () => {
    setEditedSection((prev) => ({
      ...prev,
      logo: null,
      invalidImages: [],
    }));
  };

  const handleDeleteVideo = (index) => {
    setEditedSection((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSaveSection = () => {
    if (!editedSection || (!editedSection.images?.length && !editedSection.logo && !editedSection.videos?.length)) {
      setMessage(isAr ? "يجب الاحتفاظ بمحتوى واحد على الأقل!" : "At least one content item must remain!");
      setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
      return;
    }

    setIsSaving(true);
    setShowProgressModal(true);
    setSaveProgress({ current: selectedSection.id, total: 1, completed: 0, error: null });

    setPendingChanges((prev) => {
      const currentImages = websiteData.mainPage?.[selectedSection.id]?.images || [];
      const currentEducationImages = selectedSection.id === "education" && selectedSubSection
        ? websiteData.mainPage?.education?.[selectedSubSection.id]?.images || []
        : [];
      const updatedPending = {
        ...prev,
        [selectedSection.id]: {
          ...(prev[selectedSection.id] || {}),
          ...(selectedSection.id === "education" && selectedSubSection
            ? { [selectedSubSection.id]: { images: editedSection.images } }
            : {
                images: selectedSection.id === "about" ? [editedSection.images[0] || null] : editedSection.images.filter(img => img || currentImages.includes(img)),
                videos: selectedSection.id === "video" ? editedSection.videos : undefined,
                ...(selectedSection.id === "hero" && { logo: editedSection.logo }),
              }),
        },
      };
      setSaveProgress({ current: selectedSection.id, total: 1, completed: 1, error: null });
      setTimeout(() => {
        setProgressMessage(isAr ? "تم الحفظ!" : "Saved!");
        setIsSaving(false);
        setSaveCompleted(true);
      }, 500);
      return updatedPending;
    });
  };

  const handleApplyChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      setMessage(isAr ? "لا توجد تغييرات لتطبيقها!" : "No changes to apply!");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setIsSaving(true);
    setShowProgressModal(true);
    setSaveCompleted(false);
    setProgressMessage("");

    // Calculate total operations based on all pending changes
    let totalOperations = 0;
    Object.entries(pendingChanges).forEach(([sectionId]) => {
      const section = sections.find(s => s.id === sectionId);
      if (sectionId === "education") {
        totalOperations += Object.keys(pendingChanges[sectionId] || {}).length;
      } else {
        totalOperations += 1;
      }
    });

    setSaveProgress({ current: "", total: totalOperations, completed: 0, error: null });

    try {
      for (const [sectionId, sectionData] of Object.entries(pendingChanges)) {
        setSaveProgress(prev => ({ ...prev, current: sectionId }));
        const payload = [];
        if (sectionId === "education") {
          for (const [subId, subData] of Object.entries(sectionData)) {
            payload.push({
              pageId: "mainPage",
              sectionId,
              subId,
              images: subData.images,
            });
          }
        } else {
          const section = sections.find(s => s.id === sectionId);
          const newImages = sectionData.images.filter(img => img && img.startsWith("data:"));
          const newLogo = sectionId === "hero" && sectionData.logo && sectionData.logo.startsWith("data:") ? sectionData.logo : null;
          payload.push({
            pageId: "mainPage",
            sectionId,
            images: newImages.length > 0 ? newImages : sectionData.images,
            videos: sectionId === "video" ? sectionData.videos : undefined,
            ...(sectionId === "hero" && { logo: newLogo }),
          });
        }

        for (let i = 0; i < payload.length; i++) {
          const item = payload[i];
          console.log("Sending PUT request to /api/website-images with payload:", item);
          const response = await fetch("/api/website-images", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          setSaveProgress(prev => ({ ...prev, completed: prev.completed + 1 }));

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update content");
          }
        }
      }

      setWebsiteData((prev) => ({
        ...prev,
        mainPage: {
          ...prev.mainPage,
          ...Object.fromEntries(
            Object.entries(pendingChanges).map(([sectionId, sectionData]) => [
              sectionId,
              sectionId === "education"
                ? {
                    ...prev.mainPage.education,
                    ...Object.fromEntries(
                      Object.entries(sectionData).map(([subId, subData]) => [subId, subData])
                    ),
                  }
                : sectionData,
            ])
          ),
        },
      }));

      setPendingChanges({}); // Clear all pending changes after applying
      setProgressMessage(isAr ? "تم الحفظ!" : "Saved!");
      setSaveCompleted(true);
    } catch (error) {
      console.error("Apply changes error:", error.message, error.stack);
      setSaveProgress(prev => ({ ...prev, error: error.message }));
      setProgressMessage(isAr ? `حدث خطأ أثناء تطبيق التغييرات: ${error.message}` : `Error applying changes: ${error.message}`);
      setSaveCompleted(true);
      setProgressMessage(""); // Clear success message on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
    setSaveCompleted(false);
    setSaveProgress({ current: "", total: 0, completed: 0, error: null });
    setMessage(progressMessage);
    setProgressMessage("");
    // Close edit modal
    setSelectedSection(null);
    setSelectedSubSection(null);
    setEditedSection({ images: [], logo: null, videos: [], invalidImages: [] });
    setNewVideoUrl("");
  };

  return (
    <div className="p-0 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <button
        onClick={() => setView("manageSociety")}
        className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:shadow-lg transition-all duration-300 text-sm font-semibold"
      >
        {isAr ? "العودة إلى إدارة الجمعية" : "Back to Manage Society"}
      </button>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-teal-600 text-sm text-center mb-4 bg-teal-50 rounded-lg py-2 px-4"
        >
          {message}
        </motion.p>
      )}
      {isLoadingWebsiteData ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 text-lg"
        >
          {isAr ? "جاري تحميل بيانات الموقع..." : "Loading website data..."}
        </motion.div>
      ) : websiteFetchError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-600 text-lg bg-red-50 rounded-lg py-4 px-6"
        >
          {isAr ? `خطأ في تحميل بيانات الموقع: ${websiteFetchError}` : `Error loading website data: ${websiteFetchError}`}
          <button
            onClick={() => refreshWebsiteData()}
            className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium"
          >
            {isAr ? "إعادة المحاولة" : "Retry"}
          </button>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 128, 128, 0.2)" }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:bg-teal-50 transition-all duration-300 cursor-pointer"
                onClick={() => handleSelectSection(section)}
              >
                <h3 className="text-lg font-semibold text-teal-900">{isAr ? section.titleAr : section.titleEn}</h3>
                {section.id === "education" ? (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {section.subSections.map((subSection) => (
                      <div
                        key={subSection.id}
                        className="bg-teal-50 p-2 rounded-lg cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSection(section, subSection);
                        }}
                      >
                        <p className="text-sm text-gray-600">{isAr ? subSection.titleAr : subSection.titleEn}</p>
                        <p className="text-sm text-gray-500">
                          {isAr ? `عدد الصور: ${(pendingChanges?.[section.id]?.[subSection.id]?.images || websiteData.mainPage?.education?.[subSection.id]?.images || []).length}` : `Images: ${(pendingChanges?.[section.id]?.[subSection.id]?.images || websiteData.mainPage?.education?.[subSection.id]?.images || []).length}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : section.id === "video" ? (
                  <p className="text-sm text-gray-600 mt-1">
                    {isAr ? `عدد الفيديوهات: ${(pendingChanges?.[section.id]?.videos || websiteData.mainPage?.video?.videos || []).length}` : `Videos: ${(pendingChanges?.[section.id]?.videos || websiteData.mainPage?.video?.videos || []).length}`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">
                    {isAr
                      ? `عدد الصور: ${section.id === "about" ? (pendingChanges?.[section.id]?.images?.[0] || websiteData.mainPage?.about?.images?.[0]) ? 1 : 0 : (pendingChanges?.[section.id]?.images || websiteData.mainPage?.[section.id]?.images || []).length}`
                      : `Images: ${section.id === "about" ? (pendingChanges?.[section.id]?.images?.[0] || websiteData.mainPage?.about?.images?.[0]) ? 1 : 0 : (pendingChanges?.[section.id]?.images || websiteData.mainPage?.[section.id]?.images || []).length}`}
                    {section.hasLogo && ` | ${isAr ? "الشعار: " : "Logo: "} ${(pendingChanges?.[section.id]?.logo || websiteData.mainPage?.hero?.logo) ? "Set" : "Not Set"}`}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleApplyChanges}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 text-base font-semibold disabled:opacity-50"
              disabled={isSaving || Object.keys(pendingChanges).length === 0}
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
                <span>{isAr ? "تطبيق التغييرات" : "Apply Changes"}</span>
              )}
            </button>
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
                      {selectedSection.id === "hero" ? (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {isAr ? "الشعار الحالي" : "Current Logo"}
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                              {editedSection.logo ? (
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
                              ) : (
                                <p className="text-sm text-gray-500">
                                  {isAr ? "لا يوجد شعار" : "No logo set"}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {isAr ? "الصور الحالية" : "Current Images"}
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
                              {editedSection?.invalidImages?.map((invalid, index) => (
                                <div key={`invalid-${index}`} className="relative">
                                  <Image
                                    src={invalid.src}
                                    alt={`Invalid Image ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="w-full h-20 object-cover rounded-lg border-2 border-red-600"
                                  />
                                  <span className="absolute top-1 left-1 text-red-600 text-xs">
                                    {isAr ? "غير صالح" : "Invalid"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
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
                            {editedSection?.invalidImages?.map((invalid, index) => (
                              <div key={`invalid-${index}`} className="relative">
                                <Image
                                  src={invalid.src}
                                  alt={`Invalid Image ${index + 1}`}
                                  width={100}
                                  height={100}
                                  className="w-full h-20 object-cover rounded-lg border-2 border-red-600"
                                />
                                <span className="absolute top-1 left-1 text-red-600 text-xs">
                                  {isAr ? "غير صالح" : "Invalid"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => {
                        setSelectedSection(null);
                        setSelectedSubSection(null);
                        setEditedSection({ images: [], logo: null, videos: [], invalidImages: [] });
                        setNewVideoUrl("");
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-medium"
                      disabled={isSaving}
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      onClick={handleSaveSection}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium"
                      disabled={isSaving}
                    >
                      {isAr ? "حفظ مؤقتًا" : "Save Temporarily"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
          {showProgressModal && (
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
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-teal-200 text-center"
              >
                <h3 className="text-xl font-bold text-teal-900 mb-4">
                  {isSaving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "تم الحفظ!" : "Saved!")}
                </h3>
                {!saveCompleted && (
                  <motion.div
                    className="mb-4"
                    initial={{ width: 0 }}
                    animate={{ width: `${(saveProgress.completed / saveProgress.total) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${(saveProgress.completed / saveProgress.total) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                )}
                <p className={`text-sm ${progressMessage.includes("خطأ") || progressMessage.includes("Error") ? "text-red-600" : "text-gray-600"}`}>
                  {progressMessage || (
                    saveProgress.error ? (
                      <span className="text-red-600">
                        {isAr ? `خطأ: ${saveProgress.error}` : `Error: ${saveProgress.error}`}
                      </span>
                    ) : (
                      `${saveProgress.current} - ${Math.round((saveProgress.completed / saveProgress.total) * 100)}% ${isAr ? "مكتمل" : "Complete"}`
                    )
                  )}
                </p>
                {(saveCompleted || saveProgress.error) && (
                  <button
                    onClick={handleCloseProgressModal}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300"
                  >
                    {isAr ? "إغلاق" : "Close"}
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(UpdateHome);