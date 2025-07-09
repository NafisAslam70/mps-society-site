"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const initialProjectData = {
    food: { titleEn: "Food Distribution", titleAr: "توزيع الطعام", projects: [] },
    education: { titleEn: "Education Initiatives", titleAr: "مبادرات التعليم", projects: [] },
    handpumps: { titleEn: "Handpump Installations", titleAr: "تركيب المضخات اليدوية", projects: [] },
    wells: { titleEn: "Well Construction", titleAr: "بناء الآبار", projects: [] },
    mosques: { titleEn: "Mosque Projects", titleAr: "مشاريع المساجد", projects: [] },
    general: { titleEn: "General Initiatives", titleAr: "مبادرات عامة", projects: [] },
  };

  const [projectData, setProjectData] = useState(initialProjectData);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setProjectData(data);
      } catch (error) {
        console.error("Fetch error:", error.message);
        setProjectData(initialProjectData);
      }
    };

    if (typeof window !== "undefined") {
      const savedIsAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
      setIsAdminLoggedIn(savedIsAdminLoggedIn);
    }

    loadProjects();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);
      } catch (error) {
        console.error("Error saving isAdminLoggedIn to localStorage:", error);
      }
    }
  }, [isAdminLoggedIn]);

  return (
    <AppContext.Provider value={{ projectData, setProjectData, isAdminLoggedIn, setIsAdminLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);