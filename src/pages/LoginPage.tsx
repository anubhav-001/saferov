import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated API logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (formData.email && formData.password) {
      toast({
        title: "Login Successful! 🎉",
        description: "Welcome back to SafeRove.",
      });
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Check your credentials and try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Shield className="h-8 w-8 text-primary-glow" />
                  <CardTitle className="text-2xl gradient-text">
                    Welcome Back to <span className="font-bold">SafeRove</span>
                  </CardTitle>
                </div>
                <CardDescription className="text-base">
                  Sign in to access your personalized safety dashboard.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="glass-card border-glass-border"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="glass-card border-glass-border pr-10"
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link
                      to="/forgot-password"
                      className="text-primary hover:text-primary-glow transition-colors"
                    >
                      Forgot Password?
                    </Link>
                    <Link
                      to="/register"
                      className="text-primary hover:text-primary-glow transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full btn-hero py-6 text-lg font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <>
                          {/* <LogIn className="mr-2 h-5 w-5" /> */}
                          <span>Sign in</span>
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
                {/* Security Note */}
                <div className="glass-card p-4 rounded-lg border border-success/20 mt-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-success mb-1">Secure & Private</p>
                      <p className="text-muted-foreground">
                        Powered by end-to-end encryption and blockchain security, your account and data stay safe with safeRove.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
