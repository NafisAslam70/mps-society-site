"use client";
import { useState, useEffect, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import AddActivity from "@/components/AddActivity";
import ModifyActivities from "@/components/ModifyActivities";
import UpdateHome from "@/components/UpdateHome";

function useActivityForm({ setView, projectData, setProjectData, setIsAdminLoggedIn, refreshProjects }) {
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
    const { name, value } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: value.slice(0, 5),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - formData.images.filter((img) => img).length);
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
    const files = Array.from(e.dataTransfer.files).slice(0, 5 - formData.images.filter((img) => img).length);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOverIndex(-1);
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
        images: formData.images.filter((img) => img),
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
      if (typeof refreshProjects === "function") {
        console.log("Calling refreshProjects...");
        refreshProjects();
      } else {
        console.error("refreshProjects is not a function:", refreshProjects);
      }
      if (callback) callback(true);
    } catch (error) {
      console.error("Error submitting activity:", error);
      setMessage(isAr ? "حدث خطأ أثناء إضافة النشاط!" : "Error adding activity!");
    }
  };

  const handlePostSubmitAction = (action) => {
    if (action === "logout") {
      setView("dashboard");
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
  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
    {[
      {
        title: "Manage Society",
        description: "Oversee society activities and website content",
        onClick: () => setView("manageSociety"),
        icon: (
          <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5m-2-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        title: "Manage School",
        description: "Handle school-related operations",
        onClick: () => setMessage("Manage School: Feature coming soon!"),
        icon: (
          <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        ),
      },
      {
        title: "Manage Finance",
        description: "Track and manage financial records",
        onClick: () => setMessage("Manage Finance: Feature coming soon!"),
        icon: (
          <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ].map(({ title, description, onClick, icon }, index) => (
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 128, 128, 0.2)" }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:bg-teal-50 transition-all duration-300 cursor-pointer border border-teal-200"
        onClick={onClick}
      >
        <div className="mb-4">{icon}</div>
        <h2 className="text-xl font-bold text-teal-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 text-center">{description}</p>
      </motion.div>
    ))}
  </div>
));

const ManageSociety = memo(({ setView, setMessage }) => (
  <div className="flex-1 p-6">
    <button
      onClick={() => setView("dashboard")}
      className="mb-6 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:shadow-lg transition-all duration-300 text-sm font-semibold"
    >
      Back to Dashboard
    </button>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          title: "Add New Activity",
          description: "Create a new society activity",
          onClick: () => setView("addActivity"),
        },
        {
          title: "Modify Existing Activities",
          description: "Edit or delete existing activities",
          onClick: () => setView("modifyActivities"),
        },
        {
          title: "Post an Announcement",
          description: "Share updates on the homepage (coming soon)",
          onClick: () => setMessage("Post an Announcement: Feature coming soon!"),
        },
        {
          title: "Update Website Pictures",
          description: "Manage website image content",
          onClick: () => setView("updateHome"),
        },
      ].map(({ title, description, onClick }, index) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 128, 128, 0.2)" }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:bg-teal-50 transition-all duration-300 cursor-pointer border border-teal-200"
          onClick={onClick}
        >
          <h2 className="text-xl font-bold text-teal-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-600 text-center">{description}</p>
        </motion.div>
      ))}
    </div>
  </div>
));

export default function AdminPortal() {
  const { projectData, setProjectData, isAdminLoggedIn, setIsAdminLoggedIn, refreshProjects, websiteData, setWebsiteData } = useAppContext();
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
    refreshProjects: refreshProjects || (() => {}),
  });

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.replace("/admin/login");
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
        router={router}
      />
    ),
    modifyActivities: <ModifyActivities projectData={projectData} setProjectData={setProjectData} isAr={isAr} setView={setView} />,
    updateHome: <UpdateHome websiteData={websiteData} setWebsiteData={setWebsiteData} setView={setView} isAr={isAr} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-7xl h-[calc(90vh-4rem)] flex flex-col">
        <h1 className="text-3xl font-bold text-center text-teal-900 mb-4">{isAr ? "لوحة تحكم المشرف" : "Admin Portal"}</h1>
        {message && view !== "addActivity" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-teal-600 text-sm text-center mb-4 bg-teal-50 rounded-lg py-2 px-4"
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