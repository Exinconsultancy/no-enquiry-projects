
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Home, Bath, Maximize, Lock, Star, Wifi, Car, Shield, TreePine, Dumbbell, Waves, Building, Users, Clock, Camera, FileText, Calculator } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { SubscriptionService } from "@/services/subscriptionService";
import ScheduleVisitDialog from "@/components/ScheduleVisitDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useSecureAuth();
  const { getPropertyById } = useAdmin();
  const { toast } = useToast();

  const property = getPropertyById(id || "");

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

  const canAccessPremiumFeatures = (user && SubscriptionService.canAccessPremiumFeatures(user)) || isAdmin;

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
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="neighborhood">Area</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
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

                  <TabsContent value="financial" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Base Price</span>
                        <span className="font-semibold">{mockFinancials.basePrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Stamp Duty</span>
                        <span>{mockFinancials.stampDuty}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Registration</span>
                        <span>{mockFinancials.registration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Maintenance</span>
                        <span>{mockFinancials.maintenance}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Society Fees</span>
                        <span>{mockFinancials.societyFees}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total Cost</span>
                        <span className="text-primary">{mockFinancials.totalCost}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="neighborhood" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{mockNeighborhood.walkScore}</div>
                        <div className="text-sm text-muted-foreground">Walk Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{mockNeighborhood.transitScore}</div>
                        <div className="text-sm text-muted-foreground">Transit Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{mockNeighborhood.bikeScore}</div>
                        <div className="text-sm text-muted-foreground">Bike Score</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Nearby Schools</h4>
                        <div className="space-y-1">
                          {mockNeighborhood.nearbySchools.map((school, index) => (
                            <div key={index} className="text-sm text-muted-foreground">• {school}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Healthcare</h4>
                        <div className="space-y-1">
                          {mockNeighborhood.hospitals.map((hospital, index) => (
                            <div key={index} className="text-sm text-muted-foreground">• {hospital}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Shopping</h4>
                        <div className="space-y-1">
                          {mockNeighborhood.shopping.map((shop, index) => (
                            <div key={index} className="text-sm text-muted-foreground">• {shop}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span>Property Title Deed</span>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span>Floor Plan</span>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span>Property Brochure</span>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calculator className="h-5 w-5 text-muted-foreground" />
                          <span>EMI Calculator</span>
                        </div>
                        <Button size="sm" variant="outline">Calculate</Button>
                      </div>
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
                  {canAccessPremiumFeatures ? (
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
                    <>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Phone className="h-4 w-4" />
                        <span className="blur-sm">+91 9876543210</span>
                        <Lock className="h-3 w-3" />
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        <span className="blur-sm">contact@builder.com</span>
                        <Lock className="h-3 w-3" />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="space-y-2">
                  {canAccessPremiumFeatures ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <Button disabled className="w-full" onClick={handleScheduleVisit}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Visit
                        <Lock className="h-4 w-4 ml-2" />
                      </Button>
                      <Button variant="outline" disabled className="w-full" onClick={handleDownloadBrochure}>
                        Download Brochure
                        <Lock className="h-4 w-4 ml-2" />
                      </Button>
                      <div className="text-center pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => navigate('/pricing')}
                          className="text-xs"
                        >
                          Subscribe to Access Contact Details
                        </Button>
                      </div>
                    </>
                  )}
                </div>
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
