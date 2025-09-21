import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Calendar, Landmark, MapPin, Users, UserCheck, Star, Shield, BarChart3, LogOut, Map, Cloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, connectDashboardWS } from "@/lib/api";
import MapWithWeather from "@/components/MapWithWeather";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type MonumentKey = "Red Fort" | "Taj Mahal" | "Qutub Minar" | "Hawa Mahal" | "India Gate";

const MONUMENTS: { id: MonumentKey; city: string; dailyCapacity: number; openingHours: string; entryFeeIndia: number }[] = [
  { id: "Red Fort", city: "Delhi", dailyCapacity: 15000, openingHours: "6 AM - 7 PM", entryFeeIndia: 25 },
  { id: "Taj Mahal", city: "Agra", dailyCapacity: 22000, openingHours: "6 AM - 6:30 PM", entryFeeIndia: 50 },
  { id: "Qutub Minar", city: "Delhi", dailyCapacity: 10000, openingHours: "7 AM - 6 PM", entryFeeIndia: 30 },
  { id: "Hawa Mahal", city: "Jaipur", dailyCapacity: 9000, openingHours: "9 AM - 5 PM", entryFeeIndia: 20 },
  { id: "India Gate", city: "Delhi", dailyCapacity: 18000, openingHours: "Open 24/7", entryFeeIndia: 0 },
];

// Seeded random for reproducible data
function seededRandom(seed: number) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function generateHourlyEntries(monument: MonumentKey, dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const seed = year * 10000 + month * 100 + day + monument.length * 97;
  const base = 50 + Math.floor(seededRandom(seed) * 100);
  const data = [];
  for (let h = 6; h <= 19; h++) {  // 6 AM - 7 PM consistent with opening hours
    const wave = Math.sin((Math.PI * (h - 6)) / 13); // peak midday
    const noise = (seededRandom(seed + h * 13) - 0.5) * 20;
    const entries = Math.max(0, Math.round(base * (0.5 + 0.7 * wave) + noise));
    data.push({ hour: `${h}:00`, entries });
  }
  return data;
}

const cities = ["Delhi", "Agra", "Jaipur"] as const;

const TourismDashboard = () => {
  const [city, setCity] = useState<typeof cities[number]>("Delhi");
  const [monument, setMonument] = useState<MonumentKey>("Red Fort");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState("analytics");
  const [metrics, setMetrics] = useState<{ active_tourists?: number; recent_alerts?: number } | null>(null);
  const [routeDeviations, setRouteDeviations] = useState<Array<any>>([]);
  const [sosEvents, setSosEvents] = useState<Array<any>>([]);

  const filteredMonuments = useMemo(() => MONUMENTS.filter(m => m.city === city), [city]);
  const selectedMonumentDetail = useMemo(() => MONUMENTS.find((m) => m.id === monument)!, [monument]);
  const hourlyData = useMemo(() => generateHourlyEntries(monument, date), [monument, date]);
  const totalVisitors = useMemo(() => hourlyData.reduce((sum, d) => sum + d.entries, 0), [hourlyData]);

  const peakToday = Math.max(...hourlyData.map((h) => h.entries));
  const revenue = (totalVisitors * selectedMonumentDetail.entryFeeIndia) / 100000; // Revenue in Lakhs

  const domesticTourists = Math.round(totalVisitors * 0.75);
  const foreignTourists = totalVisitors - domesticTourists;

  const currentOccupancyPercent = (totalVisitors / selectedMonumentDetail.dailyCapacity) * 100;

  // Load route deviation events from localStorage every 10s
  useEffect(() => {
    const load = () => {
      try {
        const list = JSON.parse(localStorage.getItem('route_deviation_events') || '[]');
        setRouteDeviations(list.reverse());
      } catch { setRouteDeviations([]); }
    };
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  // Load SOS events and listen for real-time updates
  useEffect(() => {
    const load = () => {
      try {
        const list = JSON.parse(localStorage.getItem('sos_events') || '[]');
        setSosEvents(list.reverse());
      } catch { setSosEvents([]); }
    };
    load();
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('sos_channel');
      bc.onmessage = () => load();
    } catch {}
    const id = setInterval(load, 10000);
    return () => { try { bc?.close(); } catch {}; clearInterval(id); };
  }, []);

  // Travel guides (stateful for UI actions)
  const [travelGuides, setTravelGuides] = useState([
    { id: 1, name: "Rajesh Kumar", experience: "5 years", rating: 4.8, location: "Delhi", status: "Available", assignedTo: null },
    { id: 2, name: "Priya Sharma", experience: "3 years", rating: 4.6, location: "Agra", status: "Busy", assignedTo: "TKT-123456" },
    { id: 3, name: "Amit Singh", experience: "7 years", rating: 4.9, location: "Jaipur", status: "Available", assignedTo: null },
    { id: 4, name: "Sneha Patel", experience: "4 years", rating: 4.7, location: "Delhi", status: "Available", assignedTo: null },
    { id: 5, name: "Vikram Joshi", experience: "6 years", rating: 4.5, location: "Agra", status: "Busy", assignedTo: "TKT-789012" },
  ] as Array<{ id:number; name:string; experience:string; rating:number; location:string; status:"Available"|"Busy"; assignedTo:string|null }>);

  const handleAssignGuide = (guideId: number) => {
    const touristId = prompt("Enter Tourist ID to assign guide:");
    if (!touristId) return;
    setTravelGuides(prev => prev.map(g => g.id === guideId ? { ...g, status: "Busy", assignedTo: touristId } : g));
    alert(`Guide assigned to ${touristId}`);
  };

  // Mock data for tourist safety scores
  const touristSafetyScores = [
    { touristId: "T-001", name: "John Doe", location: "Red Fort", score: 92, status: "Safe" },
    { touristId: "T-002", name: "Jane Smith", location: "Taj Mahal", score: 88, status: "Safe" },
    { touristId: "T-003", name: "Mike Johnson", location: "Qutub Minar", score: 95, status: "Very Safe" },
    { touristId: "T-004", name: "Sarah Wilson", location: "India Gate", score: 76, status: "Caution" },
    { touristId: "T-005", name: "David Brown", location: "Hawa Mahal", score: 89, status: "Safe" },
  ];

  // Sample markers for the map
  const mapMarkers = [
    {
      position: { lat: 28.6139, lng: 77.2090 },
      title: 'Tourism Office',
      type: 'tourism' as const
    },
    {
      position: { lat: 28.6200, lng: 77.2050 },
      title: 'Police Station',
      type: 'police' as const
    },
    {
      position: { lat: 28.6100, lng: 77.2150 },
      title: 'Tourist Group',
      type: 'user' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="glass-card backdrop-blur-xl border-b border-glass-border sticky top-2 z-10 mx-4 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            <Landmark className="h-5 w-5 text-accent" />
            <h1 className="text-lg font-bold gradient-text">
              Tourism Department <span className="text-accent">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
                window.location.href = "/";
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Try to fetch real metrics from backend */}
        <div className="hidden">
          {(() => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              let ws: WebSocket | null = null;
              (async () => {
                try {
                  const m = await api.getDashboardMetrics();
                  setMetrics(m);
                } catch { /* ignore */ }
                try {
                  ws = connectDashboardWS((msg) => {
                    if (msg?.type === "tourist_update") {
                      setMetrics((prev) => ({ ...prev, recent_alerts: (prev?.recent_alerts || 0) + (msg.data?.alerts_count ? 1 : 0) }));
                    }
                  });
                } catch { /* ignore */ }
              })();
              return () => { try { ws?.close(); } catch {} };
            }, []);
            return null;
          })()}
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="guides">Travel Guides</TabsTrigger>
            <TabsTrigger value="safety">Safety Score</TabsTrigger>
            <TabsTrigger value="tracking">Real-time Tracking</TabsTrigger>
            <TabsTrigger value="social">Social Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">

        {/* Filters */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Select City</span>
              </CardTitle>
              <CardDescription>Choose a city to filter monuments</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={city} onValueChange={(val) => setCity(val as typeof city)}>
                <SelectTrigger className="glass-card border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border">
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Select Monument</span>
              </CardTitle>
              <CardDescription>Choose a monument to view visitor analytics.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={monument} onValueChange={(val) => setMonument(val as MonumentKey)}>
                <SelectTrigger className="glass-card border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border max-h-60 overflow-auto">
                  {filteredMonuments.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex justify-between w-full">
                        <span>{m.id}</span>
                        <Badge variant="secondary" className="ml-2">{m.city}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Select Date</span>
              </CardTitle>
              <CardDescription>Select date for visitor data analytics.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="glass-card border-glass-border"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Summary */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="glass-card p-5 flex items-center space-x-4">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Current Visitors</p>
              <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="glass-card p-5 flex items-center space-x-4">
            <svg
              className="h-10 w-10 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 17l3-3 3 3"></path>
              <path d="M12 12v9"></path>
            </svg>
            <div>
              <p className="text-sm text-muted-foreground">Peak Today</p>
              <p className="text-3xl font-bold">{peakToday.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="glass-card p-5 flex items-center space-x-4">
            <svg
              className="h-10 w-10 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18"></path>
              <path d="M12 3v18"></path>
            </svg>
            <div>
              <p className="text-sm text-muted-foreground">Revenue (₹)</p>
              <p className="text-3xl font-bold">₹{revenue.toFixed(1)}L</p>
            </div>
          </Card>
        </motion.div>

        {/* Hourly Visitor Traffic Chart */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Hourly Visitor Traffic</CardTitle>
            <CardDescription>Live Data for {monument}, {date}</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="hour" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip
                  labelFormatter={(val) => `${val} hrs`}
                  formatter={(value) => [value.toLocaleString(), "Visitors"]}
                />
                <Line type="monotone" dataKey="entries" stroke="url(#colorUv)" strokeWidth={3} dot={false} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monument Details and Today’s Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Monument Details */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-3">Monument Details</h3>
            <p className="mb-1 font-semibold">{monument}, {selectedMonumentDetail.city}</p>
            <p className="mb-3 text-muted-foreground">UNESCO World Heritage Site</p>
            <div className="border-t border-glass-border pt-4 space-y-2 text-sm text-muted-foreground">
              <p><strong>Daily Capacity:</strong> {selectedMonumentDetail.dailyCapacity.toLocaleString()}</p>
              <p><strong>Opening Hours:</strong> {selectedMonumentDetail.openingHours}</p>
              <p><strong>Entry Fee:</strong> ₹{selectedMonumentDetail.entryFeeIndia} (Indians)</p>
            </div>
            <div className="mt-4 h-40 rounded-md bg-glass border border-glass-border flex items-center justify-center text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4m0 0l4 4m-4-4v12" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12v8" />
              </svg>
              <p className="ml-3 text-sm">Image Placeholder</p>
            </div>
          </Card>

          {/* Today’s Summary */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-3">Today's Summary</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Total Entries: <strong>{totalVisitors.toLocaleString()}</strong></li>
              <li>Foreign Tourists: <strong>{foreignTourists.toLocaleString()}</strong></li>
              <li>Domestic Tourists: <strong>{domesticTourists.toLocaleString()}</strong></li>
              <li>Revenue Generated: <strong className="text-green-600">₹{revenue.toFixed(1)}L</strong></li>
            </ul>
          </Card>

          {/* Quick Actions (placeholders for enabled buttons) */}
          <Card className="glass-card p-6 flex flex-col space-y-4">
            <h3 className="text-xl font-semibold">Quick Actions</h3>
            <Button onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}>View Live Feed</Button>
            <Button onClick={() => {
              // Export hourlyData to CSV
              const header = 'hour,entries\n';
              const rows = hourlyData.map(r => `${r.hour},${r.entries}`).join('\n');
              const blob = new Blob([header + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `visitor_report_${monument}_${date}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}>Download Report</Button>
            <Button onClick={() => alert('Alerts configured for high crowd and route deviation events.')}>Set Alerts</Button>
          </Card>
        </div>

        {/* Capacity Analysis */}
        <Card className="glass-card mt-6 p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l3-3 3 3" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v9" />
            </svg>
            <span>Capacity Analysis</span>
          </h3>
          <p className="mb-3">Current Occupancy: <strong>{currentOccupancyPercent.toFixed(0)}%</strong></p>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{ width: `${currentOccupancyPercent}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {selectedMonumentDetail.dailyCapacity.toLocaleString()}
          </p>
        </Card>

        {/* Map and Weather Section */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Live Map & Weather
              </CardTitle>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Cloud className="h-4 w-4 mr-1" />
                <span>Click on the map to view weather details</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-lg overflow-hidden">
              <MapWithWeather 
                center={{ lat: 28.6139, lng: 77.2090 }} 
                zoom={13}
                markers={mapMarkers}
              />
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Travel Guides Management</CardTitle>
                <CardDescription>Manage and assign travel guides to tourists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {travelGuides.map((guide) => (
                    <Card key={guide.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{guide.name}</h3>
                            <p className="text-sm text-muted-foreground">{guide.experience} experience</p>
                            <p className="text-sm text-muted-foreground">Location: {guide.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary">{guide.rating}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge variant={guide.status === "Available" ? "default" : "secondary"}>
                              {guide.status}
                            </Badge>
                            {guide.assignedTo && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Assigned to: {guide.assignedTo}
                              </p>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAssignGuide(guide.id)}
                          >
                            Assign Guide
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              if (confirm(`Elevate ${guide.name} to police department?`)) {
                                alert(`Guide ${guide.name} has been elevated to police department for investigation`);
                              }
                            }}
                          >
                            Elevate to Police
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Tourist Safety Score</CardTitle>
                <CardDescription>Monitor safety scores of tourists based on travel patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {touristSafetyScores.map((tourist) => (
                    <Card key={tourist.touristId} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{tourist.name}</h3>
                            <p className="text-sm text-muted-foreground">ID: {tourist.touristId}</p>
                            <p className="text-sm text-muted-foreground">Location: {tourist.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{tourist.score}</div>
                            <Badge variant={
                              tourist.status === "Very Safe" ? "default" :
                              tourist.status === "Safe" ? "secondary" : "destructive"
                            }>
                              {tourist.status}
                            </Badge>
                          </div>
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                              style={{ width: `${tourist.score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Real-time Itinerary Tracking</CardTitle>
                <CardDescription>Monitor active tourist itineraries and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Route deviation feed from tourists */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Recent Route Deviations</h3>
                    {routeDeviations.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No deviations detected in the last session.</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-auto">
                        {routeDeviations.map((ev) => (
                          <div key={ev.id} className="flex items-center justify-between p-2 glass-card rounded">
                            <div>
                              <div className="text-sm font-medium">Tourist {ev.touristId} route deviation</div>
                              <div className="text-xs text-muted-foreground">{new Date(ev.at).toLocaleString()}</div>
                              <div className="text-xs mt-1">
                                Travelling from <span className="font-medium">Planned Center ({ev.city})</span>
                                <span> → Current Position </span>
                                <span className="text-muted-foreground">({ev.location.lat.toFixed(4)},{ev.location.lng.toFixed(4)})</span>
                                <span className="ml-2">• Deviation: <span className="font-medium">{ev.distance_m} m</span></span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${ev.planned_center?.lat || ev.location.lat},${ev.planned_center?.lng || ev.location.lng}&destination=${ev.location.lat},${ev.location.lng}`, '_blank')}>Directions</Button>
                              <Button size="sm" variant="ghost" onClick={() => window.open(`https://www.google.com/maps?q=${ev.location.lat},${ev.location.lng}`, '_blank')}>View Map</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* SOS Events Feed */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Live SOS Alerts</h3>
                    {sosEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No SOS alerts</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-auto">
                        {sosEvents.map((sos) => (
                          <div key={sos.id} className="p-2 glass-card rounded">
                            <div className="text-sm font-medium">Tourist {sos.touristId} SOS</div>
                            <div className="text-xs text-muted-foreground">{new Date(sos.at).toLocaleString()}</div>
                            <div className="text-xs mt-1">Location: {sos.location.lat.toFixed(4)},{sos.location.lng.toFixed(4)} (±{Math.round(sos.location.accuracy || 0)}m)</div>
                            {sos.transcript && (
                              <div className="text-xs mt-1">Transcript: <span className="font-medium">{sos.transcript}</span></div>
                            )}
                            {sos.audio && (
                              <audio controls src={sos.audio} className="mt-2 w-full" />
                            )}
                            <div className="mt-2 flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => window.open(`https://www.google.com/maps?q=${sos.location.lat},${sos.location.lng}`, '_blank')}>View</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                  {/* Mock data for active itineraries */}
                  {[
                    {
                      id: "IT-001",
                      tourist: "John Doe",
                      city: "Delhi",
                      currentLocation: "Red Fort",
                      progress: 60,
                      guide: "Rajesh Kumar",
                      status: "In Progress",
                      nextStop: "India Gate"
                    },
                    {
                      id: "IT-002", 
                      tourist: "Sarah Wilson",
                      city: "Agra",
                      currentLocation: "Taj Mahal",
                      progress: 100,
                      guide: "Priya Sharma",
                      status: "Completed",
                      nextStop: "Hotel"
                    },
                    {
                      id: "IT-003",
                      tourist: "Mike Johnson",
                      city: "Jaipur",
                      currentLocation: "Amber Fort",
                      progress: 30,
                      guide: "Amit Singh",
                      status: "In Progress",
                      nextStop: "Hawa Mahal"
                    }
                  ].map((itinerary) => (
                    <Card key={itinerary.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{itinerary.tourist}</h3>
                            <p className="text-sm text-muted-foreground">ID: {itinerary.id}</p>
                            <p className="text-sm text-muted-foreground">City: {itinerary.city}</p>
                            <p className="text-sm text-muted-foreground">Current: {itinerary.currentLocation}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={
                                itinerary.status === "Completed" ? "default" :
                                itinerary.status === "In Progress" ? "secondary" : "outline"
                              }>
                                {itinerary.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Guide: {itinerary.guide}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{itinerary.progress}%</div>
                            <div className="w-20 h-2 bg-muted rounded-full">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                                style={{ width: `${itinerary.progress}%` }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Next: {itinerary.nextStop}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              alert(`Itinerary Details:\n\nTourist: ${itinerary.tourist}\nID: ${itinerary.id}\nCity: ${itinerary.city}\nCurrent Location: ${itinerary.currentLocation}\nStatus: ${itinerary.status}\nProgress: ${itinerary.progress}%\nGuide: ${itinerary.guide}\nNext Stop: ${itinerary.nextStop}`);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Social Media Feed</CardTitle>
                <CardDescription>Monitor tourist posts and feedback from social media platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Social posts with local actions */}
                  {[
                    {
                      id: "post-1",
                      platform: "X (Twitter)",
                      username: "@traveler_john",
                      name: "John Smith",
                      content: "Amazing experience at Red Fort today! The guide Rajesh was fantastic and very knowledgeable. Highly recommend SafeRove for tourists visiting Delhi! 🏛️✨",
                      timestamp: "2 hours ago",
                      likes: 24,
                      retweets: 8,
                      sentiment: "positive"
                    },
                    {
                      id: "post-2", 
                      platform: "X (Twitter)",
                      username: "@sarah_wanderer",
                      name: "Sarah Wilson",
                      content: "Just completed my Taj Mahal visit with SafeRove. The safety measures and guide support were excellent. Felt secure throughout the entire trip! 🕌",
                      timestamp: "4 hours ago",
                      likes: 18,
                      retweets: 5,
                      sentiment: "positive"
                    },
                    {
                      id: "post-3",
                      platform: "X (Twitter)",
                      username: "@mike_explorer",
                      name: "Mike Johnson",
                      content: "Had some issues with the guide not showing up on time at Amber Fort. The customer service team resolved it quickly though. Overall good experience.",
                      timestamp: "6 hours ago",
                      likes: 12,
                      retweets: 2,
                      sentiment: "neutral"
                    },
                    {
                      id: "post-4",
                      platform: "X (Twitter)",
                      username: "@emma_travels",
                      name: "Emma Davis",
                      content: "The real-time tracking feature is amazing! My family could see exactly where I was during my Delhi tour. Great peace of mind for solo travelers! 📍",
                      timestamp: "8 hours ago",
                      likes: 31,
                      retweets: 12,
                      sentiment: "positive"
                    },
                    {
                      id: "post-5",
                      platform: "X (Twitter)",
                      username: "@david_adventurer",
                      name: "David Brown",
                      content: "Safety score feature helped me choose the best routes in Jaipur. The AI recommendations were spot on! Technology making travel safer 🛡️",
                      timestamp: "12 hours ago",
                      likes: 15,
                      retweets: 7,
                      sentiment: "positive"
                    }
                  ].map((post) => (
                    <Card key={post.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {post.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{post.name}</h3>
                            <span className="text-sm text-muted-foreground">{post.username}</span>
                            <Badge variant="outline" className="text-xs">
                              {post.platform}
                            </Badge>
                            <Badge variant={
                              post.sentiment === "positive" ? "default" :
                              post.sentiment === "neutral" ? "secondary" : "destructive"
                            } className="text-xs">
                              {post.sentiment}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{post.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{post.timestamp}</span>
                            <span>❤️ {post.likes}</span>
                            <span>🔄 {post.retweets}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline" onClick={() => alert(`Responded to ${post.username}`)}>Respond</Button>
                          <Button size="sm" variant="outline" onClick={(e) => { (e.currentTarget as HTMLButtonElement).innerText = 'Flagged'; (e.currentTarget as HTMLButtonElement).disabled = true; }}>Flag</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TourismDashboard;


