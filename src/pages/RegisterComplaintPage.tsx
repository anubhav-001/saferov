import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Search, 
  Heart, 
  ShieldAlert, 
  MapPin, 
  Phone,
  ArrowLeft,
  Send,
  Clock,
  User,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const RegisterComplaintPage = () => {
  const [complaintType, setComplaintType] = useState("");
  const [priority, setPriority] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    contactNumber: "",
    alternateContact: "",
    witnesses: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("complaint");
  const navigate = useNavigate();
  const { toast } = useToast();

  const complaintTypes = [
    {
      id: "missing_person",
      title: "Missing Person",
      icon: Search,
      description: "Report a missing tourist or travel companion",
      color: "text-destructive",
      bgColor: "bg-destructive/10 border-destructive/20"
    },
    {
      id: "lost_items",
      title: "Lost Items",
      icon: FileText,
      description: "Report lost documents, luggage, or personal belongings",
      color: "text-warning",
      bgColor: "bg-warning/10 border-warning/20"
    },
    {
      id: "medical_emergency",
      title: "Medical Emergency",
      icon: Heart,
      description: "Report medical emergencies or health-related incidents",
      color: "text-destructive",
      bgColor: "bg-destructive/10 border-destructive/20"
    },
    {
      id: "safety_concern",
      title: "Safety Concern",
      icon: ShieldAlert,
      description: "Report suspicious activities or safety threats",
      color: "text-warning",
      bgColor: "bg-warning/10 border-warning/20"
    },
    {
      id: "harassment",
      title: "Harassment",
      icon: AlertTriangle,
      description: "Report harassment, abuse, or inappropriate behavior",
      color: "text-destructive",
      bgColor: "bg-destructive/10 border-destructive/20"
    },
    {
      id: "theft",
      title: "Theft",
      icon: AlertTriangle,
      description: "Report theft, robbery, or stolen belongings",
      color: "text-destructive",
      bgColor: "bg-destructive/10 border-destructive/20"
    }
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "text-green-600", bgColor: "bg-green-100" },
    { value: "medium", label: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { value: "high", label: "High", color: "text-orange-600", bgColor: "bg-orange-100" },
    { value: "critical", label: "Critical", color: "text-red-600", bgColor: "bg-red-100" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaintType || !formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const complaintId = `CMP${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Complaint Registered Successfully! 📝",
      description: `Your complaint ID is ${complaintId}. You will receive updates via SMS/Email.`,
    });

    // Navigate back to dashboard
    navigate("/dashboard");
    
    setIsSubmitting(false);
  };

  const handleEFirSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for e-FIR.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const firId = `FIR${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "e-FIR Generated Successfully! 📄",
      description: `Your e-FIR ID is ${firId}. It has been forwarded to the police station.`,
    });

    // Navigate back to dashboard
    navigate("/dashboard");
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-4"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="glass-card"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Report Issue</h1>
              <p className="text-muted-foreground">Help us keep you safe by reporting any issues</p>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="complaint">Register Complaint</TabsTrigger>
              <TabsTrigger value="efir">Generate e-FIR</TabsTrigger>
            </TabsList>

            <TabsContent value="complaint" className="space-y-6">
              {/* Complaint Type Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      <span>Select Issue Type</span>
                    </CardTitle>
                    <CardDescription>Choose the type of issue you want to report</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {complaintTypes.map((type) => (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-200 ${
                              complaintType === type.id
                                ? "ring-2 ring-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            } ${type.bgColor}`}
                            onClick={() => setComplaintType(type.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <type.icon className={`h-6 w-6 ${type.color}`} />
                                <div>
                                  <h3 className={`font-semibold ${type.color}`}>{type.title}</h3>
                                  <p className="text-sm text-muted-foreground">{type.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Complaint Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Complaint Details</CardTitle>
                    <CardDescription>Provide detailed information about the issue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Issue Title *</Label>
                          <Input
                            id="title"
                            placeholder="Brief description of the issue"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority Level</Label>
                          <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorityLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${level.bgColor}`} />
                                    <span>{level.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Detailed Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide a detailed description of what happened, when, and where..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="location"
                              placeholder="Where did this happen?"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="contactNumber">Contact Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="contactNumber"
                              placeholder="Your phone number"
                              value={formData.contactNumber}
                              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="alternateContact">Alternate Contact</Label>
                          <Input
                            id="alternateContact"
                            placeholder="Emergency contact number"
                            value={formData.alternateContact}
                            onChange={(e) => setFormData({...formData, alternateContact: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="witnesses">Witnesses (if any)</Label>
                          <Input
                            id="witnesses"
                            placeholder="Names and contact details"
                            value={formData.witnesses}
                            onChange={(e) => setFormData({...formData, witnesses: e.target.value})}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-hero"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Send className="h-4 w-4" />
                            <span>Submit Complaint</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="efir" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Generate e-FIR</span>
                    </CardTitle>
                    <CardDescription>
                      Create an electronic First Information Report for serious incidents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold text-blue-800 mb-2">What is an e-FIR?</h3>
                      <p className="text-sm text-blue-700">
                        An e-FIR is an electronic First Information Report that can be filed online for certain types of crimes. 
                        It has the same legal validity as a traditional FIR and will be forwarded to the nearest police station.
                      </p>
                    </div>

                    <form onSubmit={handleEFirSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="efirTitle">Incident Title *</Label>
                        <Input
                          id="efirTitle"
                          placeholder="Brief description of the incident"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="efirDescription">Detailed Incident Report *</Label>
                        <Textarea
                          id="efirDescription"
                          placeholder="Provide a detailed account of the incident including date, time, location, and all relevant details..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={6}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="efirLocation">Incident Location *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="efirLocation"
                              placeholder="Exact location where incident occurred"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="efirContact">Your Contact Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="efirContact"
                              placeholder="Your phone number"
                              value={formData.contactNumber}
                              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="efirWitnesses">Witnesses Information</Label>
                        <Textarea
                          id="efirWitnesses"
                          placeholder="Names, addresses, and contact details of any witnesses"
                          value={formData.witnesses}
                          onChange={(e) => setFormData({...formData, witnesses: e.target.value})}
                          rows={3}
                        />
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Filing a false FIR is a punishable offense</li>
                          <li>• You may be contacted by police for verification</li>
                          <li>• Keep your complaint ID safe for future reference</li>
                          <li>• For emergencies, call 100 immediately</li>
                        </ul>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-hero"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span>Generating e-FIR...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Generate e-FIR</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RegisterComplaintPage;