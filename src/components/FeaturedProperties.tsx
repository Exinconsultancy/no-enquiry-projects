
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: "apartment" | "villa" | "commercial";
  rating: number;
}

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([]);

  useEffect(() => {
    // Mock featured properties data
    const mockProperties: FeaturedProperty[] = [
      {
        id: "1",
        title: "Luxury Penthouse Downtown",
        location: "Mumbai, Maharashtra",
        price: "₹2.5 Cr",
        image: "/src/assets/property-1.jpg",
        bedrooms: 4,
        bathrooms: 3,
        area: "2500 sq ft",
        type: "apartment",
        rating: 4.8
      },
      {
        id: "2",
        title: "Modern Villa with Garden",
        location: "Bangalore, Karnataka",
        price: "₹1.8 Cr",
        image: "/src/assets/property-2.jpg",
        bedrooms: 5,
        bathrooms: 4,
        area: "3200 sq ft",
        type: "villa",
        rating: 4.9
      },
      {
        id: "3",
        title: "Commercial Space Prime Location",
        location: "Delhi, NCR",
        price: "₹5.2 Cr",
        image: "/src/assets/property-3.jpg",
        bedrooms: 0,
        bathrooms: 2,
        area: "4500 sq ft",
        type: "commercial",
        rating: 4.7
      },
      {
        id: "4",
        title: "Seafront Apartment",
        location: "Goa, India",
        price: "₹1.2 Cr",
        image: "/src/assets/property-1.jpg",
        bedrooms: 3,
        bathrooms: 2,
        area: "1800 sq ft",
        type: "apartment",
        rating: 4.6
      },
      {
        id: "5",
        title: "Tech Park Office Space",
        location: "Hyderabad, Telangana",
        price: "₹3.5 Cr",
        image: "/src/assets/property-2.jpg",
        bedrooms: 0,
        bathrooms: 4,
        area: "6000 sq ft",
        type: "commercial",
        rating: 4.5
      }
    ];
    
    setFeaturedProperties(mockProperties);
  }, []);

  const handlePropertyClick = (property: FeaturedProperty) => {
    navigate('/properties', { state: { selectedProperty: property } });
  };

  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-muted-foreground text-lg">
            Discover our top-rated properties carefully selected for you
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {featuredProperties.map((property) => (
              <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
                    >
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center text-xs">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="font-medium">{property.rating}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                    
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    
                    <div className="text-2xl font-bold text-primary mb-3">{property.price}</div>
                    
                    {property.type !== "commercial" && (
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Square className="h-4 w-4 mr-1" />
                          <span>{property.area}</span>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full mt-4" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedProperties;
