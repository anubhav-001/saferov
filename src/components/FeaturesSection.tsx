import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { 
  Shield, 
  MapPin, 
  AlertCircle, 
  QrCode, 
  Brain, 
  Globe, 
  Camera, 
  Users,
  Zap,
  Heart,
  Navigation,
  Phone
} from "lucide-react";

// TypeScript declaration for dotlottie-wc
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': any;
    }
  }
}

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    // Load Lottie script if web component is not already defined
    const src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.1/dist/dotlottie-wc.js';
    const defined = (window as any)?.customElements?.get?.('dotlottie-wc');
    if (!defined) {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'module';
        document.head.appendChild(script);
      }
    }
    // Do not remove the script on unmount to avoid re-definition errors
  }, []);

  type Feature = {
    icon: any;
    title: string;
    description: string;
    gradient: string;
    delay: number;
    lottieUrl?: string;
    imageUrl?: string;
    animOffsetClass?: string; // e.g. '-mt-8'
  };

  const features: Feature[] = [
    {
      icon: QrCode,
      title: "Blockchain Digital ID",
      description: "Secure, tamper-proof digital identity with KYC verification for every tourist. Valid only for trip duration.",
      gradient: "from-primary to-primary-glow",
      delay: 0.1,
      lottieUrl: "https://lottie.host/a5455ee3-1cca-411e-bf70-111c2dc5b5cb/VzNvpulWZe.lottie"
    },
    {
      icon: MapPin,
      title: "Real-time Location Tracking",
      description: "AI-powered geo-fencing with instant alerts when entering high-risk zones or restricted areas.",
      gradient: "from-accent to-warning",
      delay: 0.2,
      lottieUrl: "https://lottie.host/c5246873-c23c-43c3-a672-8922e8edd067/E1WPivPzUd.lottie",
      animOffsetClass: "-mt-6" // lift the map animation slightly
    },
    {
      icon: AlertCircle,
      title: "Panic Button & SOS",
      description: "One-tap emergency alerts to nearest police units, family, and emergency contacts with live location.",
      gradient: "from-destructive to-warning",
      delay: 0.3,
      // Replace with provided SOS animation
      lottieUrl: "https://lottie.host/a7902911-2c63-4894-8109-41cf92dfc865/CAKtIHk9Dn.lottie"
    },
    {
      icon: Brain,
      title: "AI Anomaly Detection",
      description: "Smart algorithms detect unusual patterns, route deviations, and potential distress situations.",
      gradient: "from-secondary to-primary",
      delay: 0.4,
      lottieUrl: "https://lottie.host/708744ba-024d-4481-9922-177024101fce/Wp7LcQsSB5.lottie",
      animOffsetClass: "-mt-6" // lift it a bit as requested
    },
    {
      icon: Globe,
      title: "15+ Language Support",
      description: "Complete multilingual support including Hindi, English, and regional Indian languages for accessibility.",
      gradient: "from-primary-glow to-accent",
      delay: 0.5,
      // Add provided lottie in front of this text
      lottieUrl: "https://lottie.host/1f428eb0-f51d-4961-953c-a0b3fbca8622/VXXXTY8yqg.lottie"
    },
    {
      icon: Users,
      title: "Local Guide Network",
      description: "Connect with verified local guides, book attractions, and get personalized travel recommendations.",
      gradient: "from-success to-secondary",
      delay: 0.6,
      // Use provided image
      imageUrl: "/src/components/guide.png"
    },
    {
      icon: Camera,
      title: "Smart Location Insights",
      description: "Auto-detect your location and receive interesting historical facts, cultural insights, and safety tips.",
      gradient: "from-warning to-primary",
      delay: 0.7,
      // Use provided image
      imageUrl: "/src/components/monuments.png"
    },
    {
      icon: Heart,
      title: "IoT Safety Wearables",
      description: "Optional smart bands and devices for continuous health monitoring and enhanced safety in remote areas.",
      gradient: "from-destructive to-accent",
      delay: 0.8,
      // Add provided IoT wearable lottie
      lottieUrl: "https://lottie.host/f205c404-11e3-45fc-8777-591cb29142dd/1ZDnFj0cet.lottie"
    },
    {
      icon: Users,
      title: "Match.Meet.Travel.",
      description: "Because every journey deserves a good company",
      gradient: "from-primary to-accent",
      delay: 0.9,
      lottieUrl: "https://lottie.host/9d51145d-224b-4c5d-b64d-88f51116aded/z6QywIiHhO.lottie"
    }
  ];

  return (
    <section id="features-section" ref={ref} className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="gradient-text">Advanced Safety</span>
            <br />
            <span className="gradient-accent-text">Features</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Cutting-edge technology stack designed to ensure your safety while exploring India's incredible destinations
          </motion.p>
        </motion.div>

        {/* Features Grid - TRUE side-by-side alternating layout */}
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 bg-accent/30 rounded-full" />
          <div className="space-y-32">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: feature.delay }}
                className="w-full"
              >
                {/* TRUE side-by-side layout */}
                <div className={`flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Text Content */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="glass-card rounded-2xl p-8 border border-accent/20 text-center lg:text-left max-w-md w-full">
                      <h3 className="text-3xl md:text-4xl font-bold mb-6">
                        <span className="gradient-text">{feature.title}</span>
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                  
                  {/* Visual Content */}
                  <div className="flex-1 flex items-center justify-center">
                    {feature.lottieUrl ? (
                      <div className="w-80 h-80 flex items-center justify-center visual-blend">
                        <dotlottie-wc 
                          src={feature.lottieUrl} 
                          style={{width: '320px', height: '320px', backgroundColor: 'transparent'}} 
                          speed="1" 
                          autoplay 
                          loop
                          background="transparent"
                        ></dotlottie-wc>
                      </div>
                    ) : feature.imageUrl ? (
                      <div className="w-80 h-80 flex items-center justify-center visual-blend">
                        <img 
                          src={feature.imageUrl} 
                          alt={feature.title} 
                          className="w-[320px] h-[320px] object-contain image-seamless" 
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center visual-blend">
                        <feature.icon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;