import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { SITE_NAME } from "@/lib/brand";
import brandLogo from "@/components/logo2.jpg";
import {
    Activity,
    AlertTriangle,
    Bell,
    CheckCircle,
    Clock,
    LogOut,
    MapPin,
    Navigation,
    Phone,
    Search,
    Settings,
    Shield,
    TrendingUp,
    User,
    Users,
    FileText,
    UserCheck
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Complaint {
  id: string;
  type: "emergency" | "missing" | "safety" | "theft" | "medical";
  tourist: {
    name: string;
    id: string;
    nationality: string;
    phone: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: Date;
  status: "open" | "assigned" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  assignedStation: string;
  assignedOfficer?: string;
  description: string;
}

interface EFir {
  id: string;
  title: string;
  description: string;
  location: string;
  contactNumber: string;
  witnesses: string;
  timestamp: Date;
  status: "pending" | "under-investigation" | "resolved";
  assignedOfficer?: string;
}

const PoliceDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sosEvents, setSosEvents] = useState<Array<any>>([]);

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "C001",
      type: "emergency",
      tourist: {
        name: "Sarah Johnson",
        id: "ST-B2C3D4E5",
        nationality: "USA",
        phone: "+91-9876543210"
      },
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: "India Gate, New Delhi"
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      status: "open",
      priority: "critical",
      assignedStation: "New Delhi Police Station",
      description: "Tourist pressed panic button, not responding to calls"
    },
    {
      id: "C002",
      type: "missing",
      tourist: {
        name: "Michael Chen",
        id: "ST-A1B2C3D4",
        nationality: "Canada",
        phone: "+91-9876543211"
      },
      location: {
        lat: 28.6562,
        lng: 77.2410,
        address: "Red Fort, Delhi"
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: "assigned",
      priority: "high",
      assignedStation: "Red Fort Police Post",
      assignedOfficer: "Sub-Inspector Kumar",
      description: "Last seen at Red Fort, not reachable since 2 hours"
    },
    {
      id: "C003",
      type: "theft",
      tourist: {
        name: "Emma Wilson",
        id: "ST-F5G6H7I8",
        nationality: "UK",
        phone: "+91-9876541234"
      },
      location: {
        lat: 28.6289,
        lng: 77.2065,
        address: "Connaught Place, New Delhi"
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      status: "in-progress",
      priority: "medium",
      assignedStation: "Connaught Place Police Station",
      assignedOfficer: "Constable Singh",
      description: "Wallet and passport stolen at market area"
    }
  ]);

  const [eFirs, setEFirs] = useState<EFir[]>([
    {
      id: "FIR001",
      title: "Theft at Red Fort",
      description: "Tourist reported theft of wallet and mobile phone while visiting Red Fort",
      location: "Red Fort, Delhi",
      contactNumber: "+91-9876543210",
      witnesses: "John Smith, Mary Johnson",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "under-investigation",
      assignedOfficer: "Sub-Inspector Kumar"
    },
    {
      id: "FIR002",
      title: "Harassment at India Gate",
      description: "Female tourist reported verbal harassment by unknown person",
      location: "India Gate, New Delhi",
      contactNumber: "+91-9876541234",
      witnesses: "None",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "pending"
    },
    {
      id: "FIR003",
      title: "Lost Passport",
      description: "Tourist lost passport and other important documents",
      location: "Connaught Place, New Delhi",
      contactNumber: "+91-9876545678",
      witnesses: "None",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: "resolved",
      assignedOfficer: "Constable Singh"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);
  const navigate = useNavigate();

  const stats = {
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(c => c.status === "open").length,
    resolvedToday: complaints.filter(c => c.status === "resolved").length,
    criticalAlerts: complaints.filter(c => c.priority === "critical").length
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-500 text-white";
      case "assigned": return "bg-blue-500 text-white";
      case "in-progress": return "bg-yellow-500 text-white";
      case "resolved": return "bg-green-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const handleAssignComplaint = (complaintId: string) => {
    setComplaints(prev => prev.map(c => 
        c.id === complaintId 
        ? { ...c, status: "assigned" as const, assignedOfficer: "Officer Smith" }
          : c
    ));
  };

  const handleResolveComplaint = (complaintId: string) => {
    setComplaints(prev => prev.map(c => 
        c.id === complaintId 
        ? { ...c, status: "resolved" as const }
        : c
    ));
  };

  const responseTimeData = [
    { hour: "00:00", mins: 15 },
    { hour: "04:00", mins: 12 },
    { hour: "08:00", mins: 8 },
    { hour: "12:00", mins: 5 },
    { hour: "16:00", mins: 7 },
    { hour: "20:00", mins: 10 }
  ];

  const categoriesData = [
    { name: "Emergency", value: 5 },
    { name: "Missing Person", value: 3 },
    { name: "Theft", value: 8 },
    { name: "Safety Concern", value: 4 },
    { name: "Medical", value: 2 }
  ];
  const pieColors = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e", "#8b5cf6"];

  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="glass-card backdrop-blur-xl border-b border-glass-border sticky top-2 z-10 mx-4 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={brandLogo} alt={SITE_NAME} className="h-8 w-8 rounded-full object-cover" />
                <div className="absolute -top-1 -right-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-destructive rounded-full"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Police Command Center</h1>
                <p className="text-xs text-muted-foreground">Real-time Tourist Safety Monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-destructive text-destructive-foreground px-3 py-1">
                {stats.criticalAlerts} Critical Alerts
              </Badge>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="efir">e-FIR</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                  <p className="text-3xl font-bold">{stats.totalComplaints}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Cases</p>
                  <p className="text-3xl font-bold text-destructive">{stats.openComplaints}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                  <p className="text-3xl font-bold text-success">{stats.resolvedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                  <p className="text-3xl font-bold text-warning">{stats.criticalAlerts}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Response Time Analytics</CardTitle>
                  </CardHeader>
                  <CardContent style={{ height: 280 }}>
                    <ResponsiveContainer>
                      <LineChart data={responseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis dataKey="hour" />
                        <YAxis unit="m" />
                        <Tooltip />
                        <Line type="monotone" dataKey="mins" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Complaint Categories</CardTitle>
                  </CardHeader>
                  <CardContent style={{ height: 280 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={categoriesData} dataKey="value" nameKey="name" outerRadius={90} label>
                          {categoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Complaints Management</CardTitle>
                <CardDescription>View and manage all tourist complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <Card key={complaint.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{complaint.tourist.name}</h3>
                            <p className="text-sm text-muted-foreground">ID: {complaint.tourist.id}</p>
                            <p className="text-sm text-muted-foreground">{complaint.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={
                                complaint.priority === "critical" ? "destructive" :
                                complaint.priority === "high" ? "default" : "secondary"
                              }>
                                {complaint.priority}
                              </Badge>
                              <Badge variant="outline">{complaint.status}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Assign Officer
                          </Button>
                          <Button size="sm">
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

          <TabsContent value="efir" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>e-FIR Management</CardTitle>
                <CardDescription>View and manage electronic First Information Reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eFirs.map((fir) => (
                    <Card key={fir.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{fir.title}</h3>
                            <p className="text-sm text-muted-foreground">ID: {fir.id}</p>
                            <p className="text-sm text-muted-foreground">{fir.description}</p>
                            <p className="text-sm text-muted-foreground">Location: {fir.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={
                                fir.status === "resolved" ? "default" :
                                fir.status === "under-investigation" ? "secondary" : "outline"
                              }>
                                {fir.status}
                              </Badge>
                              {fir.assignedOfficer && (
                                <Badge variant="outline">Officer: {fir.assignedOfficer}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Assign Officer
                          </Button>
                          <Button size="sm">
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
          </Tabs>
      </div>
    </div>
  );
};

export default PoliceDashboard;