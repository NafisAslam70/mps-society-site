import { motion } from "framer-motion";
import { memo, useState } from "react";

const AddActivity = memo(({ setView, formData, message, dragOverIndex, handleChange, handleFileInput, handleDrop, handleDragOver, handleDragLeave, handleSubmit, setIsAdminLoggedIn, handlePostSubmitAction, isAr }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.titleAr || !formData.date || !formData.venue || !formData.snippetEn || !formData.snippetAr || !formData.images[0]) {
      handleChange({ target: { name: "message", value: isAr ? "يرجى ملء جميع الحقول المطلوبة!" : "Please fill all required fields!" } });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    handleSubmit({
      formData,
      callback: (success) => {
        if (success) {
          setShowConfirmation(false);
        }
      },
    });
  };

  const handleClearImage = (index) => {
    handleChange({ target: { name: `image${index + 1}`, value: "", dataset: { index } } });
  };

  const categoryLabels = {
    food: isAr ? "توزيع الطعام" : "Food Distribution",
    education: isAr ? "مبادرات التعليم" : "Education Initiatives",
    handpumps: isAr ? "تركيب المضخات اليدوية" : "Handpump Installations",
    wells: isAr ? "بناء الآبار" : "Well Construction",
    mosques: isAr ? "مشاريع المساجد" : "Mosque Projects",
    general: isAr ? "مبادرات عامة" : "General Initiatives",
  };

  return (
    <div className="flex-1 p-6">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setView("manageSociety")}
        className="mb-6 px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-semibold shadow-md"
      >
        {isAr ? "← العودة إلى إدارة الجمعية" : "← Back to Manage Society"}
      </motion.button>
      {showConfirmation ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-bold text-emerald-800 mb-4">{isAr ? "تأكيد النشاط" : "Confirm Activity"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">{isAr ? "الفئة" : "Category"}:</label>
              <p className="text-sm text-gray-600">{categoryLabels[formData.category]}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}:</label>
              <p className="text-sm text-gray-600">{formData.titleEn}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">{isAr ? "العنوان (عربي)" : "Title (Arabic)"}:</label>
              <p className="text-sm text-gray-600">{formData.titleAr}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">{isAr ? "التاريخ" : "Date"}:</label>
              <p className="text-sm text-gray-600">{formData.date}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">{isAr ? "الموقع" : "Venue"}:</label>
              <p className="text-sm text-gray-600">{formData.venue}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">{isAr ? "الصور" : "Images"}:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                {formData.images.map((image, index) => image && (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">{isAr ? "الوصف (إنجليزي)" : "Snippet (English)"}:</label>
              <p className="text-sm text-gray-600">{formData.snippetEn}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">{isAr ? "الوصف (عربي)" : "Snippet (Arabic)"}:</label>
              <p className="text-sm text-gray-600">{formData.snippetAr}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 font-semibold text-base shadow-md"
            >
              {isAr ? "تأكيد" : "Confirm"}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md text-center"
            >
              {message}
            </motion.div>
          )}
          {message && !message.includes("fill") && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => handlePostSubmitAction("logout")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-base shadow-md"
              >
                {isAr ? "عرض المشاريع وتسجيل الخروج" : "View Projects & Logout"}
              </button>
              <button
                type="button"
                onClick={() => handlePostSubmitAction("manageSociety")}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold text-base shadow-md"
              >
                {isAr ? "العودة إلى إدارة الجمعية" : "Back to Manage Society"}
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-bold text-emerald-800">{isAr ? "تفاصيل النشاط" : "Activity Details"}</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "الفئة" : "Category"}</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-2.5 px-4 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                required
              >
                {[
                  { value: "food", label: isAr ? "توزيع الطعام" : "Food Distribution" },
                  { value: "education", label: isAr ? "مبادرات التعليم" : "Education Initiatives" },
                  { value: "handpumps", label: isAr ? "تركيب المضخات اليدوية" : "Handpump Installations" },
                  { value: "wells", label: isAr ? "بناء الآبار" : "Well Construction" },
                  { value: "mosques", label: isAr ? "مشاريع المساجد" : "Mosque Projects" },
                  { value: "general", label: isAr ? "مبادرات عامة" : "General Initiatives" },
                ].map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            {[
              { name: "titleEn", label: isAr ? "العنوان (إنجليزي)" : "Title (English)", type: "text", placeholder: isAr ? "أدخل العنوان بالإنجليزية" : "Enter title in English" },
              { name: "titleAr", label: isAr ? "العنوان (عربي)" : "Title (Arabic)", type: "text", placeholder: isAr ? "أدخل العنوان بالعربية" : "Enter title in Arabic" },
              { name: "date", label: isAr ? "التاريخ" : "Date", type: "date", placeholder: isAr ? "اختر التاريخ" : "Select date" },
              { name: "venue", label: isAr ? "الموقع" : "Venue", type: "text", placeholder: isAr ? "أدخل موقع الحدث" : "Enter venue location" },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-4 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                  required
                />
              </div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2 space-y-4 bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-bold text-emerald-800">{isAr ? "الصور والوصف" : "Images & Descriptions"}</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isAr ? "الصور (حتى 5 صور)" : "Images (Up to 5 Images)"}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative p-2 border-2 border-dashed rounded-lg h-32 flex items-center justify-center transition-all ${
                      dragOverIndex === index ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
                    }`}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                  >
                    {image ? (
                      <div className="relative w-full h-full">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleClearImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-1 hover:bg-red-600 transition-all"
                          title={isAr ? "مسح الصورة" : "Clear image"}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 text-center">{isAr ? "اسحب أو انقر لإضافة صورة" : "Drag or click to add image"}</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileInput(e, index)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">{isAr ? "اسحب الصور أو انقر لتحميلها (حتى 5 صور)" : "Drag and drop images or click to upload (up to 5 images)"}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "snippetEn", label: isAr ? "الوصف (إنجليزي)" : "Snippet (English)", placeholder: isAr ? "وصف موجز بالإنجليزية" : "Brief description in English" },
                { name: "snippetAr", label: isAr ? "الوصف (عربي)" : "Snippet (Arabic)", placeholder: isAr ? "وصف موجز بالعربية" : "Brief description in Arabic" },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-4 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm h-32 resize-y"
                    required
                  />
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-3 flex flex-col items-center mt-4"
          >
            <button
              type="submit"
              className="w-full md:w-1/3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg"
            >
              {isAr ? "إضافة النشاط" : "Add Activity"}
            </button>
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md text-center"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </form>
      )}
    </div>
  );
});

export default AddActivity;