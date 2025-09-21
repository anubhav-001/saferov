import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import { TranslationProvider } from "@/components/TranslationProvider";
import i18n from "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ExplorePage from "./pages/ExplorePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import PaymentPage from "./pages/PaymentPage";
import PoliceDashboard from "./pages/PoliceDashboard";
import ProfilePage from "./pages/ProfilePage";
import RegisterComplaintPage from "./pages/RegisterComplaintPage";
import RegisterPage from "./pages/RegisterPage";
import TourismDashboard from "./pages/TourismDashboard";
import TravelCirclePage from "./pages/TravelCirclePage";
import TripItineraryPage from "./pages/TripItineraryPage";
import KYCPage from "./pages/KYCPage";
import UserDashboard from "./pages/UserDashboard";

const queryClient = new QueryClient();

// Get saved language from localStorage or use default
const getDefaultLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('preferredLanguage') || 'en';
};

const App = () => {
  const defaultLanguage = getDefaultLanguage();
  
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <TranslationProvider defaultLanguage={defaultLanguage}>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboard Routes with Layout (Navbar inside) */}
          <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
            <Route path="/tourism-dashboard" element={<TourismDashboard />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/trip-itinerary" element={<TripItineraryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/police-dashboard" element={<PoliceDashboard />} />
          </Route>

          {/* User Dashboard uses its own header; do not wrap to avoid double navbar */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/travel-circle" element={<TravelCirclePage />} />
          
          {/* Public Routes */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/complete-kyc" element={<KYCPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register-complaint" element={<RegisterComplaintPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          </BrowserRouter>
          </TranslationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;
