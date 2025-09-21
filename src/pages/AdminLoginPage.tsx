import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Badge, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const AdminLoginPage = () => {
  const [credentials, setCredentials] = useState({
    policeId: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      navigate("/police-dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-0 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-destructive rounded-full flex items-center justify-center"
              >
                <ShieldCheck className="h-10 w-10 text-white" />
              </motion.div>
              
              <div>
                <CardTitle className="text-2xl gradient-text">Police Dashboard Access</CardTitle>
                <CardDescription className="text-base">
                  Secure login for law enforcement personnel
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Police ID Field */}
                <div className="space-y-2">
                  <Label htmlFor="police-id" className="flex items-center space-x-2">
                    <Badge className="h-4 w-4" />
                    <span>Police ID Number</span>
                  </Label>
                  <Input
                    id="police-id"
                    type="text"
                    placeholder="Enter your police ID"
                    value={credentials.policeId}
                    onChange={(e) => setCredentials({...credentials, policeId: e.target.value})}
                    className="glass-card border-glass-border text-center font-mono tracking-wider"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: STATE-DISTRICT-XXXX (e.g., UP-LKO-1234)
                  </p>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Password</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      className="glass-card border-glass-border pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="glass-card p-4 rounded-lg border border-destructive/20">
                  <div className="flex items-start space-x-3">
                    <ShieldCheck className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive mb-1">Authorized Personnel Only</p>
                      <p className="text-muted-foreground">
                        This system is restricted to verified law enforcement officers. 
                        Unauthorized access is strictly prohibited and monitored.
                      </p>
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
                    disabled={!credentials.policeId || !credentials.password || isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        Access Dashboard
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Additional Links */}
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-glow transition-colors"
                  >
                    Forgot Password?
                  </button>
                  <p className="text-xs text-muted-foreground">
                    For technical support, contact IT department
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;