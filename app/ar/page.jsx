// ------------------------------
// app/ar/page.jsx  (Arabic Home FINAL order)
// ------------------------------
"use client"
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

export default function HomePage() {
  return (
    <main >
      <HeroSection />                {/* Hero with headline & CTA */}
       <AboutStrip />   
      <RecentActivities />           {/* Our Recent Activities list */}
      <GreenButtonsStrip />          {/* WHO WE ARE / HELP US / GET INVOLVED / MEDIA & NEWS */}
      <ImpactStats />    
      <ActivitiesSlider />           {/* Glimpses of Activities carousel */}
                {/* Our Works On icons grid */}
      <VideoGallery />               {/* YouTube embeds */}
                  {/* Big impact numbers */}
      {/* <VisitorCarousel />            Visitor's message carousel */}
      {/* <CallToAction />               Contact CTA */}
    </main>
  );
}
