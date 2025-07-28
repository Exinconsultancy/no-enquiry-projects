
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Users, Wifi, Car, Utensils, Lock, Star, BedDouble, Shield, Clock } from "lucide-react";
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
      deposit: "₹16,000",
      type: "Boys",
      sharing: "2/3 Sharing",
      amenities: ["WiFi", "Laundry", "Meals", "Security", "AC"],
      rating: 4.2,
      image: "/placeholder.svg",
      available: true,
      capacity: "150 students",
      timings: "24/7 Access"
    },
    {
      id: 2,
      name: "Sunrise Girls PG",
      location: "HSR Layout, Bangalore",
      rent: "₹12,000",
      deposit: "₹24,000",
      type: "Girls",
      sharing: "Single/Double",
      amenities: ["WiFi", "AC", "Meals", "Gym", "Parking", "Laundry"],
      rating: 4.5,
      image: "/placeholder.svg",
      available: true,
      capacity: "80 students",
      timings: "10 PM Curfew"
    },
    {
      id: 3,
      name: "Urban Co-Living Space",
      location: "Whitefield, Bangalore",
      rent: "₹15,000",
      deposit: "₹30,000",
      type: "Co-ed",
      sharing: "Single Room",
      amenities: ["WiFi", "AC", "Housekeeping", "Gym", "Community Kitchen", "Rooftop"],
      rating: 4.7,
      image: "/placeholder.svg",
      available: false,
      capacity: "120 residents",
      timings: "24/7 Access"
    },
    {
      id: 4,
      name: "Elite Boys Hostel",
      location: "Electronic City, Bangalore",
      rent: "₹10,000",
      deposit: "₹20,000",
      type: "Boys",
      sharing: "Triple Sharing",
      amenities: ["WiFi", "Meals", "Security", "Recreation Room", "Study Hall"],
      rating: 4.0,
      image: "/placeholder.svg",
      available: true,
      capacity: "200 students",
      timings: "11 PM Curfew"
    },
    {
      id: 5,
      name: "Premium Girls PG",
      location: "Indiranagar, Bangalore",
      rent: "₹18,000",
      deposit: "₹36,000",
      type: "Girls",
      sharing: "Single/Double",
      amenities: ["WiFi", "AC", "Meals", "Gym", "Parking", "Beauty Salon", "Medical Room"],
      rating: 4.6,
      image: "/placeholder.svg",
      available: true,
      capacity: "60 residents",
      timings: "10 PM Curfew"
    },
    {
      id: 6,
      name: "Tech Hub Co-Living",
      location: "Marathahalli, Bangalore",
      rent: "₹13,000",
      deposit: "₹26,000",
      type: "Co-ed",
      sharing: "Double Sharing",
      amenities: ["WiFi", "AC", "Meals", "Gym", "Parking", "Conference Room"],
      rating: 4.3,
      image: "/placeholder.svg",
      available: true,
      capacity: "100 professionals",
      timings: "24/7 Access"
    }
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'meals': return <Utensils className="h-4 w-4" />;
      case 'security': return <Lock className="h-4 w-4" />;
      case 'gym': return <Users className="h-4 w-4" />;
      case 'laundry': return <Shield className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hostels & PG Accommodations</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find comfortable and affordable hostel and PG accommodations for students and professionals
          </p>
          {user?.plan && (
            <Badge variant="secondary" className="mt-4 text-lg px-4 py-2">
              Current Plan: {user.plan}
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hostels.map((hostel) => (
            <Card key={hostel.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={hostel.image} 
                  alt={hostel.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center space-x-1 bg-background/80 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{hostel.rating}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{hostel.name}</CardTitle>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{hostel.location}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-primary">{hostel.rent}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <Badge variant="outline">{hostel.sharing}</Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Deposit: </span>
                  {hostel.deposit}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <BedDouble className="h-4 w-4" />
                    <span>{hostel.sharing}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{hostel.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{hostel.timings}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hostel.amenities.slice(0, 3).map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-accent px-2 py-1 rounded-md text-xs">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                  {hostel.amenities.length > 3 && (
                    <div className="bg-accent px-2 py-1 rounded-md text-xs">
                      +{hostel.amenities.length - 3} more
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleViewDetails(hostel)}
                  disabled={!hostel.available}
                >
                  {hostel.available ? "View Details & Contact" : "Not Available"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
