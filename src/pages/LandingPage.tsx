import FeaturesSection from "@/components/FeaturesSection";
import GradientBackground from "@/components/GradientBackground";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
  return (
    <div className="min-h-screen relative">
      <GradientBackground imageSrc="/src/components/shadergradient (2).gif" />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;