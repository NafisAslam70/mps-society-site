import HeroSection       from "@/components/HeroSection";
import RecentActivities  from "@/components/RecentActivities";
import GreenButtonsStrip from "@/components/GreenButtonsStrip";
import ActivitiesSlider  from "@/components/ActivitiesSlider";
import WorksOnGrid       from "@/components/WorksOnGrid";
import VideoGallery      from "@/components/VideoGallery";
import ImpactStats       from "@/components/ImpactStats";
import VisitorCarousel   from "@/components/VisitorCarousel";
import CallToAction      from "@/components/CallToAction";
import AboutStrip        from "@/components/AboutStrip";  
import MeedEducationTemplate from "@/components/MeedEducationTemplate";

export default function ArabicHome() {
  return (
    <main dir="rtl">
      <HeroSection />
      <AboutStrip />   
      <RecentActivities />
      <GreenButtonsStrip />
      <ImpactStats />
      <ActivitiesSlider />
   
      <VideoGallery />
      
      {/* <VisitorCarousel /> */}
      {/* <CallToAction /> */}
    </main>
  );
}
