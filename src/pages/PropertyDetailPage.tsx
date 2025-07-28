
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Home, Bath, Maximize } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import ScheduleVisitDialog from "@/components/ScheduleVisitDialog";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSecureAuth();
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

  const handleDownloadBrochure = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to download brochure",
        variant: "destructive",
      });
      return;
    }

    if (!user.plan) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to download brochures",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download Started",
      description: "Brochure download has started",
    });
  };

  const mockAmenities = ["Swimming Pool", "Gym", "24/7 Security", "Parking", "Garden", "Club House"];
  const mockDetails = {
    bedrooms: property.type === "Villa" ? 4 : 3,
    bathrooms: property.type === "Villa" ? 3 : 2,
    area: property.type === "Villa" ? "2500 sq ft" : "1800 sq ft"
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
            {/* Property Image */}
            <Card>
              <CardContent className="p-0">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Property Details */}
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
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {property.description || "This is a beautiful property with modern amenities and excellent location. Perfect for families looking for a comfortable and convenient living space."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockAmenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
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
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <Phone className="h-4 w-4" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    <span>contact@builder.com</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <ScheduleVisitDialog
                    trigger={
                      <Button className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Visit
                      </Button>
                    }
                    propertyTitle={property.title}
                  />
                  <Button variant="outline" onClick={handleDownloadBrochure} className="w-full">
                    Download Brochure
                  </Button>
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
