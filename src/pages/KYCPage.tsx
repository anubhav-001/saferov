import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const KYCPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nationality = location.state?.nationality as string;
  const formData = location.state?.formData || {};

  const [docNumber, setDocNumber] = useState("");
  const [country, setCountry] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const sendOtp = () => {
    if ((nationality === "indian" && docNumber.length === 12) || (nationality !== "indian" && docNumber)) {
      setOtpSent(true);
    }
  };

  const verifyOtp = () => {
    if (otp.length >= 4) {
      setVerified(true);
      // proceed after short delay
      setTimeout(() => {
        navigate("/complete-profile", { state: { formData: { ...formData, documentNumber: docNumber, documentType: nationality === "indian" ? "Aadhar" : "Passport", country } } });
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl gradient-text">Complete KYC</CardTitle>
                <CardDescription>Verify your identity to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {nationality === "indian" ? (
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number</Label>
                    <Input id="aadhar" placeholder="Enter 12-digit Aadhar number" maxLength={12} value={docNumber} onChange={(e)=>setDocNumber(e.target.value)} className="glass-card border-glass-border" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select onValueChange={setCountry}>
                        <SelectTrigger className="glass-card border-glass-border">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-glass-border">
                          <SelectItem value="usa">🇺🇸 United States</SelectItem>
                          <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                          <SelectItem value="fr">🇫🇷 France</SelectItem>
                          <SelectItem value="de">🇩🇪 Germany</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passport">Passport Number</Label>
                      <Input id="passport" placeholder="Enter passport number" value={docNumber} onChange={(e)=>setDocNumber(e.target.value)} className="glass-card border-glass-border" />
                    </div>
                  </div>
                )}

                {!otpSent ? (
                  <Button className="w-full btn-hero" onClick={sendOtp} disabled={!docNumber || (nationality !== "indian" && !country)}>
                    Send OTP
                  </Button>
                ) : !verified ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input id="otp" placeholder="Enter 4-6 digit OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} className="glass-card border-glass-border" />
                    </div>
                    <Button className="w-full btn-hero" onClick={verifyOtp}>Verify</Button>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 mx-auto bg-success rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <p className="font-semibold">KYC Successful</p>
                    <div className="glass-card p-3 rounded-lg border border-success/20 text-sm text-muted-foreground flex items-center gap-2 justify-center">
                      <Shield className="h-4 w-4 text-success" />
                      Your identity has been verified securely.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;


