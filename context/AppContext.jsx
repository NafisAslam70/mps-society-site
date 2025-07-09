"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [projectData, setProjectData] = useState({
    food: { titleEn: "Food Distribution", titleAr: "توزيع الطعام", projects: [] },
    education: { titleEn: "Education Initiatives", titleAr: "مبادرات التعليم", projects: [] },
    handpumps: { titleEn: "Handpump Installations", titleAr: "تركيب المضخات اليدوية", projects: [] },
    wells: { titleEn: "Well Construction", titleAr: "بناء الآبار", projects: [] },
    mosques: { titleEn: "Mosque Projects", titleAr: "مشاريع المساجد", projects: [] },
    general: { titleEn: "General Initiatives", titleAr: "مبادرات عامة", projects: [] },
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Load from localStorage only on the client side
    const savedProjectData = localStorage.getItem("projectData");
    if (savedProjectData) {
      setProjectData(JSON.parse(savedProjectData));
    }
    const savedIsAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (savedIsAdminLoggedIn !== isAdminLoggedIn) {
      setIsAdminLoggedIn(savedIsAdminLoggedIn);
    }
  }, []);

  useEffect(() => {
    // Persist to localStorage whenever state changes
    localStorage.setItem("projectData", JSON.stringify(projectData));
    localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);
  }, [projectData, isAdminLoggedIn]);

  return (
    <AppContext.Provider value={{ projectData, setProjectData, isAdminLoggedIn, setIsAdminLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);