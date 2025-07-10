"use client";
import { motion } from "framer-motion";
import { memo, useState } from "react";

const AddActivity = memo(({ setView, formData, message, dragOverIndex, handleChange, handleFileInput, handleDrop, handleDragOver, handleDragLeave, handleSubmit, setIsAdminLoggedIn, handlePostSubmitAction, isAr, router }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
    handleChange({ target: { name: "images", value: formData.images.map((img, i) => i === index ? "" : img) } });
  };

  const handleMultiFileInput = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - formData.images.filter(img => img).length); // Limit to 5 total
    if (files.length === 0) return;
    const readers = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((results) => {
      const newImages = [...formData.images];
      results.forEach((result) => {
        const emptyIndex = newImages.indexOf("");
        if (emptyIndex !== -1) newImages[emptyIndex] = result;
      });
      handleChange({ target: { name: "images", value: newImages } });
    });
  };

  const categoryLabels = {
    food: { ar: "توزيع الطعام", en: "Food Distribution" },
    education: { ar: "مبادرات التعليم", en: "Education Initiatives" },
    handpumps: { ar: "تركيب المضخات اليدوية", en: "Handpump Installations" },
    wells: { ar: "بناء الآبار", en: "Well Construction" },
    mosques: { ar: "مشاريع المساجد", en: "Mosque Projects" },
    general: { ar: "مبادرات عامة", en: "General Initiatives" },
  };

  return (
    <div className="flex-1 p-0 overflow-auto">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setView("manageSociety")}
        className="mb-6 px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-semibold shadow-md"
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
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">{isAr ? "نجاح!" : "Success!"}</h3>
            <p className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded-md text-center mb-4">
              {message}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  handlePostSubmitAction("logout");
                  router.push(isAr ? "/ar/projects" : "/projects"); // Use passed router prop
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-base shadow-md"
              >
                {isAr ? "عرض المشاريع وتسجيل الخروج" : "View Projects & Logout"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  handlePostSubmitAction("manageSociety");
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold text-base shadow-md"
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
          className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[calc(90vh-8rem)] overflow-auto"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-emerald-800">{isAr ? "تأكيد النشاط" : "Confirm Activity"}</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "الفئة" : "Category"}:</label>
              <p className="text-sm text-gray-600">{categoryLabels[formData.category][isAr ? "ar" : "en"]}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}:</label>
              <p className="text-sm text-gray-600">{formData.titleEn}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "العنوان (عربي)" : "Title (Arabic)"}:</label>
              <p className="text-sm text-gray-600">{formData.titleAr}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "التاريخ" : "Date"}:</label>
              <p className="text-sm text-gray-600">{formData.date}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "الموقع" : "Venue"}:</label>
              <p className="text-sm text-gray-600">{formData.venue}</p>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "الصور" : "Images"}:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {formData.images.map((image, index) => image && (
                  <div key={index} className="relative">
                    <img src={image} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => handleClearImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "الوصف (إنجليزي)" : "Snippet (English)"}:</label>
              <p className="text-sm text-gray-600">{formData.snippetEn}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "الوصف (عربي)" : "Snippet (Arabic)"}:</label>
              <p className="text-sm text-gray-600">{formData.snippetAr}</p>
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-semibold text-base shadow-md transition-all duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800"}`}
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
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold text-base shadow-md"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
          </div>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md text-center lg:col-span-3"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      ) : (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-white rounded-xl shadow-lg">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">{isAr ? "تفاصيل النشاط" : "Activity Details"}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">{isAr ? "الفئة" : "Category"}</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
              <label className="block text-sm font-medium text-gray-700">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                placeholder={isAr ? "أدخل العنوان بالإنجليزية" : "Enter title in English"}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label>
              <input
                type="text"
                name="titleAr"
                value={formData.titleAr}
                onChange={handleChange}
                placeholder={isAr ? "أدخل العنوان بالعربية" : "Enter title in Arabic"}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{isAr ? "التاريخ" : "Date"}</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{isAr ? "الموقع" : "Venue"}</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder={isAr ? "أدخل موقع الحدث" : "Enter venue location"}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">{isAr ? "الصور والوصف" : "Images & Descriptions"}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">{isAr ? "رفع الصور (حتى 5 صور)" : "Upload Images (up to 5)"}</label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiFileInput}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="relative">
                      {formData.images[index] ? (
                        <>
                          <img src={formData.images[index]} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => handleClearImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">{isAr ? "الوصف (إنجليزي)" : "Snippet (English)"}</label>
                <textarea
                  name="snippetEn"
                  value={formData.snippetEn}
                  onChange={handleChange}
                  placeholder={isAr ? "وصف موجز بالإنجليزية" : "Brief description in English"}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 h-24 resize-y"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{isAr ? "الوصف (عربي)" : "Snippet (Arabic)"}</label>
                <textarea
                  name="snippetAr"
                  value={formData.snippetAr}
                  onChange={handleChange}
                  placeholder={isAr ? "وصف موجز بالعربية" : "Brief description in Arabic"}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 h-24 resize-y"
                  required
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              {isAr ? "إضافة النشاط" : "Add Activity"}
            </button>
          </div>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md text-center col-span-full"
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