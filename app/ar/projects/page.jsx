import { Suspense } from "react";
import ProjectsPage from "@/components/ProjectsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-gray-600 text-lg">Loading...</div>}>
      <ProjectsPage />
    </Suspense>
  );
}