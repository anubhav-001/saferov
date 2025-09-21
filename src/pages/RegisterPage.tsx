import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Globe, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const countryCodes = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+352", name: "Luxembourg", flag: "🇱🇺" },
];

const PhoneInputWithCountryCode = ({ formData, setFormData }) => {
  const [selectedCode, setSelectedCode] = useState("+91");
  const [number, setNumber] = useState("");

  // Update combined phone string in formData on code or number change
  const updatePhone = (code, num) => {
    setFormData({ ...formData, phone: `${code} ${num}` });
  };

  const onCodeChange = (e) => {
    const newCode = e.target.value;
    setSelectedCode(newCode);
    updatePhone(newCode, number);
  };

  const onNumberChange = (e) => {
    const newNumber = e.target.value;
    setNumber(newNumber);
    updatePhone(selectedCode, newNumber);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <div className="flex">
        <select
          value={selectedCode}
          onChange={onCodeChange}
          className="glass-card border-glass-border rounded-l-md px-3 py-2 bg-white text-black"
          aria-label="Select country code"
        >
          {countryCodes.map(({ code, name, flag }) => (
            <option key={code} value={code}>
              {flag} {code}
            </option>
          ))}
        </select>

        <Input
          id="phone"
          type="tel"
          placeholder="98765 43210"
          value={number}
          onChange={onNumberChange}
          required
          className="glass-card border-glass-border rounded-r-md flex-grow"
        />
      </div>
      
    </div>
  );
};

const RegisterPage = () => {
  const [nationality, setNationality] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    documentNumber: "",
    documentType: "",
    country: ""
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/complete-kyc", { state: { nationality, formData } });
  };

  const NamasteGreeting = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-center space-x-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl"
        >
          🙏
        </motion.div>
        <h2 className="text-3xl font-bold gradient-text">Namaste!</h2>
      </div>
      <p className="text-muted-foreground">Welcome to India's safest travel experience</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <NamasteGreeting />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Shield className="h-8 w-8 text-primary-glow" />
                  <CardTitle className="text-2xl gradient-text">Create Your Digital ID</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Secure blockchain-based identity for safe travel across India
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="glass-card border-glass-border"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="glass-card border-glass-border"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number Input with Country Code */}
                    <PhoneInputWithCountryCode formData={formData} setFormData={setFormData} />
                  </div>

                  {/* Nationality Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Nationality</h3>
                    </div>

                    <Select onValueChange={setNationality} required>
                      <SelectTrigger className="glass-card border-glass-border">
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-glass-border">
                        <SelectItem value="indian">
                          <div className="flex items-center space-x-2">
                            <span>🇮🇳</span>
                            <span>Indian Citizen</span>
                            <Badge variant="secondary" className="ml-2">Domestic</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="foreign">
                          <div className="flex items-center space-x-2">
                            <span>🌍</span>
                            <span>Foreign National</span>
                            <Badge variant="outline" className="ml-2">International</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Document Information moved to Complete KYC page */}

                  {/* Security Note */}
                  <div className="glass-card p-4 rounded-lg border border-primary/20">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-success mb-1">Blockchain Security</p>
                        <p className="text-muted-foreground">
                          Your data is encrypted end-to-end and stored on a secure blockchain
                          network. Only you and authorized emergency responders can access your
                          information.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full btn-hero py-6 text-lg font-semibold"
                      disabled={!nationality || !formData.name || !formData.email || !formData.phone}
                    >
                      <span>Continue to Profile Setup</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
