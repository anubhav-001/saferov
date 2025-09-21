import { motion } from "framer-motion";
import { Shield, Users, Globe, Zap, Award, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const AboutPage = () => {
  const team = [
    {
      name: "Dr. Priya Sharma",
      role: "Chief Technology Officer",
      expertise: "AI & Blockchain",
      image: "PS"
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Security",
      expertise: "Cybersecurity & IoT",
      image: "RK"
    },
    {
      name: "Anita Desai",
      role: "Operations Director",
      expertise: "Tourism & Safety",
      image: "AD"
    },
    {
      name: "Mohammed Ali",
      role: "Lead Developer",
      expertise: "Mobile & Web",
      image: "MA"
    }
  ];

  const achievements = [
    { icon: Shield, title: "99.9% Safety Rate", description: "Highest safety rating in the industry" },
    { icon: Users, title: "50K+ Protected", description: "Tourists safeguarded across India" },
    { icon: Globe, title: "15+ Languages", description: "Multilingual support for global tourists" },
    { icon: Zap, title: "24/7 Response", description: "Round-the-clock emergency assistance" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              About SafeTravel
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Revolutionizing tourist safety in India through cutting-edge technology, 
              AI-powered monitoring, and blockchain-secured identity verification.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl gradient-text flex items-center justify-center space-x-3">
                  <Heart className="h-8 w-8 text-accent" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                  To create a safer, more secure travel experience for every tourist visiting India 
                  by leveraging advanced technologies like AI, blockchain, and IoT. We believe that 
                  everyone deserves to explore India's incredible beauty without compromising their safety.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      className="glass-card p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300"
                    >
                      <achievement.icon className="h-8 w-8 text-primary-glow mx-auto mb-3" />
                      <h3 className="font-bold text-lg">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{achievement.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl gradient-text flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-accent" />
                  <span>Technology Stack</span>
                </CardTitle>
                <CardDescription>Cutting-edge technologies powering SafeTravel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Blockchain Security</span>
                    <Badge className="bg-primary text-primary-foreground">NBF Lite</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">AI Monitoring</span>
                    <Badge className="bg-accent text-accent-foreground">TensorFlow</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Mobile Platform</span>
                    <Badge className="bg-success text-success-foreground">Flutter</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">IoT Integration</span>
                    <Badge className="bg-warning text-warning-foreground">MQTT</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Real-time Data</span>
                    <Badge className="bg-secondary text-secondary-foreground">WebSocket</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl gradient-text flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span>Safety Features</span>
                </CardTitle>
                <CardDescription>Comprehensive safety measures for tourists</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Real-time Location Tracking",
                    "AI Anomaly Detection",
                    "Instant Emergency Alerts",
                    "Geo-fencing Protection",
                    "Health Monitoring",
                    "Multilingual Support",
                    "24/7 Response Team",
                    "Blockchain ID Verification"
                  ].map((feature, index) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl gradient-text flex items-center justify-center space-x-3">
                  <Users className="h-8 w-8 text-primary" />
                  <span>Meet Our Team</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Passionate experts dedicated to revolutionizing travel safety
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {team.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      className="glass-card p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
                        {member.image}
                      </div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-primary font-medium text-sm">{member.role}</p>
                      <p className="text-muted-foreground text-sm mt-2">{member.expertise}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl font-bold gradient-text">Get In Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about SafeTravel? We'd love to hear from you. 
              Our team is always ready to help make your journey safer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="bg-primary text-primary-foreground px-6 py-3 text-base">
                📧 contact@safetravel.in
              </Badge>
              <Badge className="bg-accent text-accent-foreground px-6 py-3 text-base">
                📱 +91 1800-SAFE-123
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;