
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilterContainer from "@/components/PropertyFilterContainer";
import AdminFAB from "@/components/AdminFAB";
import { useProperties } from "@/hooks/useProperties";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import MaintenancePage from "@/components/MaintenancePage";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionService } from "@/services/subscriptionService";

const PropertiesPage = () => {
  const { user } = useAuth();
  const { getPropertiesByCategory } = useProperties();
  const { isPageInMaintenance, maintenanceMode } = useMaintenance();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if properties page is in maintenance mode
  if (isPageInMaintenance('properties')) {
    return <MaintenancePage pageName="Properties" customMessage={maintenanceMode.globalMessage} />;
  }
  const properties = getPropertiesByCategory("property");
  const [filteredProperties, setFilteredProperties] = useState(properties);

  

  const handleViewDetails = (property: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view property details",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

    // Navigate to property detail page
    navigate(`/${property.category}/${property.id}`);
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

    // For authenticated users, allow downloading brochures
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
            Properties for Sale
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your dream property from our curated collection of premium residential and commercial spaces
          </p>
        </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <PropertyFilterContainer
              properties={properties}
              onFilterChange={setFilteredProperties}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

            {/* Empty State */}
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No properties found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more properties
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Admin FAB */}
        <AdminFAB category="property" />
      </div>
    </div>
  );
};

export default PropertiesPage;
