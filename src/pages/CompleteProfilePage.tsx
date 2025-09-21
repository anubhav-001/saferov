import CameraCapture from "@/components/CameraCapture";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Calendar, Camera, CheckCircle, QrCode, Shield, Upload, Users } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CompleteProfilePage = () => {
  const [profileData, setProfileData] = useState({
    photo: null as File | null,
    duration: "",
    members: "1",
    hasInsurance: false,
    emergencyContact: "",
    emergencyPhone: ""
  });
  const [showQR, setShowQR] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {};

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData({...profileData, photo: file});
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCapturing(true);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob((blob) => {
          const finalize = (fileBlob: Blob) => {
            const file = new File([fileBlob], "captured-photo.jpg", { type: "image/jpeg" });
            setProfileData({ ...profileData, photo: file });
            setPhotoPreview(canvas.toDataURL("image/jpeg", 0.92));
            setIsCapturing(false);
            // no-op; handled by embedded component path
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach((track) => track.stop());
          };

          if (blob) {
            finalize(blob);
          } else {
            // Fallback if toBlob is not supported
            const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
            const byteString = atob(dataUrl.split(',')[1]);
            const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
            finalize(new Blob([ab], { type: mimeString }));
          }
        }, "image/jpeg", 0.92);
      }
    }
  };

  const generateBlockchainID = () => {
    setShowQR(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateBlockchainID();
  };

  if (showQR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <Card className="glass-card border-0 shadow-2xl">
            <CardHeader className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl gradient-text">Digital ID Generated!</CardTitle>
              <CardDescription>Your blockchain identity is ready</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* QR Code Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-6 rounded-xl mx-auto w-fit"
              >
                <QrCode className="h-32 w-32 text-black mx-auto" />
              </motion.div>
              
              {/* ID Details */}
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Number:</span>
                  <span className="font-mono">ST-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-success text-success-foreground">Verified</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span>{new Date(Date.now() + parseInt(profileData.duration) * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Blockchain Secured</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This ID is encrypted and stored on a secure blockchain network
                </p>
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-muted-foreground"
              >
                Redirecting to your dashboard in 5 seconds...
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl gradient-text">Complete Your Profile</CardTitle>
                <CardDescription>
                  Final steps to generate your secure blockchain travel ID
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Photo Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Camera className="h-5 w-5 text-primary" />
                      <span>Profile Photo</span>
                    </h3>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      {/* Photo Preview */}
                      <div className="w-40 h-40 rounded-full overflow-hidden glass-card border-4 border-primary/20">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Camera className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Camera/Upload Options */}
                      {!isCapturing ? (
                        <div className="space-y-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full glass-card border-glass-border"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={startCamera}
                            className="w-full glass-card border-glass-border"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                          </Button>
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 w-full">
                          <CameraCapture
                            onCaptured={(file, dataUrl) => {
                              setProfileData({ ...profileData, photo: file });
                              setPhotoPreview(dataUrl);
                            }}
                            onClose={() => setIsCapturing(false)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="bg-glass-border" />
                  
                  {/* Travel Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>Travel Details</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration of Stay (days)</Label>
                        <Select onValueChange={(value) => setProfileData({...profileData, duration: value})} required>
                          <SelectTrigger className="glass-card border-glass-border">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-glass-border">
                            <SelectItem value="7">1 Week</SelectItem>
                            <SelectItem value="14">2 Weeks</SelectItem>
                            <SelectItem value="30">1 Month</SelectItem>
                            <SelectItem value="60">2 Months</SelectItem>
                            <SelectItem value="90">3 Months</SelectItem>
                            <SelectItem value="180">6 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="members">Number of Travelers</Label>
                        <Input
                          id="members"
                          type="number"
                          min="1"
                          max="10"
                          value={profileData.members}
                          onChange={(e) => setProfileData({...profileData, members: e.target.value})}
                          className="glass-card border-glass-border"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Travel Insurance */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="insurance">Travel Insurance</Label>
                          <p className="text-sm text-muted-foreground">Do you have travel insurance coverage?</p>
                        </div>
                        <Switch
                          id="insurance"
                          checked={profileData.hasInsurance}
                          onCheckedChange={(checked) => setProfileData({...profileData, hasInsurance: checked})}
                        />
                      </div>
                      
                      {!profileData.hasInsurance && (
                        <div className="glass-card p-4 rounded-lg border border-warning/20">
                          <p className="text-sm text-warning">
                            ⚠️ We recommend getting travel insurance for enhanced safety coverage
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="bg-glass-border" />
                  
                  {/* Emergency Contacts */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Emergency Contact</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emergency-contact">Contact Name</Label>
                        <Input
                          id="emergency-contact"
                          placeholder="Full name of emergency contact"
                          value={profileData.emergencyContact}
                          onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                          className="glass-card border-glass-border"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergency-phone">Contact Phone</Label>
                        <Input
                          id="emergency-phone"
                          placeholder="Emergency contact phone number"
                          value={profileData.emergencyPhone}
                          onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
                          className="glass-card border-glass-border"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full btn-hero py-6 text-lg font-semibold"
                      disabled={!profileData.photo || !profileData.duration || !profileData.emergencyContact || !profileData.emergencyPhone}
                    >
                      <QrCode className="mr-2 h-5 w-5" />
                      Generate Blockchain ID
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

export default CompleteProfilePage;