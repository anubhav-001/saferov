import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, Users, MapPin, Globe } from "lucide-react";
import flagImg from "@/components/ui/flag.png";
import { useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load the Lottie animation script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    script.type = 'module';
    document.body.appendChild(script);
    
    // Create the Lottie element after script loads
    script.onload = () => {
      const container = document.getElementById('lottie-container');
      if (container) {
        // Clear any existing content
        container.innerHTML = '';
        
        // Create the dotlottie-wc element
        const lottieElement = document.createElement('dotlottie-wc');
        lottieElement.setAttribute('src', 'https://lottie.host/1d4b4b4b-607f-4ed1-aff3-3561f1ee069d/vVqVcKDZKy.lottie');
        lottieElement.setAttribute('style', 'width: 300px; height: 300px');
        lottieElement.setAttribute('speed', '1');
        lottieElement.setAttribute('autoplay', '');
        lottieElement.setAttribute('loop', '');
        
        // Append to container
        container.appendChild(lottieElement);
      }
    };
    
    // Cleanup function
    return () => {
      const scriptElement = document.querySelector('script[src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js"]');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  const stats = [
    { icon: Users, value: "50K+", label: "Protected Tourists" },
    { icon: MapPin, value: "100+", label: "Safe Destinations" },
    { icon: Shield, value: "99.9%", label: "Safety Score" },
    { icon: Globe, value: "15+", label: "Languages" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary-glow) / 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.15) 0%, transparent 50%)`
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
        {/* Main content with centered layout */}
        <div className="relative flex flex-col items-center">
          {/* Main Headline - Centered at top */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-8 w-full"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground"
            >
              <span className="gradient-text">Travel Anywhere.</span>
              <br />
              <span className="gradient-accent-text">Feel Safe, Always.</span>
            </motion.h1>

            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full shadow-sm mx-auto mt-4"
            >
              <img src={flagImg} alt="India" className="h-4 w-6 rounded-sm object-cover" />
              <span className="text-sm font-semibold text-foreground/90">
                India's First AI & Blockchain Tourist Safety Platform
              </span>
            </motion.div>
          </motion.div>

          {/* Lottie Animation - Moved closer to hero badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="w-full flex justify-center mb-6 mt-4"
          >
            <div className="bg-transparent" id="lottie-container">
              {/* Lottie animation will be inserted here via useEffect */}
            </div>
          </motion.div>
          
          {/* Tagline - Below animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-3 text-center w-full max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-semibold gradient-text tracking-tight">
              Your Trusted Companion for Adventure and Safety
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Discover a new era of travel with real-time threat detection, secure digital ID, personalized risk alerts, panic support, and multilingual access—all powered by the latest in AI and blockchain technology.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/register")}
                className="px-8 py-4 text-lg font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 shadow"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Start Your Safe Journey
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => {
                  const featuresSection = document.getElementById('features-section');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Shield className="mr-2 h-5 w-5" />
                How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="glass-card p-4 rounded-xl text-center group hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="h-6 w-6 text-primary-glow mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;