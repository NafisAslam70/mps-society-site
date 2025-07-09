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
    // Load from localStorage only on client-side mount
    if (typeof window !== "undefined") {
      try {
        const savedProjectData = localStorage.getItem("projectData");
        if (savedProjectData) {
          const parsedData = JSON.parse(savedProjectData);
          // Merge with initialProjectData to ensure all categories exist
          setProjectData({
            ...initialProjectData,
            food: { ...initialProjectData.food, projects: parsedData.food?.projects || [] },
            education: { ...initialProjectData.education, projects: parsedData.education?.projects || [] },
            handpumps: { ...initialProjectData.handpumps, projects: parsedData.handpumps?.projects || [] },
            wells: { ...initialProjectData.wells, projects: parsedData.wells?.projects || [] },
            mosques: { ...initialProjectData.mosques, projects: parsedData.mosques?.projects || [] },
            general: { ...initialProjectData.general, projects: parsedData.general?.projects || [] },
          });
        }
        const savedIsAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
        setIsAdminLoggedIn(savedIsAdminLoggedIn);
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        // Fallback to initial state if parsing fails
        setProjectData(initialProjectData);
        setIsAdminLoggedIn(false);
      }
    }
  }, []);

  useEffect(() => {
    // Persist to localStorage whenever state changes
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("projectData", JSON.stringify(projectData));
        localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  }, [projectData, isAdminLoggedIn]);

  return (
    <AppContext.Provider value={{ projectData, setProjectData, isAdminLoggedIn, setIsAdminLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);