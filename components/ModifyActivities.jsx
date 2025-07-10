"use client";
import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModifyActivities = ({ projectData, setProjectData, isAr, setView }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editedActivity, setEditedActivity] = useState(null);
  const [message, setMessage] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setEditedActivity({ ...activity });
  };

  const handleSave = async () => {
    if (!editedActivity || !editedActivity.images.length || editedActivity.images.every((img) => !img)) {
      setMessage(isAr ? "يجب الاحتفاظ بصورة واحدة على الأقل!" : "At least one image must remain!");
      return;
    }
    try {
      const activityToSave = {
        ...editedActivity,
        images: editedActivity.images.filter((img) => img),
      };

      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editedActivity.id, ...activityToSave }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update activity");
      }

      setProjectData((prev) => {
        const updatedData = { ...prev };
        Object.keys(updatedData).forEach((category) => {
          updatedData[category].projects = updatedData[category].projects.map((p) =>
            p.id === editedActivity.id ? activityToSave : p
          );
        });
        return updatedData;
      });
      setMessage(isAr ? "تم تحديث النشاط بنجاح!" : "Activity updated successfully!");
      setSelectedActivity(null);
      setEditedActivity(null);
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("Update error:", error.message);
      setMessage(isAr ? `حدث خطأ أثناء التحديث: ${error.message}` : `Error updating activity: ${error.message}`);
    }
  };

  const handleDeleteImage = (index) => {
    if (editedActivity.images.length <= 1) {
      setMessage(isAr ? "يجب الاحتفاظ بصورة واحدة على الأقل!" : "At least one image must remain!");
      return;
    }
    setEditedActivity((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleConfirmDelete = async () => {
    if (activityToDelete) {
      setIsDeleting(true);
      await handleDelete(activityToDelete);
      setShowConfirmDelete(false);
      setActivityToDelete(null);
      setIsDeleting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete activity");
      }
      setProjectData((prev) => {
        const updatedData = { ...prev };
        Object.keys(updatedData).forEach((category) => {
          updatedData[category].projects = updatedData[category].projects.filter((p) => p.id !== id);
        });
        return updatedData;
      });
      setMessage(isAr ? "تم حذف النشاط بنجاح!" : "Activity deleted successfully!");
    } catch (error) {
      setMessage(isAr ? `حدث خطأ أثناء الحذف: ${error.message}` : `Error deleting activity: ${error.message}`);
      console.error("Delete error:", error);
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
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(projectData).map(([category, { titleEn, titleAr, projects }]) =>
          projects.length > 0 && (
            <div key={category} className="bg-white rounded-xl shadow-md p-6 border border-teal-200">
              <h2 className="text-xl font-bold text-teal-900 mb-4">{isAr ? titleAr : titleEn}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 128, 128, 0.2)" }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:bg-teal-50 transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-teal-900">{isAr ? activity.titleAr : activity.titleEn}</h3>
                    <p className="text-sm text-gray-600 mt-1">{isAr ? activity.snippetAr : activity.snippetEn}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium"
                      >
                        {isAr ? "تعديل" : "Edit"}
                      </button>
                      <button
                        onClick={() => {
                          setActivityToDelete(activity.id);
                          setShowConfirmDelete(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 text-sm font-medium relative"
                        disabled={isDeleting}
                      >
                        {isDeleting && activityToDelete === activity.id ? (
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
                          <span>{isAr ? "حذف" : "Delete"}</span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      {selectedActivity && (
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
              <h3 className="text-xl font-bold text-teal-900 mb-4">{isAr ? "تعديل النشاط" : "Edit Activity"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title (English)</label>
                  <input
                    type="text"
                    value={editedActivity?.titleEn || ""}
                    onChange={(e) => setEditedActivity({ ...editedActivity, titleEn: e.target.value })}
                    className="w-full p-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title (Arabic)</label>
                  <input
                    type="text"
                    value={editedActivity?.titleAr || ""}
                    onChange={(e) => setEditedActivity({ ...editedActivity, titleAr: e.target.value })}
                    className="w-full p-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={editedActivity?.date || ""}
                    onChange={(e) => setEditedActivity({ ...editedActivity, date: e.target.value })}
                    className="w-full p-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue</label>
                  <input
                    type="text"
                    value={editedActivity?.venue || ""}
                    onChange={(e) => setEditedActivity({ ...editedActivity, venue: e.target.value })}
                    className="w-full p-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Snippet (English)</label>
                  <textarea
                    value={editedActivity?.snippetEn || ""}
                    onChange={(e) => setEditedActivity({ ...editedActivity, snippetEn: e.target.value })}
                    className="w-full p-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all h-20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Snippet (Arabic)</label>
                  <textarea
                    value={editedActivity?.snippetAr || ""}
                    onChange={(e) => setEditedActivity({ ...editedActivity, snippetAr: e.target.value })}
                    className="w-full p-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all h-20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {editedActivity?.images.map(
                      (image, index) =>
                        image && (
                          <div key={index} className="relative">
                            <img src={image} alt={`Image ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                            <button
                              onClick={() => handleDeleteImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 transition-all"
                            >
                              ✕
                            </button>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setSelectedActivity(null);
                    setEditedActivity(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-medium"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium"
                >
                  {isAr ? "حفظ" : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {showConfirmDelete && (
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
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-teal-200"
            >
              <h3 className="text-xl font-bold text-teal-900 mb-4">{isAr ? "تأكيد الحذف" : "Confirm Delete"}</h3>
              <p className="text-gray-600 mb-6">{isAr ? "هل أنت متأكد من حذف النشاط؟" : "Are you sure you want to delete the activity?"}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-medium"
                  disabled={isDeleting}
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 text-sm font-medium relative"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
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
                    <span>{isAr ? "حذف" : "Delete"}</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {showSuccess && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 bg-teal-600 text-white rounded-lg p-4 shadow-lg z-50"
          >
            {isAr ? "تم الحذف بنجاح!" : "Activity deleted successfully!"}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default memo(ModifyActivities);