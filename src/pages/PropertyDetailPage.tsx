
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Home, Bath, Maximize, Lock, Star, Wifi, Car, Shield, TreePine, Dumbbell, Waves, Building, Users, Clock, Camera, FileText, Calculator } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { SubscriptionService } from "@/services/subscriptionService";
import ScheduleVisitDialog from "@/components/ScheduleVisitDialog";
import AdminPropertyMediaControls from "@/components/AdminPropertyMediaControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { getPropertyById } = useAdmin();
  const { toast } = useToast();

  const property = getPropertyById(id || "");

  const [contactDetailsVisible, setContactDetailsVisible] = React.useState(false);

  const handleViewDetails = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view contact details.",
        variant: "destructive"
      });
      return;
    }

    // Admin always has access
    if (profile?.role === 'admin') {
      setContactDetailsVisible(true);
      return;
    }

    // Check if user has premium subscription
    const hasSubscription = profile?.plan && profile.plan !== 'free';
    if (!hasSubscription) {
      toast({
        title: "Subscription Required",
        description: "Upgrade to a premium plan to view contact details.",
        variant: "destructive"
      });
      navigate('/pricing');
      return;
    }
    
    setContactDetailsVisible(true);
    
    toast({
      title: "Contact Details Unlocked",
      description: "Contact details are now visible.",
    });
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canAccessPremiumFeatures = profile?.role === 'admin' || (profile?.plan && profile.plan !== 'free');

  const handleDownloadBrochure = () => {
    if (!canAccessPremiumFeatures) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to download brochures",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

    toast({
      title: "Download Started",
      description: "Brochure download has started",
    });
  };

  const handleScheduleVisit = () => {
    if (!canAccessPremiumFeatures) {
      toast({
        title: "Subscription Required", 
        description: "Please subscribe to a plan to schedule visits",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }
  };

  const handleContactBuilder = () => {
    if (!canAccessPremiumFeatures) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to access builder contact details",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }
  };

  const mockAmenities = [
    { icon: Waves, name: "Swimming Pool", available: true },
    { icon: Dumbbell, name: "Gymnasium", available: true },
    { icon: Shield, name: "24/7 Security", available: true },
    { icon: Car, name: "Parking", available: true },
    { icon: TreePine, name: "Garden", available: true },
    { icon: Building, name: "Club House", available: true },
    { icon: Wifi, name: "High Speed Internet", available: false },
    { icon: Users, name: "Community Hall", available: true }
  ];

  const mockDetails = {
    bedrooms: property.type === "Villa" ? 4 : 3,
    bathrooms: property.type === "Villa" ? 3 : 2,
    area: property.type === "Villa" ? "2500 sq ft" : "1800 sq ft",
    builtYear: "2023",
    floors: property.type === "Villa" ? "2" : "12th Floor",
    facing: "East",
    furnishing: "Semi-Furnished",
    parking: "2 Covered",
    possession: "Ready to Move"
  };

  const mockFinancials = {
    basePrice: "₹2.5 Cr",
    stampDuty: "₹7.5 Lakh",
    registration: "₹50,000",
    maintenance: "₹8,000/month",
    societyFees: "₹2,000/month",
    totalCost: "₹2.58 Cr"
  };

  const mockNeighborhood = {
    walkScore: 85,
    transitScore: 78,
    bikeScore: 92,
    nearbySchools: ["DPS International", "Ryan International", "Vidya Bhawan"],
    hospitals: ["Apollo Hospital", "Fortis Healthcare", "Max Hospital"],
    shopping: ["Phoenix Mall", "Express Avenue", "Forum Mall"],
    restaurants: ["Saravana Bhavan", "Pind Balluchi", "Absolute Barbecue"]
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-96 md:h-80 object-cover rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <img src="/placeholder.svg" alt="Interior" className="w-full h-39 object-cover rounded-lg" />
                      <img src="/placeholder.svg" alt="Bedroom" className="w-full h-39 object-cover rounded-lg" />
                      <img src="/placeholder.svg" alt="Kitchen" className="w-full h-39 object-cover rounded-lg" />
                      <div className="relative">
                        <img src="/placeholder.svg" alt="Bathroom" className="w-full h-39 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                          <div className="text-white text-center">
                            <Camera className="h-6 w-6 mx-auto mb-1" />
                            <span className="text-sm">+12 Photos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Admin Media Controls */}
                  {profile?.role === 'admin' && (
                    <div className="absolute top-4 right-4">
                      <AdminPropertyMediaControls property={property} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details Tabs */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{property.price}</div>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="secondary">{property.type}</Badge>
                      <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Home className="h-5 w-5 text-muted-foreground" />
                        <span>{mockDetails.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bath className="h-5 w-5 text-muted-foreground" />
                        <span>{mockDetails.bathrooms} Bathrooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Maximize className="h-5 w-5 text-muted-foreground" />
                        <span>{mockDetails.area}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Built Year</span>
                          <span>{mockDetails.builtYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Floor</span>
                          <span>{mockDetails.floors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Facing</span>
                          <span>{mockDetails.facing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Furnishing</span>
                          <span>{mockDetails.furnishing}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Parking</span>
                          <span>{mockDetails.parking}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Possession</span>
                          <span>{mockDetails.possession}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Property Type</span>
                          <span>{property.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Listed Date</span>
                          <span>{property.createdDate}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">
                        {property.description || "This is a beautiful property with modern amenities and excellent location. Perfect for families looking for a comfortable and convenient living space. The property features spacious rooms, modern fixtures, and is located in a prime area with excellent connectivity to major business districts and entertainment centers."}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="amenities" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {mockAmenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 p-2 rounded-full ${amenity.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <amenity.icon className="h-4 w-4" />
                          </div>
                          <span className={amenity.available ? 'text-foreground' : 'text-muted-foreground line-through'}>
                            {amenity.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">{property.builder}</h4>
                  {contactDetailsVisible || profile?.role === 'admin' ? (
                    <>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Phone className="h-4 w-4" />
                        <span>+91 9876543210</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        <span>contact@builder.com</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Contact details are premium content
                      </p>
                      <Button onClick={handleViewDetails} className="w-full">
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
                
                {(contactDetailsVisible || profile?.role === 'admin') && (
                  <div className="space-y-2">
                    <ScheduleVisitDialog
                      property={{
                        id: property.id,
                        title: property.title,
                        location: property.location,
                        builder: property.builder
                      }}
                    >
                      <Button className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Visit
                      </Button>
                    </ScheduleVisitDialog>
                    <Button variant="outline" onClick={handleDownloadBrochure} className="w-full">
                      Download Brochure
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <span>{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="capitalize">{property.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">{property.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed Date</span>
                  <span>{property.createdDate}</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
