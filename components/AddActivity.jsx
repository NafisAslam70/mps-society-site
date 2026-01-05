"use client";
import { motion } from "framer-motion";
import { memo, useState } from "react";

const AddActivity = memo(({ setView, formData, message = "", dragOverIndex, handleChange, handleFileInput, handleDrop, handleDragOver, handleDragLeave, handleSubmit, setIsAdminLoggedIn, handlePostSubmitAction, isAr, router }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [translateLoading, setTranslateLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.titleAr || !formData.date || !formData.venue || !formData.snippetEn || !formData.snippetAr || formData.images.filter(img => img).length === 0) {
      handleChange({ target: { name: "message", value: isAr ? "يرجى ملء جميع الحقول المطلوبة وإضافة صورة واحدة على الأقل!" : "Please fill all required fields and add at least one image!" } });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setLoading(true);
    handleSubmit({
      formData,
      callback: (success) => {
        setLoading(false);
        if (success) {
          setShowConfirmation(false);
          setShowSuccessModal(true);
        }
      },
    });
  };

  const handleClearImage = (index) => {
    setImageError("");
    handleChange({ target: { name: "images", value: formData.images.map((img, i) => i === index ? "" : img) } });
  };

  const handleMultiFileInput = async (e) => {
    const currentImageCount = formData.images.filter(img => img).length;
    const files = Array.from(e.target.files).slice(0, 5 - currentImageCount);
    if (files.length === 0) {
      if (e.target.files.length > 0) {
        setImageError(isAr ? "لا يمكن إضافة أكثر من 5 صور!" : "Cannot add more than 5 images!");
      }
      return;
    }
    // Validate image size (e.g., <1MB per image)
    for (const file of files) {
      if (file.size > 1 * 1024 * 1024) {
        setImageError(isAr ? "حجم الصورة كبير جدًا (الحد الأقصى 1 ميغابايت لكل صورة)!" : "Image size too large (max 1MB per image)!");
        return;
      }
    }
    setImageError("");
    const imageUrls = [...formData.images];
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", formData.category);
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Image upload failed");
        }
        const emptyIndex = imageUrls.indexOf("");
        if (emptyIndex !== -1) {
          imageUrls[emptyIndex] = data.secure_url;
        }
      } catch (error) {
        setImageError(isAr ? "فشل رفع الصورة: " + error.message : "Image upload failed: " + error.message);
        return;
      }
    }
    handleChange({ target: { name: "images", value: imageUrls } });
  };

  const handleTranslate = async () => {
    setTranslateLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: { title: language === "en" ? formData.titleEn : formData.titleAr, snippet: language === "en" ? formData.snippetEn : formData.snippetAr },
          sourceLang: language,
          targetLang: language === "en" ? "ar" : "en",
        }),
      });
      const data = await response.json();
      if (data.success) {
        handleChange({
          target: {
            name: language === "en" ? "titleAr" : "titleEn",
            value: data.translated.title,
          },
        });
        handleChange({
          target: {
            name: language === "en" ? "snippetAr" : "snippetEn",
            value: data.translated.snippet,
          },
        });
      } else {
        handleChange({
          target: {
            name: "message",
            value: isAr ? "فشل الترجمة: " + (data.error || "حاول مرة أخرى!") : "Translation failed: " + (data.error || "Try again!"),
          },
        });
      }
    } catch (error) {
      handleChange({
        target: {
          name: "message",
          value: isAr ? "خطأ في الترجمة: تحقق من الاتصال!" : "Translation error: Check connection!",
        },
      });
    }
    setTranslateLoading(false);
  };

  const categoryLabels = {
    food: { ar: "توزيع الطعام", en: "Food Distribution" },
    ramadan: { ar: "توزيعات رمضان", en: "Ramadan Distributions" },
    waterTanks: { ar: "خزانات المياه", en: "Water Tanks" },
    education: { ar: "مبادرات التعليم", en: "Education Initiatives" },
    handpumps: { ar: "تركيب المضخات اليدوية", en: "Handpump Installations" },
    wells: { ar: "بناء الآبار", en: "Well Construction" },
    mosques: { ar: "مشاريع المساجد", en: "Mosque Projects" },
    general: { ar: "مبادرات عامة", en: "General Initiatives" },
  };

  return (
    <div className="flex-1 w-full h-full overflow-auto">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setView("manageSociety")}
        className="mb-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium shadow-md"
      >
        {isAr ? "← العودة إلى إدارة الجمعية" : "← Back to Manage Society"}
      </motion.button>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-teal-900 mb-4">{isAr ? "نجاح!" : "Success!"}</h3>
            <p className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-md text-center mb-4">
              {message || (isAr ? "تمت الإضافة بنجاح!" : "Added successfully!")}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  handlePostSubmitAction("logout");
                  router.push(isAr ? "/ar/projects" : "/projects");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-sm shadow-md"
              >
                {isAr ? "عرض المشاريع وتسجيل الخروج" : "View Projects & Logout"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  handlePostSubmitAction("manageSociety");
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium text-sm shadow-md"
              >
                {isAr ? "العودة إلى إدارة الجمعية" : "Back to Manage Society"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {showConfirmation ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 w-full h-full overflow-auto"
        >
          <h3 className="text-lg font-semibold text-teal-900 mb-4">{isAr ? "تأكيد النشاط" : "Confirm Activity"}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الفئة" : "Category"}:</label>
                <p className="text-sm text-gray-600">{categoryLabels[formData.category][isAr ? "ar" : "en"]}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}:</label>
                <p className="text-sm text-gray-600">{formData.titleEn}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "العنوان (عربي)" : "Title (Arabic)"}:</label>
                <p className="text-sm text-gray-600">{formData.titleAr}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "التاريخ" : "Date"}:</label>
                <p className="text-sm text-gray-600">{formData.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الموقع" : "Venue"}:</label>
                <p className="text-sm text-gray-600">{formData.venue}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الصور" : "Images"}:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.images.map((image, index) => image && (
                    <div key={index} className="relative">
                      <img src={image} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md shadow-md" />
                      <button
                        type="button"
                        onClick={() => handleClearImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all duration-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الوصف (إنجليزي)" : "Snippet (English)"}:</label>
                <p className="text-sm text-gray-600">{formData.snippetEn}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الوصف (عربي)" : "Snippet (Arabic)"}:</label>
                <p className="text-sm text-gray-600">{formData.snippetAr}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-medium text-sm shadow-md transition-all duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isAr ? "جارٍ الحفظ..." : "Saving..."}
                </span>
              ) : isAr ? "تأكيد" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium text-sm shadow-md"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
          </div>
          {message && message.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md text-center"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      ) : (
        <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full h-full overflow-auto">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">{isAr ? "إضافة نشاط جديد" : "Add New Activity"}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الفئة" : "Category"}</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    required
                  >
                    {Object.keys(categoryLabels).map((value) => (
                      <option key={value} value={value}>
                        {isAr ? categoryLabels[value].ar : categoryLabels[value].en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "لغة الإدخال" : "Input Language"}</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLanguage("en")}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${language === "en" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                    >
                      {isAr ? "إنجليزي" : "English"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage("ar")}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${language === "ar" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                    >
                      {isAr ? "عربي" : "Arabic"}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
                <input
                  type="text"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleChange}
                  placeholder={isAr ? "أدخل العنوان بالإنجليزية" : "Enter title in English"}
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${language === "ar" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={language === "ar"}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الوصف (إنجليزي)" : "Snippet (English)"}</label>
                <textarea
                  name="snippetEn"
                  value={formData.snippetEn}
                  onChange={handleChange}
                  placeholder={isAr ? "وصف موجز بالإنجليزية" : "Brief description in English"}
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-24 resize-y transition-all duration-200 ${language === "ar" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={language === "ar"}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label>
                <input
                  type="text"
                  name="titleAr"
                  value={formData.titleAr}
                  onChange={handleChange}
                  placeholder={isAr ? "أدخل العنوان بالعربية" : "Enter title in Arabic"}
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${language === "en" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={language === "en"}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الوصف (عربي)" : "Snippet (Arabic)"}</label>
                <textarea
                  name="snippetAr"
                  value={formData.snippetAr}
                  onChange={handleChange}
                  placeholder={isAr ? "وصف موجز بالعربية" : "Brief description in Arabic"}
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-24 resize-y transition-all duration-200 ${language === "en" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={language === "en"}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "التاريخ" : "Date"}</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "الموقع" : "Venue"}</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder={isAr ? "أدخل موقع الحدث" : "Enter venue location"}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={translateLoading || !formData[language === "en" ? "titleEn" : "titleAr"] || !formData[language === "en" ? "snippetEn" : "snippetAr"]}
                  className={`w-full sm:w-64 px-6 py-2 rounded-lg text-white font-medium text-sm shadow-md transition-all duration-300 ${translateLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"}`}
                >
                  {translateLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {isAr ? "جارٍ الترجمة..." : "Translating..."}
                    </span>
                  ) : isAr ? `ترجمة إلى ${language === "en" ? "العربية" : "الإنجليزية"}` : `Translate to ${language === "en" ? "Arabic" : "English"}`}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "رفع الصور (حتى 5 صور)" : "Upload Images (up to 5)"}</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultiFileInput}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              disabled={formData.images.filter(img => img).length >= 5}
            />
            {imageError && (
              <p className="mt-2 text-sm text-red-600">{imageError}</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="relative">
                  {formData.images[index] ? (
                    <>
                      <img src={formData.images[index]} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md shadow-md" />
                      <button
                        type="button"
                        onClick={() => handleClearImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all duration-200"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
                      {isAr ? "لا توجد صورة" : "No Image"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full sm:w-64 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg"
            >
              {isAr ? "إضافة النشاط" : "Add Activity"}
            </button>
          </div>
          {message && message.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md text-center"
            >
              {message}
            </motion.p>
          )}
        </form>
      )}
    </div>
  );
});

export default AddActivity;
