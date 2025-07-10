"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isAdminLoggedIn") === "true";
    }
    return false;
  });
  const [projectData, setProjectData] = useState({
    food: {
      titleEn: "Food Distribution",
      titleAr: "توزيع الطعام",
      descriptionEn: "Providing food aid to needy communities.",
      descriptionAr: "تقديم المساعدات الغذائية للمجتمعات المحتاجة.",
      projects: [],
    },
    education: {
      titleEn: "Education Initiatives",
      titleAr: "مبادرات التعليم",
      descriptionEn: "Supporting education for underprivileged children.",
      descriptionAr: "دعم التعليم للأطفال المحرومين.",
      projects: [],
    },
    handpumps: {
      titleEn: "Handpump Installations",
      titleAr: "تركيب المضخات اليدوية",
      descriptionEn: "Ensuring access to clean water.",
      descriptionAr: "ضمان الوصول إلى المياه النظيفة.",
      projects: [],
    },
    wells: {
      titleEn: "Well Construction",
      titleAr: "بناء الآبار",
      descriptionEn: "Building sustainable water sources.",
      descriptionAr: "بناء مصادر ماء مستدامة.",
      projects: [],
    },
    mosques: {
      titleEn: "Mosque Projects",
      titleAr: "مشاريع المساجد",
      descriptionEn: "Supporting community worship spaces.",
      descriptionAr: "دعم أماكن العبادة المجتمعية.",
      projects: [],
    },
    general: {
      titleEn: "General Initiatives",
      titleAr: "مبادرات عامة",
      descriptionEn: "Various community development efforts.",
      descriptionAr: "جهود تنموية مجتمعية متنوعة.",
      projects: [],
    },
  });
  const [websiteData, setWebsiteData] = useState({
    hero: { images: [], logo: null },
    about: { image: null },
    education: {
      academics: { images: [] },
      sports: { images: [] },
      hostel: { images: [] },
      mosque: { images: [] },
      islamicEducation: { images: [] },
    },
    video: { videos: [] },
  });
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectFetchError, setProjectFetchError] = useState(null);
  const [isLoadingWebsiteData, setIsLoadingWebsiteData] = useState(true);
  const [websiteFetchError, setWebsiteFetchError] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn.toString());
  }, [isAdminLoggedIn]);

  const fetchWithTimeout = async (url, options, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const fetchProjects = useCallback(async (retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Fetching projects (attempt ${attempt})...`);
        setIsLoadingProjects(true);
        const response = await fetchWithTimeout("/api/projects", {}, 10000);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Empty project data received");
        }
        console.log("Fetched project data:", data);
        setProjectData(data);
        setProjectFetchError(null);
        return true;
      } catch (error) {
        console.error(`Fetch attempt ${attempt} failed:`, error);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        setProjectFetchError(error.message);
        return false;
      } finally {
        setIsLoadingProjects(false);
      }
    }
  }, []);

  const fetchWebsiteData = useCallback(async (retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Fetching website data (attempt ${attempt})...`);
        setIsLoadingWebsiteData(true);
        const response = await fetchWithTimeout("/api/website-images", {}, 10000);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Empty website data received");
        }
        console.log("Fetched website data:", data);
        setWebsiteData(data);
        setWebsiteFetchError(null);
        return true;
      } catch (error) {
        console.error(`Fetch attempt ${attempt} failed:`, error);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        setWebsiteFetchError(error.message);
        return false;
      } finally {
        setIsLoadingWebsiteData(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchWebsiteData();
  }, [fetchProjects, fetchWebsiteData]);

  const refreshProjects = useCallback(() => {
    console.log("Refreshing projects...");
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (isAdminLoggedIn && pathname !== "/admin") {
      console.log("Redirecting logged-in admin to /admin from:", pathname);
      router.replace("/admin");
    } else if (!isAdminLoggedIn && pathname === "/admin") {
      console.log("Redirecting non-logged-in user to /admin/login from:", pathname);
      router.replace("/admin/login");
    }
  }, [isAdminLoggedIn, pathname, router]);

  return (
    <AppContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        projectData,
        setProjectData,
        websiteData,
        setWebsiteData,
        isLoadingProjects,
        projectFetchError,
        isLoadingWebsiteData,
        websiteFetchError,
        refreshProjects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);