import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Camera,
    CheckCircle,
    Clock,
    Edit3,
    FileText,
    LogOut,
    MessageSquare,
    Save,
    Shield,
    Star,
    User
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SITE_NAME } from "@/lib/brand";
import brandLogo from "@/components/logo2.jpg";

const ProfilePage = () => {
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    name: "Ananya Sharma",
    email: "ananya.sharma@email.com",
    phone: "+91 98765 43210",
    nationality: "Indian",
    documentType: "Aadhar",
    documentNumber: "2345 6789 1234",
    safetyId: "ST-A7B2C9D1",
    joinDate: "March 2024",
    tripsCompleted: 5,
    safetyScore: 92,
    emergencyContact: "+91 98765 43211",
    address: "Mumbai, Maharashtra, India"
  });

  const recentComplaints = [
    {
      id: "CMP001",
      type: "Lost Items",
      status: "Resolved",
      date: "2024-01-15",
      description: "Lost wallet at Red Fort"
    },
    {
      id: "CMP002", 
      type: "Safety Concern",
      status: "In Progress",
      date: "2024-01-10",
      description: "Suspicious activity near hotel"
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated! ",
      description: "Your information has been saved successfully.",
    });
  };

  const handleDownloadQr = () => {
    const qrCanvas = qrRef.current;
    if (!qrCanvas) return;
    const padding = 24;
    const details = [
      `Name: ${profileData.name}`,
      `Email: ${profileData.email}`,
      `${SITE_NAME} ID: ${profileData.safetyId}`,
      `Generated: ${new Date().toLocaleString()}`,
    ];

    const width = qrCanvas.width + padding * 2;
    const lineHeight = 22;
    const textBlockHeight = padding + details.length * lineHeight + padding;
    const height = qrCanvas.height + textBlockHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const qrX = (width - qrCanvas.width) / 2;
    ctx.drawImage(qrCanvas, qrX, padding);

    ctx.fillStyle = "#111827";
    ctx.font = "16px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
    let ty = qrCanvas.height + padding + 16;
    details.forEach((line) => {
      ctx.fillText(line, padding, ty);
      ty += lineHeight;
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    const brandSlug = SITE_NAME.toLowerCase().replace(/\s+/g, "-");
    link.download = `${brandSlug}-id-${profileData.safetyId}.png`;
    link.click();
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim() && rating > 0) {
      toast({
        title: "Feedback Submitted! ",
        description: "Thank you for helping us improve SafeTravel.",
      });
      setFeedback("");
      setRating(0);
      setShowFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      
      <div className="pt-24 pb-12 px-4">

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <img src={brandLogo} alt={SITE_NAME} className="h-7 w-7 rounded-full object-cover" />
                <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
              </div>
            </div>
            <Badge className="bg-success text-success-foreground px-4 py-2 text-lg">
              ID: {profileData.safetyId}
            </Badge>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-2xl font-bold text-white">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent hover:bg-accent/90"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                    <CardDescription className="text-base">
                      Verified Tourist • Member since {profileData.joinDate}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleDownloadQr}>Download QR</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Logout
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card border-glass-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>You will be signed out and redirected to the landing page.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { localStorage.removeItem("isAuthenticated"); navigate("/", { replace: true }); }}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={isEditing ? "btn-hero" : "btn-accent"}
                  >
                    {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Personal Details</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          disabled={!isEditing}
                          className="glass-card border-glass-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!isEditing}
                          className="glass-card border-glass-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          disabled={!isEditing}
                          className="glass-card border-glass-border"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Security & Travel Info</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Nationality</Label>
                        <Input
                          value={profileData.nationality}
                          disabled
                          className="glass-card border-glass-border"
                        />
                      </div>
                      <div>
                        <Label>Document Type</Label>
                        <Input
                          value={profileData.documentType}
                          disabled
                          className="glass-card border-glass-border"
                        />
                      </div>
                      <div>
                        <Label>Document Number</Label>
                        <Input
                          value={`****${profileData.documentNumber.slice(-4)}`}
                          disabled
                          className="glass-card border-glass-border"
                        />
                      </div>
                      {/* Digital ID (QR Code) - hidden canvas for export only */}
                      <div className="hidden">
                        <QRCodeCanvas
                          value={profileData.safetyId}
                          size={160}
                          includeMargin
                          level="M"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ref={qrRef as any}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Travel Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.tripsCompleted}</div>
                    <div className="text-sm text-muted-foreground">Trips Completed</div>
                  </div>
                  <div className="glass-card p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-success">{profileData.safetyScore}</div>
                    <div className="text-sm text-muted-foreground">Safety Score</div>
                  </div>
                  <div className="glass-card p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-accent">0</div>
                    <div className="text-sm text-muted-foreground">Active Alerts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Complaints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Recent Complaints</span>
                </CardTitle>
                <CardDescription>Your complaint history and status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          complaint.status === 'Resolved' ? 'bg-success' : 'bg-warning'
                        }`} />
                        <div>
                          <h4 className="font-medium">{complaint.type}</h4>
                          <p className="text-sm text-muted-foreground">{complaint.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={complaint.status === 'Resolved' ? 'secondary' : 'outline'}>
                          {complaint.status === 'Resolved' ? <CheckCircle className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                          {complaint.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{complaint.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feedback Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Share Your Feedback</span>
                </CardTitle>
                <CardDescription>Help us improve SafeTravel with your valuable feedback</CardDescription>
              </CardHeader>
              <CardContent>
                {!showFeedback ? (
                  <Button 
                    onClick={() => setShowFeedback(true)}
                    className="btn-accent"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Give Feedback
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Rate Your Experience</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="icon"
                            onClick={() => setRating(star)}
                            className={rating >= star ? "text-warning" : "text-muted-foreground"}
                          >
                            <Star className={`h-6 w-6 ${rating >= star ? "fill-current" : ""}`} />
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="feedback">Your Feedback</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Tell us about your experience with SafeTravel..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="glass-card border-glass-border mt-2"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleFeedbackSubmit}
                        disabled={!feedback.trim() || rating === 0}
                        className="btn-hero"
                      >
                        Submit Feedback
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowFeedback(false)}
                        className="glass-card border-glass-border"
                      >
                        Cancel
                      </Button>
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

export default ProfilePage;