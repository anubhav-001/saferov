import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Calendar, Edit, MapPin, Plus, Users, X, Shield, Link } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, TripData } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", 
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur"
];

// Rough city centers for deviation checks (approx)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Kanpur: { lat: 26.4499, lng: 80.3319 },
  Nagpur: { lat: 21.1458, lng: 79.0882 },
};

const ATTRACTIONS = {
  "Delhi": ["Red Fort", "India Gate", "Qutub Minar", "Lotus Temple", "Akshardham", "Humayun's Tomb"],
  "Mumbai": ["Gateway of India", "Marine Drive", "Elephanta Caves", "Siddhivinayak Temple", "Juhu Beach"],
  "Bangalore": ["Lalbagh Botanical Garden", "Cubbon Park", "Bangalore Palace", "ISKCON Temple", "Vidhana Soudha"],
  "Chennai": ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "Guindy National Park", "San Thome Basilica"],
  "Kolkata": ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Kali Temple", "Indian Museum", "Eden Gardens"],
  "Hyderabad": ["Charminar", "Golconda Fort", "Hussain Sagar Lake", "Ramoji Film City", "Salar Jung Museum"],
  "Pune": ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Dagdusheth Halwai Temple", "Katraj Snake Park"],
  "Ahmedabad": ["Sabarmati Ashram", "Sidi Saiyyed Mosque", "Adalaj Stepwell", "Kankaria Lake", "Calico Museum"],
  "Jaipur": ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Nahargarh Fort"],
  "Lucknow": ["Bara Imambara", "Chota Imambara", "Rumi Darwaza", "Hazratganj", "Lucknow Zoo"],
  "Kanpur": ["Jain Glass Temple", "Allen Forest Zoo", "Ganga Barrage", "Kanpur Memorial Church", "Nana Rao Park"],
  "Nagpur": ["Deekshabhoomi", "Ambazari Lake", "Raman Science Centre", "Sitabuldi Fort", "Futala Lake"]
};

const HOTELS = {
  "Delhi": ["Taj Palace", "The Leela Palace", "ITC Maurya", "The Oberoi", "The Park"],
  "Mumbai": ["Taj Mahal Palace", "The Oberoi", "ITC Maratha", "JW Marriott", "The Leela"],
  "Bangalore": ["The Leela Palace", "Taj West End", "ITC Gardenia", "JW Marriott", "The Oberoi"],
  "Chennai": ["Taj Coromandel", "The Leela Palace", "ITC Grand Chola", "Park Hyatt", "The Raintree"],
  "Kolkata": ["The Oberoi Grand", "Taj Bengal", "ITC Sonar", "The Park", "Hyatt Regency"],
  "Hyderabad": ["Taj Falaknuma Palace", "ITC Kakatiya", "The Park", "Novotel", "Radisson Blu"],
  "Pune": ["JW Marriott", "The Westin", "Hyatt Regency", "Novotel", "Radisson Blu"],
  "Ahmedabad": ["Taj Skyline", "Hyatt Regency", "Novotel", "Radisson Blu", "The Fern"],
  "Jaipur": ["Rambagh Palace", "The Oberoi Rajvilas", "Taj Jai Mahal Palace", "ITC Rajputana", "The Leela Palace"],
  "Lucknow": ["Taj Residency", "Novotel", "Radisson Blu", "The Park", "Clarks Awadh"],
  "Kanpur": ["Radisson Blu", "The Landmark", "Hotel Landmark", "Hotel Kanpur Central", "Hotel Clarks Avadh"],
  "Nagpur": ["Radisson Blu", "The Pride Hotel", "Hotel Centre Point", "Hotel Tuli International", "Hotel Hardeo"]
};

interface ItineraryItem {
  id: string;
  day: number;
  attraction: string;
  time: string;
  duration: string;
}

interface TripItinerary {
  id: string;
  title: string;
  city: string;
  startDate: string;
  endDate: string;
  travelers: number;
  hotel: string;
  attractions: string[];
  itinerary: ItineraryItem[];
  created: string;
  blockchainData?: {
    trip_id: string;
    tx_hash: string;
    expiry_date: string;
    status: string;
  };
}

const TripItineraryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");
  const [isCreating, setIsCreating] = useState(false);
  const [itineraries, setItineraries] = useState<TripItinerary[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<TripItinerary | null>(null);
  
  // Create Itinerary Form
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    hotel: "",
    selectedAttractions: [] as string[]
  });

  // SafeRove Itinerary Form
  const [safeRoveForm, setSafeRoveForm] = useState({
    city: "",
    startDate: "",
    endDate: "",
    travelers: 1
  });

  const handleCreateItinerary = async () => {
    if (!formData.title || !formData.city || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Calculate trip duration in hours
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
      
      // Register trip on blockchain
      const tripData: TripData = {
        title: formData.title,
        city: formData.city,
        start_date: formData.startDate,
        end_date: formData.endDate,
        travelers: formData.travelers,
        attractions: formData.selectedAttractions,
        duration_hours: durationHours
      };

      const blockchainResponse = await api.registerTrip(tripData);
      const blockchainTripId = blockchainResponse.trip_data.trip_id;
      
      // Generate itinerary based on selected attractions
      const itinerary: ItineraryItem[] = [];
      formData.selectedAttractions.forEach((attraction, index) => {
        const day = Math.floor(index / 2) + 1;
        const time = index % 2 === 0 ? "9:00 AM" : "2:00 PM";
        const duration = index % 2 === 0 ? "3 hours" : "2 hours";
        
        itinerary.push({
          id: `item-${index}`,
          day,
          attraction,
          time,
          duration
        });
      });

      const newItinerary: TripItinerary = {
        id: blockchainTripId, // Use blockchain trip ID
        title: formData.title,
        city: formData.city,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        hotel: formData.hotel,
        attractions: formData.selectedAttractions,
        itinerary,
        created: new Date().toISOString(),
        blockchainData: {
          trip_id: blockchainTripId,
          tx_hash: blockchainResponse.trip_data.tx_hash,
          expiry_date: blockchainResponse.trip_data.expiry_date,
          status: blockchainResponse.trip_data.status
        }
      };

      setItineraries([...itineraries, newItinerary]);
      
      toast({
        title: "Trip Created Successfully! 🎉",
        description: `Your trip has been registered on blockchain with ID: ${blockchainTripId}. It will automatically expire on ${new Date(blockchainResponse.trip_data.expiry_date).toLocaleDateString()}.`,
      });

      try {
        const center = CITY_COORDS[newItinerary.city] || CITY_COORDS['Delhi'];
        localStorage.setItem('active_itinerary', JSON.stringify({
          id: newItinerary.id,
          city: newItinerary.city,
          center,
          created: newItinerary.created,
          blockchain_trip_id: blockchainTripId,
          expiry_date: blockchainResponse.trip_data.expiry_date
        }));
      } catch {}
      
    } catch (error) {
      console.error('Failed to create trip:', error);
      toast({
        title: "Trip Creation Failed",
        description: "Failed to register trip on blockchain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
      
      // Reset form
      setFormData({
        title: "",
        city: "",
        startDate: "",
        endDate: "",
        travelers: 1,
        hotel: "",
        selectedAttractions: []
      });
    }
  };

  const handleSafeRoveItinerary = () => {
    if (!safeRoveForm.city || !safeRoveForm.startDate || !safeRoveForm.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Simulate ML model generating itinerary
    const days = Math.ceil((new Date(safeRoveForm.endDate).getTime() - new Date(safeRoveForm.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const cityAttractions = ATTRACTIONS[safeRoveForm.city as keyof typeof ATTRACTIONS] || [];
    const selectedAttractions = cityAttractions.slice(0, Math.min(days * 2, cityAttractions.length));
    
    const itinerary: ItineraryItem[] = [];
    selectedAttractions.forEach((attraction, index) => {
      const day = Math.floor(index / 2) + 1;
      const time = index % 2 === 0 ? "9:00 AM" : "2:00 PM";
      const duration = index % 2 === 0 ? "3 hours" : "2 hours";
      
      itinerary.push({
        id: `item-${index}`,
        day,
        attraction,
        time,
        duration
      });
    });

    const newItinerary: TripItinerary = {
      id: `safeRove-${Date.now()}`,
      title: `SafeRove ${safeRoveForm.city} Adventure`,
      city: safeRoveForm.city,
      startDate: safeRoveForm.startDate,
      endDate: safeRoveForm.endDate,
      travelers: safeRoveForm.travelers,
      hotel: HOTELS[safeRoveForm.city as keyof typeof HOTELS]?.[0] || "Recommended Hotel",
      attractions: selectedAttractions,
      itinerary,
      created: new Date().toISOString()
    };

    setItineraries([...itineraries, newItinerary]);
    alert("SafeRove itinerary generated successfully!");
    try {
      const center = CITY_COORDS[newItinerary.city] || CITY_COORDS['Delhi'];
      localStorage.setItem('active_itinerary', JSON.stringify({
        id: newItinerary.id,
        city: newItinerary.city,
        center,
        created: newItinerary.created,
      }));
    } catch {}
    
    // Reset form
    setSafeRoveForm({
      city: "",
      startDate: "",
      endDate: "",
      travelers: 1
    });
  };

  const toggleAttraction = (attraction: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAttractions: prev.selectedAttractions.includes(attraction)
        ? prev.selectedAttractions.filter(a => a !== attraction)
        : [...prev.selectedAttractions, attraction]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold gradient-text">Trip Itinerary</h1>
          <p className="text-muted-foreground">Plan your perfect trip with SafeRove</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Trip Itinerary</TabsTrigger>
            <TabsTrigger value="safeRove">SafeRove Itinerary</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Create Your Own Itinerary</CardTitle>
                <CardDescription>Customize your trip with your preferred attractions and schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Trip Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Delhi Heritage Tour"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Select value={formData.city} onValueChange={(city) => setFormData({...formData, city, selectedAttractions: [], hotel: ""})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <Input
                      id="travelers"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.travelers}
                      onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>

                {formData.city && (
                  <>
                    <div>
                      <Label>Select Attractions</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {ATTRACTIONS[formData.city as keyof typeof ATTRACTIONS]?.map(attraction => (
                          <Button
                            key={attraction}
                            variant={formData.selectedAttractions.includes(attraction) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleAttraction(attraction)}
                            className="justify-start"
                          >
                            {formData.selectedAttractions.includes(attraction) && <X className="h-3 w-3 mr-1" />}
                            {attraction}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="hotel">Select Hotel</Label>
                      <Select value={formData.hotel} onValueChange={(hotel) => setFormData({...formData, hotel})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose hotel" />
                        </SelectTrigger>
                        <SelectContent>
                          {HOTELS[formData.city as keyof typeof HOTELS]?.map(hotel => (
                            <SelectItem key={hotel} value={hotel}>{hotel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

        

                <Button
                  onClick={handleCreateItinerary}
                  disabled={isCreating}
                  className="w-full btn-hero"
                >
                  {isCreating ? "Creating & Securing..." : "Create & Secure Trip"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safeRove" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>SafeRove AI Itinerary</CardTitle>
                <CardDescription>Let our AI create the perfect itinerary based on your preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="safeRoveCity">City</Label>
                    <Select value={safeRoveForm.city} onValueChange={(city) => setSafeRoveForm({...safeRoveForm, city})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="safeRoveTravelers">Number of Travelers</Label>
                    <Input
                      id="safeRoveTravelers"
                      type="number"
                      min="1"
                      max="10"
                      value={safeRoveForm.travelers}
                      onChange={(e) => setSafeRoveForm({...safeRoveForm, travelers: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="safeRoveStartDate">Start Date</Label>
                    <Input
                      id="safeRoveStartDate"
                      type="date"
                      value={safeRoveForm.startDate}
                      onChange={(e) => setSafeRoveForm({...safeRoveForm, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="safeRoveEndDate">End Date</Label>
                    <Input
                      id="safeRoveEndDate"
                      type="date"
                      value={safeRoveForm.endDate}
                      onChange={(e) => setSafeRoveForm({...safeRoveForm, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">AI Features</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Optimized route planning</li>
                    <li>• Weather-based recommendations</li>
                    <li>• Crowd density analysis</li>
                    <li>• Safety score integration</li>
                    <li>• Local guide matching</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleSafeRoveItinerary}
                  className="w-full btn-hero"
                >
                  Generate AI Itinerary
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Display Created Itineraries */}
        {itineraries.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Itineraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itineraries.map((itinerary) => (
                <Card key={itinerary.id} className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{itinerary.title}</CardTitle>
                    <CardDescription>
                      {itinerary.city} • {itinerary.startDate} to {itinerary.endDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{itinerary.travelers} travelers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{itinerary.hotel}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{itinerary.attractions.length} attractions</span>
                      </div>
                      {itinerary.blockchainData && (
                        <div className="flex items-center space-x-2 pt-2 border-t">
                          <Shield className="h-4 w-4 text-green-500" />
                          <div className="flex flex-col">
                            <span className="text-xs text-green-600 font-medium">Blockchain Secured</span>
                            <span className="text-xs text-gray-500">
                              Expires: {new Date(itinerary.blockchainData.expiry_date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              ID: {itinerary.blockchainData.trip_id.slice(-8)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          if (itinerary.id.startsWith('safeRove')) {
                            setSafeRoveForm({
                              city: itinerary.city,
                              startDate: itinerary.startDate,
                              endDate: itinerary.endDate,
                              travelers: itinerary.travelers
                            });
                            setActiveTab("safeRove");
                          } else {
                            setFormData({
                              title: itinerary.title,
                              city: itinerary.city,
                              startDate: itinerary.startDate,
                              endDate: itinerary.endDate,
                              travelers: itinerary.travelers,
                              hotel: itinerary.hotel,
                              selectedAttractions: itinerary.attractions
                            });
                            setActiveTab("create");
                          }
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => { setSelectedItinerary(itinerary); setViewOpen(true); }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Details Modal (global) */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="glass-card border-glass-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Itinerary Details</DialogTitle>
              <DialogDescription>Detailed schedule and trip info</DialogDescription>
            </DialogHeader>
            {selectedItinerary && (
              <div className="space-y-3 text-sm">
                <div className="font-semibold text-base">{selectedItinerary.title}</div>
                <div>City: <span className="font-medium">{selectedItinerary.city}</span></div>
                <div>Dates: {selectedItinerary.startDate} to {selectedItinerary.endDate}</div>
                <div>Travelers: {selectedItinerary.travelers}</div>
                <div>Hotel: {selectedItinerary.hotel}</div>
                <div className="pt-2">
                  <div className="font-semibold mb-1">Day-wise Schedule</div>
                  <ul className="list-disc ml-5 space-y-1">
                    {selectedItinerary.itinerary.map((item) => (
                      <li key={item.id}>Day {item.day}: {item.attraction} at {item.time} ({item.duration})</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        </div>
      </div>
    </div>
  );
};

export default TripItineraryPage;

// Popup dialog for itinerary details
// Placed at file end to avoid cluttering main component

