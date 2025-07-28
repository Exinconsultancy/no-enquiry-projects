
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilterContainer from "@/components/PropertyFilterContainer";
import AdminFAB from "@/components/AdminFAB";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const RentalsPage = () => {
  const { user } = useSecureAuth();
  const { getPropertiesByCategory } = useAdmin();
  const { toast } = useToast();
  const [filteredProperties, setFilteredProperties] = useState(getPropertiesByCategory("rental"));

  const stats = [
    { title: "Total Rentals", value: filteredProperties.length },
    { title: "Available Now", value: filteredProperties.filter(p => p.status === "active").length },
    { title: "Cities Covered", value: new Set(filteredProperties.map(p => p.location.split(",")[1]?.trim())).size },
    { title: "Property Types", value: new Set(filteredProperties.map(p => p.type)).size }
  ];

  const handleViewDetails = (property: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view rental details",
        variant: "destructive",
      });
      return;
    }

    if (!user.plan) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to view rental details",
        variant: "destructive",
      });
      return;
    }

    const hasReachedLimit = user.projectsViewed && user.projectsLimit && user.projectsViewed >= user.projectsLimit;
    if (hasReachedLimit) {
      toast({
        title: "Limit Reached",
        description: "You have reached your project viewing limit. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rental Details",
      description: "Rental details are now visible below",
    });
  };

  const handleDownloadBrochure = (property: any) => {
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Rental Properties
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find your perfect rental home from our extensive collection of furnished and unfurnished properties
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <PropertyFilterContainer
              properties={getPropertiesByCategory("rental")}
              onFilterChange={setFilteredProperties}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const propertyData = {
                  id: property.id,
                  title: property.title,
                  location: property.location,
                  price: property.price,
                  image: property.image || "/placeholder.svg",
                  bedrooms: 2,
                  bathrooms: 2,
                  area: "1200 sq ft",
                  type: property.type.toLowerCase() as "apartment" | "villa" | "commercial",
                  amenities: ["Fully Furnished", "WiFi", "Parking", "Security", "Maintenance", "Power Backup"],
                  builderContact: {
                    name: property.builder,
                    phone: "+91 9876543210",
                    email: "contact@rental.com"
                  },
                  category: property.category,
                  status: property.status,
                  builder: property.builder
                };

                return (
                  <PropertyCard
                    key={property.id}
                    property={propertyData}
                    onViewDetails={handleViewDetails}
                    onDownloadBrochure={handleDownloadBrochure}
                    user={user}
                  />
                );
              })}
            </div>

            {/* Empty State */}
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No rentals found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more rental properties
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Admin FAB */}
        <AdminFAB category="rental" />
      </div>
    </div>
  );
};

export default RentalsPage;
