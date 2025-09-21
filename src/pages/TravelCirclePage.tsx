import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Users, Plus, Search, ChevronRight } from "lucide-react";

const MyCircle = () => {
  const [count, setCount] = useState<number>(0);
  const [members, setMembers] = useState<{ name: string; phone: string }[]>([]);

  const handleCountChange = (val: string) => {
    const n = parseInt(val || "0", 10) || 0;
    setCount(n);
    setMembers((prev) => {
      const next = [...prev];
      while (next.length < n) next.push({ name: "", phone: "" });
      return next.slice(0, n);
    });
  };

  const updateMember = (idx: number, key: "name" | "phone", value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [key]: value } : m)));
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> My Circle</CardTitle>
        <CardDescription>Add family & friends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm">
          <Label>No. of members travelling</Label>
          <Select onValueChange={handleCountChange}>
            <SelectTrigger className="glass-card border-glass-border mt-1"><SelectValue placeholder="Select count"/></SelectTrigger>
            <SelectContent className="glass-card border-glass-border">
              {[0,1,2,3,4,5,6].map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <div>
                  <Label>Member {i + 1} Name</Label>
                  <Input value={members[i]?.name || ""} onChange={e => updateMember(i, "name", e.target.value)} className="glass-card border-glass-border"/>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input value={members[i]?.phone || ""} onChange={e => updateMember(i, "phone", e.target.value)} className="glass-card border-glass-border"/>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {count > 0 && (
          <Button 
            className="btn-hero" 
            onClick={() => {
              // Validate all members have names and phone numbers
              const validMembers = members.filter(m => m.name.trim() && m.phone.trim());
              if (validMembers.length !== count) {
                alert('Please fill in all member details (name and phone number)');
                return;
              }
              
              // Save to localStorage
              const circleData = {
                id: `circle_${Date.now()}`,
                members: validMembers,
                createdAt: new Date().toISOString(),
                count: validMembers.length
              };
              
              const existingCircles = JSON.parse(localStorage.getItem('travel_circles') || '[]');
              existingCircles.push(circleData);
              localStorage.setItem('travel_circles', JSON.stringify(existingCircles));
              
              alert(`Circle saved successfully with ${validMembers.length} members!`);
              
              // Reset form
              setCount(0);
              setMembers([]);
            }}
          >
            Save Circle
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const FindAITribe = () => {
  const [destination, setDestination] = useState("Jaipur");
  const [dates, setDates] = useState({ start: "2025-10-10", end: "2025-10-14" });
  const [budget, setBudget] = useState("Mid");
  const [interests, setInterests] = useState<string[]>(["Heritage", "Food"]);

  // Cosine similarity function for interest matching
  const calculateCosineSimilarity = (userInterests: string[], otherInterests: string[]) => {
    const allInterests = [...new Set([...userInterests, ...otherInterests])];
    const userVector = allInterests.map(interest => userInterests.includes(interest) ? 1 : 0);
    const otherVector = allInterests.map(interest => otherInterests.includes(interest) ? 1 : 0);
    
    const dotProduct = userVector.reduce((sum, val, i) => sum + val * otherVector[i], 0);
    const magnitudeA = Math.sqrt(userVector.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(otherVector.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  };

  // Enhanced recommender with cosine similarity
  const recommendations = useMemo(() => {
    const people = [
      { 
        id: "user_1",
        name: "Arjun", 
        interests: ["Heritage", "Photography", "History"], 
        dates: "Oct 10-14", 
        budget: "Mid",
        destination: "Jaipur",
        age: 28,
        experience: "Experienced"
      },
      { 
        id: "user_2",
        name: "Meera", 
        interests: ["Food", "Markets", "Culture"], 
        dates: "Oct 11-15", 
        budget: "High",
        destination: "Jaipur",
        age: 32,
        experience: "Beginner"
      },
      { 
        id: "user_3",
        name: "Ravi", 
        interests: ["Adventure", "Heritage", "Photography"], 
        dates: "Oct 9-13", 
        budget: "Low",
        destination: "Jaipur",
        age: 25,
        experience: "Experienced"
      },
      { 
        id: "user_4",
        name: "Priya", 
        interests: ["Food", "Heritage", "Shopping"], 
        dates: "Oct 12-16", 
        budget: "Mid",
        destination: "Jaipur",
        age: 30,
        experience: "Intermediate"
      },
    ];
    
    return people.map(person => {
      const interestSimilarity = calculateCosineSimilarity(interests, person.interests);
      const destinationMatch = person.destination === destination ? 0.3 : 0;
      const budgetMatch = person.budget === budget ? 0.2 : 0;
      const dateOverlap = 0.1; // Simplified date matching
      
      const totalScore = Math.min(0.99, interestSimilarity + destinationMatch + budgetMatch + dateOverlap);
      
      return {
        ...person,
        score: totalScore,
        matchPercentage: Math.round(totalScore * 100)
      };
    }).sort((a, b) => b.score - a.score);
  }, [destination, interests, budget, dates]);

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Trip Preferences</CardTitle>
          <CardDescription>We will match travelers with similar preferences and dates</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Destination</Label>
            <Input value={destination} onChange={e=>setDestination(e.target.value)} className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={dates.start} onChange={e=>setDates(s=>({...s,start:e.target.value}))} className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" value={dates.end} onChange={e=>setDates(s=>({...s,end:e.target.value}))} className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Budget</Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="glass-card border-glass-border"><SelectValue/></SelectTrigger>
              <SelectContent className="glass-card border-glass-border">
                {['Low','Mid','High'].map(b=> (<SelectItem key={b} value={b}>{b}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Interests (comma separated)</Label>
            <Input value={interests.join(', ')} onChange={e=>setInterests(e.target.value.split(',').map(x=>x.trim()).filter(Boolean))} className="glass-card border-glass-border"/>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recommended Travel Tribe</CardTitle>
          <CardDescription>Match with people going to {destination}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between glass-card p-3 rounded">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted-foreground">Interests: {p.interests.join(', ')} • Dates: {p.dates}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">Match: {p.matchPercentage}%</div>
                <Button 
                  className="btn-hero"
                  onClick={() => {
                    // Save match request to localStorage
                    const matchRequest = {
                      id: `match_${Date.now()}`,
                      fromUser: "Current User",
                      toUser: p.name,
                      toUserId: p.id,
                      destination: destination,
                      dates: dates,
                      interests: interests,
                      budget: budget,
                      matchPercentage: p.matchPercentage,
                      status: "pending",
                      createdAt: new Date().toISOString()
                    };
                    
                    const existingRequests = JSON.parse(localStorage.getItem('match_requests') || '[]');
                    existingRequests.push(matchRequest);
                    localStorage.setItem('match_requests', JSON.stringify(existingRequests));
                    
                    alert(`Match request sent to ${p.name}! They will be notified of your interest.`);
                  }}
                >
                  Request Match
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const JoinOrCreateTribe = () => {
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
  const groups = [
    { 
      id: "group_1",
      title: "Delhi Heritage Walk", 
      dates: "Oct 12-14", 
      activities: ["Red Fort", "Humayun's Tomb", "India Gate", "Lotus Temple"], 
      total: 6, 
      open: 2,
      description: "Explore the rich heritage of Delhi with fellow history enthusiasts",
      organizer: "Rajesh Kumar",
      budget: "Mid",
      meetingPoint: "Red Fort Metro Station",
      includes: ["Guide", "Entry fees", "Transportation"],
      requirements: ["Comfortable walking shoes", "Camera", "Water bottle"]
    },
    { 
      id: "group_2",
      title: "Jaipur Food & Forts", 
      dates: "Oct 10-13", 
      activities: ["Amber Fort", "Chokhi Dhani", "City Palace", "Jantar Mantar"], 
      total: 8, 
      open: 3,
      description: "Experience the royal city of Jaipur through its cuisine and magnificent forts",
      organizer: "Priya Sharma",
      budget: "High",
      meetingPoint: "Jaipur Railway Station",
      includes: ["Guide", "Entry fees", "Meals", "Transportation"],
      requirements: ["Traditional attire for palace visit", "Appetite for local food"]
    },
    { 
      id: "group_3",
      title: "Rishikesh Adventure", 
      dates: "Oct 18-20", 
      activities: ["Rafting", "Cliff Jumping", "Temple visits", "Yoga sessions"], 
      total: 10, 
      open: 4,
      description: "Adventure and spirituality combined in the yoga capital of the world",
      organizer: "Amit Singh",
      budget: "Low",
      meetingPoint: "Rishikesh Bus Stand",
      includes: ["Equipment", "Accommodation", "Meals"],
      requirements: ["Swimming skills", "Adventure spirit", "Yoga mat"]
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Open Travel Groups</CardTitle>
          <CardDescription>Join a group heading to your destination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {groups.map((g, i) => (
            <div key={i} className="glass-card p-3 rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{g.title}</div>
                <div className="text-sm text-muted-foreground">{g.dates} • Activities: {g.activities.join(', ')}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">{g.total - g.open}/{g.total} filled</div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(showDetails === g.id ? null : g.id)}
                >
                  View Details
                </Button>
                <Button 
                  className="btn-hero"
                  onClick={() => {
                    if (g.open <= 0) {
                      alert('Sorry, this group is full!');
                      return;
                    }
                    
                    // Save join request to localStorage
                    const joinRequest = {
                      id: `join_${Date.now()}`,
                      groupId: g.id,
                      groupTitle: g.title,
                      userId: "current_user",
                      userName: "Current User",
                      status: "pending",
                      appliedAt: new Date().toISOString()
                    };
                    
                    const existingJoins = JSON.parse(localStorage.getItem('join_requests') || '[]');
                    existingJoins.push(joinRequest);
                    localStorage.setItem('join_requests', JSON.stringify(existingJoins));
                    
                    alert(`Join request sent for "${g.title}"! The organizer will review your request.`);
                  }}
                >
                  Join
                </Button>
              </div>
            </div>
          ))}
          
          {/* Details Section */}
          {showDetails && (
            <Card className="glass-card mt-4">
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const group = groups.find(g => g.id === showDetails);
                  if (!group) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{group.title}</h3>
                        <p className="text-muted-foreground">{group.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Trip Information</h4>
                          <ul className="text-sm space-y-1">
                            <li><strong>Dates:</strong> {group.dates}</li>
                            <li><strong>Organizer:</strong> {group.organizer}</li>
                            <li><strong>Budget Level:</strong> {group.budget}</li>
                            <li><strong>Meeting Point:</strong> {group.meetingPoint}</li>
                            <li><strong>Group Size:</strong> {group.total - group.open}/{group.total} (Open spots: {group.open})</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Activities</h4>
                          <ul className="text-sm space-y-1">
                            {group.activities.map((activity, idx) => (
                              <li key={idx}>• {activity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">What's Included</h4>
                          <ul className="text-sm space-y-1">
                            {group.includes.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Requirements</h4>
                          <ul className="text-sm space-y-1">
                            {group.requirements.map((req, idx) => (
                              <li key={idx}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Create a Tribe</CardTitle>
          <CardDescription>Start a new travel group and invite others</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input placeholder="e.g., Goa Beaches & Cafes" className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Start Date</Label>
            <Input type="date" className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" className="glass-card border-glass-border"/>
          </div>
          <div className="md:col-span-2">
            <Label>Activities</Label>
            <Input placeholder="e.g., Beach walk, Cafe hopping, Night market" className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Total Spots</Label>
            <Input type="number" placeholder="8" className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Open Spots</Label>
            <Input type="number" placeholder="3" className="glass-card border-glass-border"/>
          </div>
          <div className="md:col-span-2">
            <Button className="btn-hero"><Plus className="h-4 w-4 mr-1"/> Create Tribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TravelCirclePage = () => {
  const [active, setActive] = useState<'mycircle' | 'newcircle'>('mycircle');
  const [subTab, setSubTab] = useState<'find' | 'join'>('find');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header with navigation */}
      <header className="glass-card backdrop-blur-xl border-b border-glass-border sticky top-2 z-10 mx-4 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <div className="leading-tight ml-3">
                <div className="text-2xl font-bold text-foreground">Travel Circle</div>
                <div className="text-xs text-muted-foreground">Connect with fellow travelers</div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/user-dashboard"}
                className="flex items-center space-x-2 text-foreground hover:text-primary-glow"
              >
                <span>Dashboard</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/explore"}
                className="flex items-center space-x-2 text-foreground hover:text-primary-glow"
              >
                <span>Explore</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-3xl font-bold mb-6">Travel Circle</motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
          {active === 'mycircle' ? (
            <MyCircle />
          ) : (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Find Your Travel Companion</CardTitle>
                <CardDescription>Discover or join a tribe that matches your travel plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Top navbar for New Circle */}
                <div className="flex justify-end">
                  <Tabs value={subTab} onValueChange={(v)=>setSubTab(v as any)}>
                    <TabsList>
                      <TabsTrigger value="find" className="flex items-center gap-1"><Search className="h-4 w-4"/> Find AI Travel Tribe</TabsTrigger>
                      <TabsTrigger value="join" className="flex items-center gap-1"><Users className="h-4 w-4"/> Join a Tribe</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {subTab === 'find' ? <FindAITribe /> : <JoinOrCreateTribe />}
              </CardContent>
            </Card>
          )}
          </div>

        {/* Left side aligned navbar */}
        <div className="lg:col-span-1">
          <Card className="glass-card sticky top-24">
            <CardHeader>
              <CardTitle>Menu</CardTitle>
              <CardDescription>Manage your circle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant={active==='mycircle'? 'default':'outline'} className="w-full justify-between" onClick={()=>setActive('mycircle')}>
                My Circle <ChevronRight className="h-4 w-4"/>
              </Button>
              <Button variant={active==='newcircle'? 'default':'outline'} className="w-full justify-between" onClick={()=>setActive('newcircle')}>
                New Circle <ChevronRight className="h-4 w-4"/>
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TravelCirclePage;
