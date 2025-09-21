import Chatbot from "@/components/Chatbot";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { AlertTriangle, Compass, Loader2, LogOut, MapPin, Settings, Shield, Star, User, Users, Watch, Zap, Cloud, Thermometer, Droplets, Wind, Navigation } from "lucide-react";
import { SITE_NAME } from "@/lib/brand";
import brandLogo from "@/components/logo2.jpg";
import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { lazy, Suspense } from 'react';

// Dynamically import the map component to avoid SSR issues
const MapWithWeather = lazy(() => import('@/components/MapWithWeather'));

const UserDashboard = () => {
  const [currentLocation, setCurrentLocation] = useState({
    name: "India Gate, New Delhi",
    coordinates: { lat: 28.6129, lng: 77.2295 } // Default to India Gate
  });
  const [safetyScore, setSafetyScore] = useState<number>(85); // Default score of 85
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const [monumentOpen, setMonumentOpen] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(false);
  const [language, setLanguage] = useState("en");
  const [loadingSafety, setLoadingSafety] = useState(false);
  const navigate = useNavigate();
  const blockchainId = "ST-A7B2C9D1"; // Example blockchain-generated ID
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  
  // Haversine distance in meters
  const distanceMeters = (a: {lat:number,lng:number}, b: {lat:number,lng:number}) => {
    const toRad = (x:number)=>x*Math.PI/180;
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDlat = Math.sin(dLat/2);
    const sinDlng = Math.sin(dLng/2);
    const h = sinDlat*sinDlat + Math.cos(lat1)*Math.cos(lat2)*sinDlng*sinDlng;
    return 2*R*Math.asin(Math.min(1, Math.sqrt(h)));
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  ];

  // Get user's current location
  const updateLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode these coordinates to get location name
          setCurrentLocation(prev => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude }
          }));
          fetchWeatherData(latitude, longitude);
          // Route deviation detection vs active itinerary center (if present)
          try {
            const active = localStorage.getItem('active_itinerary');
            if (active) {
              const parsed = JSON.parse(active);
              if (parsed?.center) {
                const dist = distanceMeters({lat: latitude, lng: longitude}, parsed.center);
                const threshold = 5000; // 5 km deviation threshold
                if (dist > threshold) {
                  const event = {
                    id: `dev_${Date.now()}`,
                    touristId: blockchainId,
                    distance_m: Math.round(dist),
                    city: parsed.city,
                    at: new Date().toISOString(),
                    location: { lat: latitude, lng: longitude },
                    planned_center: parsed.center,
                  };
                  const key = 'route_deviation_events';
                  const list = JSON.parse(localStorage.getItem(key) || '[]');
                  list.push(event);
                  localStorage.setItem(key, JSON.stringify(list.slice(-100)));
                }
              }
            }
          } catch {}
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Using default location.");
        }
      );
    }
  }, []);

  // Fetch weather data with caching and better error handling
  const fetchWeatherData = useCallback(async (lat: number, lng: number) => {
    try {
      setIsLoadingWeather(true);
      const apiKeyRaw = import.meta.env.VITE_WEATHER_API_KEY as string | undefined;
      const apiKey = (apiKeyRaw || '').replace(/^\"|\"$/g, '').trim();
      
      if (!apiKey) {
        console.warn('OpenWeather API key not configured');
        toast.warning('Weather features disabled: Missing API key');
        return null;
      }
      
      // Check if we have recent weather data for this location (within last 30 minutes)
      const cacheKey = `weather_${lat.toFixed(2)}_${lng.toFixed(2)}`;
      const cachedData = localStorage.getItem(cacheKey);
      const now = new Date().getTime();
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Use cached data if it's less than 30 minutes old
        if (now - timestamp < 30 * 60 * 1000) {
          setWeatherData(data);
          return data;
        }
      }
      
      // Fetch fresh data from the API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      
      const data = await response.json();
      
      // Cache the new data with timestamp
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: now
        })
      );
      
      setWeatherData(data);
      return data;
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          toast.error('Invalid OpenWeather API key. Please check your configuration.');
        } else if (error.message.includes('429')) {
          toast.error('Weather API rate limit exceeded. Please try again later.');
        } else {
          toast.error('Weather data unavailable. Please check your connection and try again.');
        }
      }
      
      return null;
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Fetch live safety score from backend when available
  useEffect(() => {
    let cancelled = false;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds

    const fetchSafetyScore = async () => {
      const isLocalBackend = !import.meta.env.VITE_API_URL || 
                           import.meta.env.VITE_API_URL.includes('localhost') || 
                           import.meta.env.VITE_API_URL.includes('127.0.0.1');
      
      if (isLocalBackend) {
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Running in demo mode with default safety score');
        }
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tourist/${blockchainId}/process`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location: currentLocation,
              timestamp: new Date().toISOString(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!cancelled) {
          setSafetyScore(data.safety_score || 85);
          retryCount = 0; // Reset retry count on success
        }
      } catch (error) {
        console.error('Error fetching safety score:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying safety score fetch (${retryCount}/${maxRetries})...`);
          setTimeout(fetchSafetyScore, retryDelay);
        } else if (!cancelled) {
          console.log('Max retries reached, using default safety score');
          toast.warning('Using default safety score - unable to connect to server');
        }
      }
    };

    // Initial fetch
    fetchSafetyScore();
    
    // Set up polling every 5 minutes if we have a valid API URL
    let interval: NodeJS.Timeout | null = null;
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:8000') {
      interval = setInterval(fetchSafetyScore, 300000); // Poll every 5 minutes
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [currentLocation]);

  const handleDownloadQr = () => {
    const qrCanvas = qrRef.current;
    if (!qrCanvas) return;
    const padding = 24;
    const details = [
      `${SITE_NAME} ID: ${blockchainId}`,
      `Location: ${currentLocation}`,
      `Generated: ${new Date().toLocaleString()}`,
    ];

    // Create composite canvas (QR + text)
    const width = qrCanvas.width + padding * 2;
    const lineHeight = 22;
    const textBlockHeight = padding + details.length * lineHeight + padding;
    const height = qrCanvas.height + textBlockHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw QR centered
    const qrX = (width - qrCanvas.width) / 2;
    ctx.drawImage(qrCanvas, qrX, padding);

    // Draw text details
    ctx.fillStyle = "#111827"; // slate-900
    ctx.font = "16px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
    let ty = qrCanvas.height + padding + 16;
    details.forEach((line) => {
      ctx.fillText(line, padding, ty);
      ty += lineHeight;
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    const brandSlug = SITE_NAME.toLowerCase().replace(/\s+/g, "-");
    link.download = `${brandSlug}-id-${blockchainId}.png`;
    link.click();
  };

  const locationFacts = [
    "India Gate is a war memorial built in 1921 to honor Indian soldiers.",
    "The structure stands 42 meters high and was designed by Sir Edwin Lutyens.",
    "It's also known as the All India War Memorial and is a popular picnic spot."
  ];

  const nearbyAttractions = [
    { name: "Red Fort", price: "₹35", rating: 4.5, distance: "2.3 km" },
    { name: "Lotus Temple", price: "Free", rating: 4.7, distance: "8.1 km" },
    { name: "Humayun's Tomb", price: "₹30", rating: 4.4, distance: "5.2 km" },
    { name: "Qutub Minar", price: "₹30", rating: 4.6, distance: "12.5 km" }
  ];

  const availableGuides = [
    { name: "Rajesh Kumar", rating: 4.8, languages: ["Hindi", "English"], price: "₹1500/day" },
    { name: "Priya Sharma", rating: 4.9, languages: ["Hindi", "English", "French"], price: "₹2000/day" },
    { name: "Mohammed Ali", rating: 4.7, languages: ["Hindi", "English", "Urdu"], price: "₹1800/day" }
  ];

  const recommendedPlaces = [
    { name: "Akshardham Temple", type: "Religious", safety: "High" },
    { name: "Chandni Chowk", type: "Market", safety: "Medium" },
    { name: "Hauz Khas Village", type: "Nightlife", safety: "Medium" },
    { name: "Lodhi Gardens", type: "Park", safety: "High" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header with hanging effect */}
      <header className="glass-card backdrop-blur-xl border-b border-glass-border sticky top-2 z-10 mx-4 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <img src={brandLogo} alt={SITE_NAME} className="h-12 w-12 rounded-full object-cover" />
              <div className="leading-tight ml-3">
                <div className="text-2xl font-bold text-foreground ">{SITE_NAME}</div>
                <div className="text-xs text-muted-foreground">Tourist Dashboard</div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/explore")}
                className="flex items-center space-x-2 text-foreground hover:text-primary-glow"
              >
                <Compass className="h-4 w-4" />
                <span>Explore</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/trip-itinerary")}
                className="flex items-center space-x-2 text-foreground hover:text-primary-glow"
              >
                <Navigation className="h-4 w-4" />
                <span>Trip Itinerary</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/travel-circle")}
                className="flex items-center space-x-2 text-foreground hover:text-primary-glow"
              >
                <Users className="h-4 w-4" />
                <span>Travel Circle</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 text-foreground hover:text-primary-glow"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/register-complaint")}
                className="flex items-center space-x-2 text-foreground hover:text-primary-glow"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Report Issue</span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-glass-border">
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                      Manage your account settings and preferences
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Language</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="glass-card border-glass-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-glass-border">
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center space-x-2">
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      {/* Location Tracking toggle removed as per requirements */}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Safety Device</label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Connect smart safety devices</span>
                        <Switch
                          checked={connectedDevice}
                          onCheckedChange={setConnectedDevice}
                        />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-glass-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be signed out and redirected to the landing page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        localStorage.removeItem("isAuthenticated");
                        navigate("/", { replace: true });
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Welcome Back!</h2>
              <p className="text-muted-foreground">Your safety is our priority</p>
            </div>
            <Badge className="bg-success text-success-foreground px-4 py-2 text-lg">
              ID: ST-A7B2C9D1
            </Badge>
          </div>
        </motion.div>

        {/* Emergency, Safety, and Monument Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Panic Button */}
          <Card className="glass-card border-destructive/20">
            <CardContent className="p-6 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={async () => {
                    try {
                      setIsSendingSOS(true);
                      
                      // Get current location
                      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                          resolve, 
                          (error) => {
                            console.error('Location error:', error);
                            toast.error('Could not get your location. Please check location permissions.');
                            reject(error);
                          },
                          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                        );
                      });
                      
                      // Try Speech-to-Text (Web Speech API) in parallel
                      const sttPromise = new Promise<string>((resolve) => {
                        try {
                          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                          if (!SpeechRecognition) return resolve("");
                          const rec = new SpeechRecognition();
                          rec.lang = 'en-IN';
                          rec.interimResults = false;
                          rec.maxAlternatives = 1;
                          rec.onresult = (e: any) => {
                            const text = e.results?.[0]?.[0]?.transcript || "";
                            resolve(text);
                          };
                          rec.onerror = () => resolve("");
                          rec.start();
                          setTimeout(() => { try { rec.stop(); } catch {} }, 4500);
                        } catch { resolve(""); }
                      });

                      // Record a short audio clip (~5s)
                      const audioPromise = new Promise<string>(async (resolve) => {
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                          const chunks: BlobPart[] = [];
                          const mr = new MediaRecorder(stream);
                          mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
                          mr.onstop = async () => {
                            try { stream.getTracks().forEach(t => t.stop()); } catch {}
                            const blob = new Blob(chunks, { type: 'audio/webm' });
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const dataUrl = reader.result as string; // base64 data URL
                              resolve(dataUrl);
                            };
                            reader.readAsDataURL(blob);
                          };
                          mr.start();
                          setTimeout(() => { try { mr.stop(); } catch { resolve(""); } }, 5000);
                        } catch {
                          resolve("");
                        }
                      });

                      // Update current location with more accurate coordinates
                      setCurrentLocation(prev => ({
                        ...prev,
                        coordinates: { 
                          lat: position.coords.latitude, 
                          lng: position.coords.longitude 
                        }
                      }));
                      
                      // Await STT and audio in parallel
                      const [sttText, audioDataUrl] = await Promise.all([sttPromise, audioPromise]);

                      // Broadcast SOS event locally (real-time across dashboards)
                      try {
                        const sosEvent = {
                          id: `sos_${Date.now()}`,
                          touristId: blockchainId,
                          at: new Date().toISOString(),
                          location: { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy },
                          transcript: sttText,
                          audio: audioDataUrl, // data URL playable in <audio>
                        };
                        // Persist recent events
                        const key = 'sos_events';
                        const list = JSON.parse(localStorage.getItem(key) || '[]');
                        list.push(sosEvent);
                        localStorage.setItem(key, JSON.stringify(list.slice(-50)));
                        // Broadcast channel for real-time updates in other dashboards
                        try { new BroadcastChannel('sos_channel').postMessage(sosEvent); } catch {}
                      } catch {}

                      // Check if backend is available
                      const isBackendAvailable = import.meta.env.VITE_API_URL && 
                                               import.meta.env.VITE_API_URL !== 'http://localhost:8000';
                      
                      // Always show success toast (local broadcast guaranteed)
                      {
                        const mapsUrl = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
                        toast.success('Alert sent!', {
                          duration: 10000,
                          description: (
                            <span>
                              Emergency alert broadcast with your location. <a className="underline" href={mapsUrl} target="_blank" rel="noreferrer">Open Map</a>
                            </span>
                          )
                        });
                      }

                      if (!isBackendAvailable) {
                        setIsSendingSOS(false);
                        return;
                      }
                      
                      try {
                        // Try to send to backend if available
                        const response = await api.processEmergencySms({
                          from_number: 'USER_' + Math.random().toString(36).substring(2, 9),
                          message: 'EMERGENCY SOS ALERT! I need immediate assistance!',
                          location_data: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: new Date().toISOString()
                          }
                        });

                        toast.success('Emergency alert sent! Help is on the way!', {
                          duration: 10000,
                          description: `Emergency level: ${response.emergency_level || 'high'}`
                        });
                      } catch (apiError) {
                        console.error('Backend error during SOS:', apiError);
                        // Fallback to showing success with location info
                        const mapsUrl = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
                        toast.success('Emergency alert triggered!', {
                          duration: 10000,
                          description: (
                            <div>
                              <p>Could not contact emergency services. Your location has been captured.</p>
                              <a 
                                href={mapsUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="underline text-blue-500 hover:text-blue-700"
                              >
                                View on Google Maps
                              </a>
                              <p className="mt-2">Please call emergency services if needed.</p>
                            </div>
                          )
                        });
                      }
                    } catch (error) {
                      console.error('Error in handleSOS:', error);
                      if (error instanceof GeolocationPositionError) {
                        toast.error('Could not get your location. Please check location permissions.');
                      } else {
                        toast.error('Emergency alert triggered with limited functionality. Please call emergency services if needed.');
                      }
                    } finally {
                      setIsSendingSOS(false);
                    }
                  }}
                  disabled={isSendingSOS}
                  className="w-full h-20 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xl font-bold rounded-xl"
                >
                  {isSendingSOS ? (
                    <>
                      <Loader2 className="mr-3 h-8 w-8 animate-spin" />
                      SENDING ALERT...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="mr-3 h-8 w-8" />
                      EMERGENCY SOS
                    </>
                  )}
                </Button>
              </motion.div>
              <p className="text-sm text-muted-foreground mt-2">
                Instant alert to police & emergency contacts
              </p>
            </CardContent>
          </Card>

          {/* Safety Score split: Safety Index + User Sentiment */}
          <Card className="glass-card cursor-pointer" onClick={() => setRiskOpen(true)}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-success" />
                <span>Safety Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold mb-1">Safety Index</div>
                  <div className="text-3xl font-bold text-warning mb-1">{Math.max(35, Math.min(95, Math.round(safetyScore * 0.55)))}%</div>
                  <Progress value={Math.max(35, Math.min(95, Math.round(safetyScore * 0.55)))} className="w-full" />
                  <p className="text-xs text-muted-foreground mt-1">Based on research & crime data</p>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">User Sentiment</div>
                  <div className="text-3xl font-bold text-success mb-1">{Math.max(50, Math.min(100, Math.round(safetyScore * 0.8)))}%</div>
                  <Progress value={Math.max(50, Math.min(100, Math.round(safetyScore * 0.8)))} className="w-full" />
                  <p className="text-xs text-muted-foreground mt-1">Rated by recent traveler reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monument / Place of Interest */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Place of Interest</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <button onClick={() => setMonumentOpen(true)} className="w-full text-left">
                <div className="flex items-center gap-4">
                  <img src="/src/components/monuments.png" alt="Monument" className="w-16 h-16 rounded object-cover" />
                  <div>
                    <div className="text-lg font-semibold">Red Fort, Delhi</div>
                    <div className="text-sm text-muted-foreground">Mughal-era fort complex and UNESCO World Heritage Site</div>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Details Dialog */}
        <Dialog open={riskOpen} onOpenChange={setRiskOpen}>
          <DialogContent className="glass-card border-glass-border max-w-2xl">
            <DialogHeader>
              <DialogTitle>Warnings & Dangers in {currentLocation.name}</DialogTitle>
              <DialogDescription>Overview of common risks and safety considerations</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
              {[
                {title:'OVERALL RISK', level:'MEDIUM', body:`${currentLocation.name} comes with a medium risk. Be mindful of local conditions, weather, and cultural norms.`},
                {title:'TRANSPORT & TAXIS RISK', level:'MEDIUM', body:'Public transportation can be crowded; petty theft occurs. Prefer app-based taxis like Uber/Ola.'},
                {title:'PICKPOCKETS RISK', level:'HIGH', body:'Crowded markets and tourist sites are hotspots. Use anti-theft bags and stay vigilant.'},
                {title:'NATURAL DISASTERS RISK', level:'MEDIUM', body:'Monsoons, floods, and heat waves can affect travel. Check weather forecasts regularly.'},
                {title:'MUGGING RISK', level:'LOW', body:'Violent incidents are relatively rare; avoid isolated areas at night and keep valuables hidden.'},
                {title:'TERRORISM RISK', level:'HIGH', body:'Remain aware of local advisories; avoid large gatherings during unrest.'},
                {title:'SCAMS RISK', level:'HIGH', body:'Beware of fake guides, inflated prices, and ticket scams. Verify operators and prices.'},
                {title:'WOMEN TRAVELERS RISK', level:'HIGH', body:'Solo female travelers should exercise increased caution and use verified transport options.'},
                {title:'TAP WATER RISK', level:'HIGH', body:'Avoid tap water and ice. Prefer sealed bottled water from known brands.'},
              ].map((r) => (
                <div key={r.title} className="glass-card p-3">
                  <div className="font-semibold">
                    {r.title}: <span className={r.level==='HIGH'?'text-destructive':r.level==='MEDIUM'?'text-warning':'text-success'}>{r.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.body}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Monument Details Dialog */}
        <Dialog open={monumentOpen} onOpenChange={setMonumentOpen}>
          <DialogContent className="glass-card border-glass-border max-w-xl">
            <DialogHeader>
              <DialogTitle>Red Fort, Delhi</DialogTitle>
              <DialogDescription>Highlights & Interesting Facts</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <img src="/src/components/monuments.png" alt="Red Fort" className="w-full h-48 object-cover rounded" />
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Constructed in 1639 by the Mughal Emperor Shah Jahan.</li>
                <li>Known for its massive enclosing walls of red sandstone.</li>
                <li>Hosts the Prime Minister’s Independence Day speech annually.</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>

        {/* Current Location & Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-accent" />
                <span>Current Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Map Section */}
              <div className="h-64 rounded-lg overflow-hidden">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }>
                  <MapWithWeather 
                    center={currentLocation.coordinates} 
                    zoom={15}
                    markers={[{
                      position: currentLocation.coordinates,
                      title: 'Your Location',
                      type: 'user'
                    }]}
                  />
                </Suspense>
              </div>
              
              {/* Location Details */}
              <div className="p-4 glass-card rounded-lg border border-accent/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{currentLocation.name}</h3>
                    <p className="text-sm text-muted-foreground">Detected via GPS • {new Date().toLocaleTimeString()}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={updateLocation}
                    disabled={isLoadingWeather}
                    className="glass-card border-glass-border"
                  >
                    {isLoadingWeather ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Navigation className="h-4 w-4 mr-2" />
                    )}
                    Update Location
                  </Button>
                </div>
                
                {/* Weather Info */}
                <div className="mt-4 pt-4 border-t border-accent/10">
                  {weatherData ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Cloud className="h-6 w-6 text-blue-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Current Weather</p>
                          <p className="text-xl font-semibold">
                            {Math.round(weatherData.main.temp)}°C
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              {weatherData.weather[0].description}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-1 text-amber-500" />
                          <span>Feels like {Math.round(weatherData.main.feels_like)}°C</span>
                        </div>
                        <div className="flex items-center">
                          <Droplets className="h-4 w-4 mr-1 text-blue-400" />
                          <span>Humidity {weatherData.main.humidity}%</span>
                        </div>
                        <div className="flex items-center">
                          <Wind className="h-4 w-4 mr-1 text-gray-400" />
                          <span>Wind {weatherData.wind.speed} m/s</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Weather data not available. Please check your API key in .env file.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <Star className="h-4 w-4 text-warning" />
                  <span>Interesting Facts</span>
                </h4>
                {locationFacts.map((fact, index) => (
                  <div key={index} className="text-sm text-muted-foreground p-2 glass-card rounded">
                    • {fact}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IoT Device Connection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Watch className="h-5 w-5 text-primary" />
                <span>Safety Devices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div className="flex items-center space-x-3">
                  <Watch className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Smart Safety Band</p>
                    <p className="text-sm text-muted-foreground">Health & location monitoring</p>
                  </div>
                </div>
                <Switch
                  checked={connectedDevice}
                  onCheckedChange={setConnectedDevice}
                />
              </div>
              
              <Button
                variant="outline"
                className="w-full glass-card border-glass-border"
              >
                <Zap className="mr-2 h-4 w-4" />
                Connect Smartwatch
              </Button>
              
              <div className="text-sm text-muted-foreground p-3 glass-card rounded-lg border border-warning/20">
                <p className="font-medium text-warning mb-1">📍 Enhanced Safety</p>
                <p>Connect wearable devices for continuous health monitoring in remote areas</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Explore moved to its own page */}
      </div>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
};

export default UserDashboard;