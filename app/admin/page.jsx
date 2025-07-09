"use client";
import { useState, useEffect, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import AddActivity from "@/components/AddActivity";

function useActivityForm({ setView, projectData, setProjectData, setIsAdminLoggedIn }) {
  const pathname = usePathname();
  const isAr = pathname.startsWith("/ar");
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "food",
    titleEn: "",
    titleAr: "",
    date: "",
    venue: "",
    images: ["", "", "", "", ""],
    snippetEn: "",
    snippetAr: "",
  });
  const [message, setMessage] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (name.startsWith("image")) {
      const index = parseInt(dataset.index, 10);
      setFormData((prev) => ({
        ...prev,
        images: prev.images.map((img, i) => (i === index ? value : img)),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileInput = (e, index) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: prev.images.map((img, i) => (i === index ? reader.result : img)),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDragOverIndex(null);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: prev.images.map((img, i) => (i === index ? reader.result : img)),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => setDragOverIndex(null);

  const handleSubmit = async ({ formData, callback }) => {
    try {
      const newActivity = {
        id: Date.now().toString(),
        category: formData.category,
        titleEn: formData.titleEn,
        titleAr: formData.titleAr,
        date: formData.date,
        venue: formData.venue,
        snippetEn: formData.snippetEn,
        snippetAr: formData.snippetAr,
        images: formData.images,
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) throw new Error("Failed to save project");

      const data = await response.json();
      setProjectData({
        ...projectData,
        [formData.category]: {
          ...projectData[formData.category],
          projects: [...projectData[formData.category].projects, newActivity],
        },
      });

      setMessage(isAr ? "تمت إضافة النشاط بنجاح!" : "Activity added successfully!");
      setFormData({
        category: "food",
        titleEn: "",
        titleAr: "",
        date: "",
        venue: "",
        images: ["", "", "", "", ""],
        snippetEn: "",
        snippetAr: "",
      });
      setTimeout(() => setMessage(""), 5000);
      if (callback) callback(true);
    } catch (error) {
      console.error("Error submitting activity:", error);
      setMessage(isAr ? "حدث خطأ أثناء إضافة النشاط!" : "Error adding activity!");
    }
  };

  const handlePostSubmitAction = (action) => {
    if (action === "logout") {
      setIsAdminLoggedIn(false);
      router.push(isAr ? "/ar" : "/");
    } else {
      setView("manageSociety");
    }
  };

  return {
    formData,
    message,
    dragOverIndex,
    handleChange,
    handleFileInput,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit,
    setMessage,
    handlePostSubmitAction,
    isAr,
  };
}

const Dashboard = memo(({ setView, setMessage }) => (
  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
    {[
      { title: "Manage Society", description: "Oversee society activities and website content", onClick: () => setView("manageSociety") },
      { title: "Manage School", description: "Handle school-related operations", onClick: () => setMessage("Manage School: Feature coming soon!") },
      { title: "Manage Finance", description: "Track and manage financial records", onClick: () => setMessage("Manage Finance: Feature coming soon!") },
    ].map(({ title, description, onClick }, index) => (
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <h2 className="text-xl font-semibold text-emerald-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </motion.div>
    ))}
  </div>
));

const ManageSociety = memo(({ setView, setMessage }) => (
  <div className="flex-1 p-4">
    <button
      onClick={() => setView("dashboard")}
      className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all text-sm font-semibold"
    >
      Back to Dashboard
    </button>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { title: "Add New Activity", description: "Create a new society activity", onClick: () => setView("addActivity") },
        { title: "Update Website Pictures", description: "Manage website image content", onClick: () => setMessage("Update Website Pictures: Feature coming soon!") },
      ].map(({ title, description, onClick }, index) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer"
          onClick={onClick}
        >
          <h2 className="text-xl font-semibold text-emerald-800">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </motion.div>
      ))}
    </div>
  </div>
));

export default function AdminPortal() {
  const { projectData, setProjectData, isAdminLoggedIn, setIsAdminLoggedIn } = useAppContext();
  const [view, setView] = useState("dashboard");
  const router = useRouter();
  const {
    formData,
    message,
    dragOverIndex,
    handleChange,
    handleFileInput,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit,
    setMessage,
    handlePostSubmitAction,
    isAr,
  } = useActivityForm({
    setView,
    projectData,
    setProjectData,
    setIsAdminLoggedIn,
  });

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/admin/login");
    }
  }, [isAdminLoggedIn, router]);

  if (!isAdminLoggedIn) return null;

  const views = {
    dashboard: <Dashboard setView={setView} setMessage={setMessage} />,
    manageSociety: <ManageSociety setView={setView} setMessage={setMessage} />,
    addActivity: (
      <AddActivity
        setView={setView}
        formData={formData}
        message={message}
        dragOverIndex={dragOverIndex}
        handleChange={handleChange}
        handleFileInput={handleFileInput}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleSubmit={handleSubmit}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        handlePostSubmitAction={handlePostSubmitAction}
        isAr={isAr}
      />
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-start justify-center p-2 pt-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-4 w-full max-w-7xl h-[calc(90vh-4rem)] flex flex-col">
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-2">Admin Portal</h1>
        {message && view !== "addActivity" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-emerald-600 text-sm text-center mb-4 cursor-pointer"
            onClick={() => setMessage("")}
          >
            {message} (Click to dismiss)
          </motion.p>
        )}
        {views[view]}
      </div>
    </motion.div>
  );
}