
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bed, Bath, Square, Phone, Mail, Calendar, User, Home, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties } = useAdmin();
  const { user } = useAuth();
  const { toast } = useToast();

  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
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

  // Demo images for different property types
  const demoImages = {
    property: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      "https://images.unsplash.com/photo-1527576539890-dfa815648363",
      "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625"
    ],
    rental: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
      "https://images.unsplash.com/photo-1431576901776-e539bd916ba2"
    ],
    hostel: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace",
      "https://images.unsplash.com/photo-1460574283810-2aab119d8511",
      "https://images.unsplash.com/photo-1486718448742-163732cd1544"
    ]
  };

  const propertyImages = demoImages[property.category] || demoImages.property;

  // Demo details based on property type
  const getPropertyDetails = () => {
    switch (property.category) {
      case "property":
        return {
          bedrooms: property.type === "Villa" ? 4 : 3,
          bathrooms: property.type === "Villa" ? 3 : 2,
          area: property.type === "Villa" ? "2500 sq ft" : "1800 sq ft",
          amenities: ["Swimming Pool", "Gym", "24/7 Security", "Parking", "Garden", "Club House"],
          description: `Experience luxury living at its finest with this premium ${property.type.toLowerCase()} in ${property.location}. This stunning property offers modern amenities, spacious rooms, and is located in one of the most sought-after areas. Perfect for families looking for a comfortable and elegant home.`,
          specifications: {
            "Property Type": property.type,
            "Total Area": property.type === "Villa" ? "2500 sq ft" : "1800 sq ft",
            "Carpet Area": property.type === "Villa" ? "2000 sq ft" : "1400 sq ft",
            "Floor": property.type === "Villa" ? "Ground + 1" : "5th Floor",
            "Facing": "East",
            "Age": "Under Construction",
            "Possession": "Dec 2024"
          }
        };
      case "rental":
        return {
          bedrooms: 2,
          bathrooms: 2,
          area: "1200 sq ft",
          amenities: ["Fully Furnished", "WiFi", "Parking", "Security", "Maintenance", "Power Backup"],
          description: `This fully furnished rental property offers comfortable living with all modern amenities. Located in a prime area with excellent connectivity and nearby facilities. Perfect for working professionals and families.`,
          specifications: {
            "Property Type": "Apartment",
            "Furnishing": "Fully Furnished",
            "Rental Type": "Family/Bachelor",
            "Preferred Tenant": "Family",
            "Deposit": "2 Months",
            "Maintenance": "₹2,000/month",
            "Available From": "Immediate"
          }
        };
      case "hostel":
        return {
          bedrooms: 1,
          bathrooms: 1,
          area: "200 sq ft",
          amenities: ["WiFi", "Meals", "Laundry", "24/7 Security", "AC", "Study Room"],
          description: `Comfortable and affordable accommodation for students and working professionals. Clean, safe environment with all basic amenities included. Located near colleges and IT parks with excellent transport connectivity.`,
          specifications: {
            "Accommodation Type": property.type,
            "Room Type": "AC/Non-AC Available",
            "Occupancy": "Single/Double",
            "Meals": "3 Times",
            "Gender": "Boys/Girls",
            "Timing": "No Restrictions",
            "Notice Period": "1 Month"
          }
        };
      default:
        return {
          bedrooms: 2,
          bathrooms: 2,
          area: "1200 sq ft",
          amenities: ["Parking", "Security", "Gym"],
          description: "Premium property with modern amenities.",
          specifications: {}
        };
    }
  };

  const details = getPropertyDetails();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-2">
                {property.price}
              </div>
              <Badge variant="secondary" className="text-sm">
                {property.type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <img
                    src={propertyImages[0]}
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                {propertyImages.slice(1, 4).map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 2}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="font-semibold">{details.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="font-semibold">{details.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="font-semibold">{details.area}</div>
                      <div className="text-sm text-muted-foreground">Area</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {details.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(details.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Builder Contact */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Builder Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold">{property.builder}</div>
                    <div className="text-sm text-muted-foreground">Verified Builder</div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    <span>contact@builder.com</span>
                  </div>
                  <Button className="w-full mt-4">
                    Contact Builder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Property Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Listed: {property.createdDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Status: {property.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Schedule Visit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleDownloadBrochure}
                  >
                    Download Brochure
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to Favorites
                  </Button>
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
