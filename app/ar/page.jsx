// ------------------------------
// app/ar/page.jsx  (Arabic Home FINAL order)
// ------------------------------
"use client"
import HeroSection       from "@/components/HeroSection";
import RecentActivities  from "@/components/RecentActivities";
import GreenButtonsStrip from "@/components/GreenButtonsStrip";
import MeedEducationSlider  from "@/components/MeedEducationSlider";
import WorksOnGrid       from "@/components/WorksOnGrid";
import VideoGallery      from "@/components/VideoGallery";
import ImpactStats       from "@/components/ImpactStats";
import AboutStrip        from "@/components/AboutStrip";  

export default function HomePage() {
  return (
    <main >
      <HeroSection />                {/* Hero with headline & CTA */}
       <AboutStrip />   
      <RecentActivities />           {/* Our Recent Activities list */}
      <GreenButtonsStrip />          {/* WHO WE ARE / HELP US / GET INVOLVED / MEDIA & NEWS */}
      <ImpactStats />    
      <MeedEducationSlider />           {/* Glimpses of Activities carousel */}
                {/* Our Works On icons grid */}
      <VideoGallery />               {/* YouTube embeds */}
                  {/* Big impact numbers */}

    </main>
  );
}
