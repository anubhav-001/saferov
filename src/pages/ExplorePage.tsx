import { SITE_NAME } from "@/lib/brand";
import brandLogo from "@/components/logo2.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, MapPin, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<"attractions" | "recommended">("attractions");
  const attractions = [
    { name: "Red Fort", rating: 4.5, distance: "2.3 km", price: "₹35" },
    { name: "Lotus Temple", rating: 4.7, distance: "8.1 km", price: "Free" },
    { name: "Humayun's Tomb", rating: 4.4, distance: "5.2 km", price: "₹30" },
    { name: "Qutub Minar", rating: 4.6, distance: "12.5 km", price: "₹30" }
  ];
  const recommended = [
    { name: "Akshardham Temple", type: "Religious", safety: "High" },
    { name: "Chandni Chowk", type: "Market", safety: "Medium" },
    { name: "Hauz Khas Village", type: "Nightlife", safety: "Medium" },
    { name: "Lodhi Gardens", type: "Park", safety: "High" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left nav */}
          <Card className="glass-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <img src={brandLogo} alt={SITE_NAME} className="h-5 w-5 rounded-full object-cover" />
                <span>Explore</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant={section === "attractions" ? "default" : "outline"} className="w-full" onClick={() => setSection("attractions")}>Nearby Attractions</Button>
              <Button variant={section === "recommended" ? "default" : "outline"} className="w-full" onClick={() => setSection("recommended")}>Recommended Places</Button>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="md:col-span-3 space-y-6">
            {section === "attractions" ? (
              <>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Nearby Attractions</CardTitle>
                  <CardDescription>Book tickets for your favorite attractions and get assigned a travel guide.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attractions.map((a) => (
                    <div key={a.name} className="flex items-center justify-between p-3 glass-card rounded-lg hover:bg-accent/10 transition-colors">
                      <div>
                        <h4 className="font-medium">{a.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>⭐ {a.rating}</span>
                          <span>📍 {a.distance}</span>
                          <span className="font-medium text-accent">{a.price}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="btn-accent" 
                        onClick={() => navigate("/payment", { state: { attraction: a.name, price: a.price } })}
                      >
                        Book Ticket
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </>
            ) : (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Flame className="h-4 w-4" /> Recommended Places</CardTitle>
                  <CardDescription>Personalized picks for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommended.map((r) => (
                      <div key={r.name} className="p-4 glass-card rounded-lg text-center hover:bg-primary/10 transition-colors cursor-pointer">
                        <h4 className="font-medium mb-2">{r.name}</h4>
                        <Badge variant="outline" className="mb-2">{r.type}</Badge>
                        <div className="text-sm">Safety: {r.safety}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;


