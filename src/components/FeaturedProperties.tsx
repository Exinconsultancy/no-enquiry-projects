
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Bed, Bath, Square, ArrowRight, Home, Building, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const { properties, getPropertiesByCategory } = useAdmin();
  const [activeTab, setActiveTab] = useState("property");

  // Force re-render when properties change
  useEffect(() => {
    // This will trigger a re-render when properties are updated by admin
  }, [properties]);

  // Get top 5 properties from each category
  const getTopPropertiesByCategory = (category: "property" | "rental" | "hostel") => {
    return getPropertiesByCategory(category)
      .filter(p => p.status === "active")
      .slice(0, 5);
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

  const renderPropertyCard = (property: any) => (
    <Card key={property.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img
          src={property.image || "https://images.unsplash.com/photo-1721322800607-8c38375eef04"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="mb-2">
            {property.type}
          </Badge>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">
              {property.price}
            </div>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            2-3 BHK
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            2-3 Bath
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            1200-1800 sq ft
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          <span className="font-medium">Builder:</span> {property.builder}
        </div>

        <Button 
          onClick={() => handleViewProperty(property)}
          className="w-full group-hover:bg-primary/90 transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Discover our top 5 properties in each category across prime locations
          </p>
        </div>

        <Tabs defaultValue="property" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-12">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex items-center gap-2 text-sm"
                >
                  <Icon className="h-4 w-4" />
                  {config.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(categoryConfig).map(([category, config]) => {
            const categoryProperties = getTopPropertiesByCategory(category as "property" | "rental" | "hostel");
            
            return (
              <TabsContent key={category} value={category} className="space-y-8">
                <div className="text-center mb-8">
                  <p className="text-muted-foreground">
                    {config.description}
                  </p>
                </div>

                {categoryProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {categoryProperties.map(renderPropertyCard)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No {config.label.toLowerCase()} available at the moment.
                    </p>
                  </div>
                )}

                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => navigate(category === 'property' ? '/properties' : `/${category}s`)}
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
    </section>
  );
};

export default FeaturedProperties;
