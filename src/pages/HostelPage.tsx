
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Users, Wifi, Car, Utensils, Lock, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HostelPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedHostel, setSelectedHostel] = useState<any>(null);

  const handleViewDetails = (hostel: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view hostel details",
        variant: "destructive",
      });
      return;
    }

    // Check if user has active subscription
    const hasActiveSubscription = user.plan && user.plan !== 'No Plan';
    if (!hasActiveSubscription) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to view hostel details",
        variant: "destructive",
      });
      return;
    }

    setSelectedHostel(hostel);
    toast({
      title: "Hostel Details",
      description: `Viewing details for ${hostel.name}`,
    });
  };

  const hostels = [
    {
      id: 1,
      name: "Green Valley Boys Hostel",
      location: "Koramangala, Bangalore",
      rent: "₹8,000",
      type: "Boys",
      sharing: "2/3 Sharing",
      amenities: ["WiFi", "Laundry", "Meals", "Security"],
      rating: 4.2,
      image: "/placeholder.svg",
      available: true
    },
    {
      id: 2,
      name: "Sunrise Girls PG",
      location: "HSR Layout, Bangalore",
      rent: "₹12,000",
      type: "Girls",
      sharing: "Single/Double",
      amenities: ["WiFi", "AC", "Meals", "Gym", "Parking"],
      rating: 4.5,
      image: "/placeholder.svg",
      available: true
    },
    {
      id: 3,
      name: "Urban Co-Living Space",
      location: "Whitefield, Bangalore",
      rent: "₹15,000",
      type: "Co-ed",
      sharing: "Single Room",
      amenities: ["WiFi", "AC", "Housekeeping", "Gym", "Community Kitchen"],
      rating: 4.7,
      image: "/placeholder.svg",
      available: false
    }
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'meals': return <Utensils className="h-4 w-4" />;
      case 'security': return <Lock className="h-4 w-4" />;
      case 'gym': return <Users className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hostels & PG Accommodations</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find comfortable and affordable hostel and PG accommodations near you
          </p>
          {user?.plan && (
            <Badge variant="secondary" className="mt-4 text-lg px-4 py-2">
              Current Plan: {user.plan}
            </Badge>
          )}
        </div>

        {/* Hostels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hostels.map((hostel) => (
            <Card key={hostel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={hostel.image} 
                  alt={hostel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={hostel.available ? "default" : "secondary"}>
                    {hostel.available ? "Available" : "Full"}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-background/80">
                    {hostel.type}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{hostel.name}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{hostel.location}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-primary">{hostel.rent}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{hostel.rating}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Sharing: </span>
                  {hostel.sharing}
                </div>

                <div className="flex flex-wrap gap-2">
                  {hostel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-accent px-2 py-1 rounded-md text-xs">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleViewDetails(hostel)}
                  disabled={!hostel.available}
                >
                  {hostel.available ? "View Details" : "Not Available"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscription CTA */}
        {(!user || !user.plan || user.plan === 'No Plan') && (
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Unlock Premium Hostel Listings</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get access to verified hostels and PG accommodations with direct contact details, 
                photos, and detailed amenities information.
              </p>
              <Button size="lg" onClick={() => window.location.href = '/pricing'}>
                View Subscription Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HostelPage;
