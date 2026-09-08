import BackgroundFX from "../components/BackgroundFX";
import CursorTrail from "../components/CursorTrail";
import Navbar from "../components/Navbar";
import VideoIntro from "../components/VideoIntro";
import Hero from "../components/Hero";
import WhyPlatform from "../components/WhyPlatform";
import HowItWorks from "../components/HowItWorks";
import Eligibility from "../components/Eligibility";
import SecuritySection from "../components/SecuritySection";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white">
      <BackgroundFX />
      <CursorTrail />
      <Navbar />
      <main>
        <div className="relative">
          <VideoIntro />
          <Hero />
        </div>
        <WhyPlatform />
        <HowItWorks />
        <Eligibility />
        <SecuritySection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
