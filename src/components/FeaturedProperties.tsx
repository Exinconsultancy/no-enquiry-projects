
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const { properties } = useAdmin();

  // Get first 6 properties for featured section
  const featuredProperties = properties.slice(0, 6);

  const handleViewProperty = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Discover our hand-picked selection of premium properties across prime locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
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
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/properties')}
          >
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
