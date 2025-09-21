import { AnimatePresence, motion } from "framer-motion";
import { Globe, Info, LogIn, Menu, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SITE_NAME } from "@/lib/brand";
import brandLogo from "@/components/logo2.jpg";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    typeof localStorage !== "undefined" && localStorage.getItem("isAuthenticated") === "true"
  );
  const [tourismOpen, setTourismOpen] = useState(false);
  const [deptId, setDeptId] = useState("");
  const [deptPassword, setDeptPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Always show navbar on all routes

  const publicNavItems = [
    { name: "Create Account", icon: UserPlus, href: "/register" },
    { name: "About Us", icon: Info, href: "/about" },
  ];
  const privateNavItems = [
    { name: "Explore", icon: Info, href: "/explore" },
    { name: "Trip Itinerary", icon: Globe, href: "/trip-itinerary" },
    { name: "Profile", icon: Info, href: "/profile" },
    { name: "Report Issue", icon: Info, href: "/register-complaint" },
  ];


  // Previously the navbar was hidden for authenticated users.
  // We now always show a common navbar across all tourist dashboard pages.

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-2 left-4 right-4 z-50 glass-card backdrop-blur-xl rounded-xl shadow-2xl"
      style={{
        background:
          "linear-gradient(135deg, hsla(215 20% 97% / 0.9), hsla(210 70% 45% / 0.1))",
        backdropFilter: "blur(20px)",
        border: "1px solid hsla(215 16% 85% / 0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group gap-2">
            <img src={brandLogo} alt={SITE_NAME} className="h-12 w-12" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none';}} />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {SITE_NAME}
              </h1>
            </div>
          </Link>

          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {/* Login As Dropdown */}
            {!isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-foreground hover:bg-primary/20 hover:text-primary-glow transition-all duration-300"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login as</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-glass-border">
                <DropdownMenuItem onClick={() => navigate("/login")}>Tourist</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin-login")}>Police</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTourismOpen(true)}>Tourism Department</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}

            {(isAuthenticated ? privateNavItems : publicNavItems).map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate(item.href)}
                  className="flex items-center space-x-2 text-foreground hover:bg-primary/20 hover:text-primary-glow transition-all duration-300"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              </motion.div>
            ))}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:bg-primary/20"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 glass-card rounded-lg mt-2">
                {(isAuthenticated ? privateNavItems : publicNavItems).map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate(item.href);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 justify-start text-foreground hover:bg-primary/20 hover:text-primary-glow"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tourism Department Credentials Dialog */}
      <Dialog open={tourismOpen} onOpenChange={setTourismOpen}>
        <DialogContent className="glass-card border-glass-border">
          <DialogHeader>
            <DialogTitle>Tourism Department Login</DialogTitle>
            <DialogDescription>
              Enter your Department ID and Password to continue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="dept-id">Department ID</Label>
              <Input
                id="dept-id"
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                placeholder="e.g., T-DEL-1023"
                className="glass-card border-glass-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-pass">Password</Label>
              <Input
                id="dept-pass"
                type="password"
                value={deptPassword}
                onChange={(e) => setDeptPassword(e.target.value)}
                placeholder="Enter your password"
                className="glass-card border-glass-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTourismOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (deptId && deptPassword) {
                  setTourismOpen(false);
                  navigate("/tourism-dashboard");
                }
              }}
              className="btn-hero"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.nav>
  );
};

export default Navbar;



