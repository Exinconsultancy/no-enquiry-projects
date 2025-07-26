import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Grid, List, SlidersHorizontal, X } from "lucide-react";
import { SubscriptionService } from "@/services/subscriptionService";
import { useAuth } from "@/contexts/AuthContext";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: "apartment" | "villa" | "commercial";
  amenities: string[];
  isLocked?: boolean;
  builderContact?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface PropertiesPageProps {
  onLogin: () => void;
}

const PropertiesPage = ({ onLogin }: PropertiesPageProps) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [filters, setFilters] = useState({
    location: "",
    propertyType: "all",
    priceRange: [1000000, 50000000] as [number, number],
    bedrooms: "any",
    bathrooms: "any",
    amenities: [] as string[],
    area: [500, 5000] as [number, number],
    readyToMove: false,
    newProject: false,
  });

  // Sample properties data
  const sampleProperties: Property[] = [
    {
      id: "1",
      title: "Luxury Residences at Marina Bay",
      location: "Mumbai, Maharashtra",
      price: "₹2.5 Cr onwards",
      image: property1,
      bedrooms: 3,
      bathrooms: 2,
      area: "1,450 sq ft",
      type: "apartment",
      amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Garden"],
      isLocked: !SubscriptionService.canAccessPremiumFeatures(user),
      builderContact: {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        email: "rajesh@luxurybuilders.com"
      }
    },
    {
      id: "2",
      title: "Premium Villas in Green Valley",
      location: "Bangalore, Karnataka",
      price: "₹1.8 Cr onwards",
      image: property2,
      bedrooms: 4,
      bathrooms: 3,
      area: "2,200 sq ft",
      type: "villa",
      amenities: ["Swimming Pool", "Club House", "Children's Play Area", "Power Backup"],
      isLocked: !SubscriptionService.canAccessPremiumFeatures(user),
      builderContact: {
        name: "Priya Sharma",
        phone: "+91 87654 32109",
        email: "priya@greenvalley.com"
      }
    },
    {
      id: "3",
      title: "Commercial Spaces Tech Park",
      location: "Gurgaon, Haryana",
      price: "₹3.2 Cr onwards",
      image: property3,
      bedrooms: 0,
      bathrooms: 1,
      area: "1,800 sq ft",
      type: "commercial",
      amenities: ["Elevator", "CCTV", "Fire Safety", "Parking", "Power Backup"],
      isLocked: !SubscriptionService.canAccessPremiumFeatures(user),
      builderContact: {
        name: "Amit Patel",
        phone: "+91 76543 21098",
        email: "amit@techpark.com"
      }
    },
    // Add more sample properties
    {
      id: "4",
      title: "Skyline Apartments",
      location: "Pune, Maharashtra",
      price: "₹1.2 Cr onwards",
      image: property1,
      bedrooms: 2,
      bathrooms: 2,
      area: "1,100 sq ft",
      type: "apartment",
      amenities: ["Gym", "Parking", "Security", "Intercom"],
      isLocked: !SubscriptionService.canAccessPremiumFeatures(user),
      builderContact: {
        name: "Sneha Joshi",
        phone: "+91 65432 10987",
        email: "sneha@skyline.com"
      }
    }
  ];

  useEffect(() => {
    setProperties(sampleProperties);
    setFilteredProperties(sampleProperties);
  }, [user]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    let filtered = properties;

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.propertyType !== "all") {
      filtered = filtered.filter(p => p.type === filters.propertyType);
    }

    if (filters.bedrooms !== "any") {
      const bedrooms = parseInt(filters.bedrooms);
      filtered = filtered.filter(p => p.bedrooms >= bedrooms);
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(p => 
        filters.amenities.some(amenity => p.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
    toast({
      title: "Filters Applied",
      description: `Found ${filtered.length} properties matching your criteria.`,
    });
  };

  const handleReset = () => {
    setFilters({
      location: "",
      propertyType: "all",
      priceRange: [1000000, 50000000] as [number, number],
      bedrooms: "any",
      bathrooms: "any",
      amenities: [] as string[],
      area: [500, 5000] as [number, number],
      readyToMove: false,
      newProject: false,
    });
    setFilteredProperties(properties);
  };

  const handleViewDetails = (property: Property) => {
    if (!user) {
      onLogin();
      return;
    }

    if (!SubscriptionService.canAccessPremiumFeatures(user)) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to view property details.",
        variant: "destructive",
      });
      return;
    }

    if (!SubscriptionService.canViewMoreProjects(user)) {
      toast({
        title: "Plan Limit Reached",
        description: "You've reached your plan's project viewing limit. Please upgrade.",
        variant: "destructive",
      });
      return;
    }

    // Increment project view count
    if (user) {
      SubscriptionService.incrementProjectView(user, updateUser);
    }

    setSelectedProperty(property);
    toast({
      title: "Property Details",
      description: `Contact: ${property.builderContact?.name} - ${property.builderContact?.phone}`,
    });
  };

  const handleDownloadBrochure = (property: Property) => {
    if (!user) {
      onLogin();
      return;
    }

    if (!SubscriptionService.canAccessPremiumFeatures(user)) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to download brochures.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Brochure Downloaded",
      description: `Brochure for ${property.title} has been downloaded.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Premium Properties</h1>
            <p className="text-muted-foreground">
              Discover {filteredProperties.length} verified properties from trusted builders
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* User Plan Info */}
        {user && (
          <Card className="mb-6 bg-accent/50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="text-sm">
                    {user.plan || "No Plan"}
                  </Badge>
                  {user.plan !== "Builder" && (
                    <span className="text-sm text-muted-foreground">
                      Projects viewed: {user.projectsViewed || 0}/{user.projectsLimit || 0}
                    </span>
                  )}
                  {user.plan === "Builder" && (
                    <span className="text-sm text-muted-foreground">
                      Builder Account - Unlimited Access
                    </span>
                  )}
                </div>
                {!user.plan && (
                  <Button size="sm" variant="default" onClick={() => window.location.href = '/pricing'} className="mt-2 sm:mt-0">
                    Subscribe Now
                  </Button>
                )}
                {user.plan === "Builder" && (
                  <Button size="sm" variant="outline" onClick={() => window.location.href = '/builder-dashboard'} className="mt-2 sm:mt-0">
                    Manage Projects
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(false)}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Close Filters
              </Button>
            </div>
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {filteredProperties.length === 0 ? (
              <Card className="p-12 text-center">
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results.
                  </p>
                  <Button onClick={handleReset}>Reset Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={handleViewDetails}
                    onDownloadBrochure={handleDownloadBrochure}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
