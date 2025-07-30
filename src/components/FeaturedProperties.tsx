
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Bed, Bath, Square, ArrowRight, Home, Building, UserCheck, Wifi, Car, Shield, Dumbbell, Waves, Coffee, Utensils, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProperties, Property } from "@/hooks/useProperties";
import { useState } from "react";
import AdminFAB from "./AdminFAB";

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const { properties, loading, getPropertiesByCategory } = useProperties();
  const [activeTab, setActiveTab] = useState("property");

  // Get top 5 properties from each category
  const getTopPropertiesByCategory = (category: "property" | "rental" | "hostel") => {
    return getPropertiesByCategory(category)
      .filter(p => p.status === "active")
      .slice(0, 5);
  };

  // Map amenities to icons
  const getAmenityIcon = (amenity: string) => {
    const amenityMap: Record<string, any> = {
      'wifi': Wifi,
      'parking': Car,
      'security': Shield,
      'gym': Dumbbell,
      'swimming': Waves,
      'cafe': Coffee,
      'restaurant': Utensils,
      'ac': Wind,
      'internet': Wifi,
      'pool': Waves,
      'food': Utensils
    };
    
    const key = amenity.toLowerCase().replace(/\s+/g, '');
    return amenityMap[key] || Shield;
  };

  const handleViewProperty = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const categoryConfig = {
    property: {
      label: "Properties",
      icon: Home,
      description: "Premium residential and commercial properties"
    },
    rental: {
      label: "Rentals", 
      icon: Building,
      description: "Quality rental properties for every budget"
    },
    hostel: {
      label: "Hostels & PG",
      icon: UserCheck,
      description: "Comfortable accommodations for students and professionals"
    }
  };

  const renderPropertyCard = (property: Property) => (
    <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge variant="secondary" className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm">
          {property.type}
        </Badge>
      </div>
      
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>
          <div className="text-right ml-2">
            <div className="text-xl font-bold text-primary">
              {property.price}
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <Bed className="h-4 w-4 mb-1" />
            <span className="line-clamp-1">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Bath className="h-4 w-4 mb-1" />
            <span className="line-clamp-1">{property.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Square className="h-4 w-4 mb-1" />
            <span className="line-clamp-1">{property.area}</span>
          </div>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {property.amenities.slice(0, 4).map((amenity, index) => {
                const IconComponent = getAmenityIcon(amenity);
                return (
                  <div key={index} className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-xs text-primary">
                    <IconComponent className="h-3 w-3" />
                    <span className="hidden sm:inline">{amenity}</span>
                  </div>
                );
              })}
              {property.amenities.length > 4 && (
                <div className="flex items-center px-2 py-1 bg-muted/50 rounded-full text-xs text-muted-foreground">
                  +{property.amenities.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground mb-4 p-2 bg-muted/20 rounded">
          <span className="font-medium">Builder:</span> <span className="text-foreground">{property.builder}</span>
        </div>

        <Button 
          onClick={() => handleViewProperty(property)}
          className="w-full group-hover:shadow-lg transition-all duration-300"
          size="sm"
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Loading top properties across all categories...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-t-lg" />
                <CardContent className="p-4 sm:p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-background via-background/95 to-primary/5 min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Featured Properties
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto">
            Discover our top 5 properties in each category across prime locations
          </p>
        </div>

        <Tabs defaultValue="property" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-12 h-12">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2"
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                  <span className="sm:hidden">{config.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(categoryConfig).map(([category, config]) => {
            const categoryProperties = getTopPropertiesByCategory(category as "property" | "rental" | "hostel");
            
            return (
              <TabsContent key={category} value={category} className="space-y-6 sm:space-y-8">
                <div className="text-center mb-6 sm:mb-8">
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {config.description}
                  </p>
                </div>

                {categoryProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                    {categoryProperties.map(renderPropertyCard)}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-8 sm:p-12 max-w-md mx-auto">
                      <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <config.icon className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        No {config.label.toLowerCase()} available at the moment.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Check back soon for new listings!
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center mt-8 sm:mt-12">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => navigate(category === 'property' ? '/properties' : `/${category}s`)}
                    className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                  >
                    View All {config.label}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
      
      {/* Admin FAB for adding properties */}
      <AdminFAB category={activeTab as "property" | "rental" | "hostel"} />
    </section>
  );
};

export default FeaturedProperties;
