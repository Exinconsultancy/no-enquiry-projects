
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Users, Wifi, Car, Utensils, Lock, Star, BedDouble, Bath, Square, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const RentalsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const handleViewDetails = (property: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view rental property details",
        variant: "destructive",
      });
      return;
    }

    const hasActiveSubscription = user.plan && user.plan !== 'No Plan';
    if (!hasActiveSubscription) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to view rental property details",
        variant: "destructive",
      });
      return;
    }

    setSelectedProperty(property);
    toast({
      title: "Property Details",
      description: `Viewing details for ${property.title}`,
    });
  };

  const rentalProperties = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment",
      location: "Koramangala, Bangalore",
      rent: "₹45,000",
      deposit: "₹2,25,000",
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,200 sq ft",
      amenities: ["WiFi", "Parking", "Gym", "Swimming Pool", "Security"],
      rating: 4.5,
      image: "/placeholder.svg",
      available: true,
      furnishing: "Fully Furnished",
      leasePeriod: "11 months"
    },
    {
      id: 2,
      title: "Modern 2BHK Villa",
      location: "HSR Layout, Bangalore",
      rent: "₹35,000",
      deposit: "₹1,75,000",
      type: "Villa",
      bedrooms: 2,
      bathrooms: 2,
      area: "1,000 sq ft",
      amenities: ["WiFi", "Parking", "Garden", "Security", "Power Backup"],
      rating: 4.2,
      image: "/placeholder.svg",
      available: true,
      furnishing: "Semi Furnished",
      leasePeriod: "12 months"
    },
    {
      id: 3,
      title: "Spacious 4BHK House",
      location: "Whitefield, Bangalore",
      rent: "₹55,000",
      deposit: "₹2,75,000",
      type: "House",
      bedrooms: 4,
      bathrooms: 3,
      area: "1,800 sq ft",
      amenities: ["WiFi", "Parking", "Garden", "Security", "Servant Room"],
      rating: 4.7,
      image: "/placeholder.svg",
      available: false,
      furnishing: "Unfurnished",
      leasePeriod: "24 months"
    },
    {
      id: 4,
      title: "Cozy 1BHK Studio",
      location: "Indiranagar, Bangalore",
      rent: "₹25,000",
      deposit: "₹1,25,000",
      type: "Studio",
      bedrooms: 1,
      bathrooms: 1,
      area: "650 sq ft",
      amenities: ["WiFi", "Parking", "Security", "Maintenance"],
      rating: 4.0,
      image: "/placeholder.svg",
      available: true,
      furnishing: "Fully Furnished",
      leasePeriod: "11 months"
    },
    {
      id: 5,
      title: "Premium 3BHK Penthouse",
      location: "UB City, Bangalore",
      rent: "₹85,000",
      deposit: "₹4,25,000",
      type: "Penthouse",
      bedrooms: 3,
      bathrooms: 3,
      area: "2,200 sq ft",
      amenities: ["WiFi", "Parking", "Gym", "Swimming Pool", "Concierge", "Terrace"],
      rating: 4.8,
      image: "/placeholder.svg",
      available: true,
      furnishing: "Luxury Furnished",
      leasePeriod: "12 months"
    },
    {
      id: 6,
      title: "Family 2BHK Flat",
      location: "Jayanagar, Bangalore",
      rent: "₹30,000",
      deposit: "₹1,50,000",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: "950 sq ft",
      amenities: ["WiFi", "Parking", "Security", "Elevator"],
      rating: 4.1,
      image: "/placeholder.svg",
      available: true,
      furnishing: "Semi Furnished",
      leasePeriod: "11 months"
    }
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'gym': return <Users className="h-4 w-4" />;
      case 'security': return <Lock className="h-4 w-4" />;
      case 'swimming pool': return <Bath className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Rental Properties</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find your perfect rental home from our extensive collection of verified properties
          </p>
          {user?.plan && (
            <Badge variant="secondary" className="mt-4 text-lg px-4 py-2">
              Current Plan: {user.plan}
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rentalProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={property.available ? "default" : "secondary"}>
                    {property.available ? "Available" : "Rented"}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-background/80">
                    {property.furnishing}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center space-x-1 bg-background/80 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{property.location}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-primary">{property.rent}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <Badge variant="outline">{property.type}</Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Deposit: </span>
                  {property.deposit}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <BedDouble className="h-4 w-4" />
                    <span>{property.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Square className="h-4 w-4" />
                    <span>{property.area}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Lease: {property.leasePeriod}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-accent px-2 py-1 rounded-md text-xs">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                  {property.amenities.length > 3 && (
                    <div className="bg-accent px-2 py-1 rounded-md text-xs">
                      +{property.amenities.length - 3} more
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleViewDetails(property)}
                  disabled={!property.available}
                >
                  {property.available ? "View Details & Contact" : "Not Available"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!user || !user.plan || user.plan === 'No Plan') && (
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Unlock Premium Rental Listings</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get access to verified rental properties with direct owner contacts, 
                detailed amenities, and exclusive rental deals.
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

export default RentalsPage;
