import HeroSection       from "@/components/HeroSection";
import RecentActivities  from "@/components/RecentActivities";
import GreenButtonsStrip from "@/components/GreenButtonsStrip";
import MeedEducationSlider  from "@/components/MeedEducationSlider";
import WorksOnGrid       from "@/components/WorksOnGrid";
import VideoGallery      from "@/components/VideoGallery";
import ImpactStats       from "@/components/ImpactStats";
import AboutStrip        from "@/components/AboutStrip";  


export default function ArabicHome() {
  return (
    <main dir="rtl">
      <HeroSection />
      <AboutStrip />   
      <RecentActivities />
      <GreenButtonsStrip />
      <ImpactStats />
      <MeedEducationSlider />
   
      <VideoGallery />
      
      {/* <VisitorCarousel /> */}
      {/* <CallToAction /> */}
    </main>
  );
}
