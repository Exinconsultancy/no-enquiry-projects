import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Grid, List, SlidersHorizontal, X, Home, Gift, Star } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface RentalProperty {
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
  isAvailable: boolean;
  deposit: string;
  ownerContact: {
    name: string;
    phone: string;
    email: string;
  };
}

interface RentalsPageProps {
  user?: { name: string } | null;
}

const RentalsPage = ({ user }: RentalsPageProps) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<RentalProperty[]>([]);

  const [filters, setFilters] = useState({
    location: "",
    propertyType: "all",
    priceRange: [5000, 100000] as [number, number],
    bedrooms: "any",
    bathrooms: "any",
    amenities: [] as string[],
    area: [300, 3000] as [number, number],
    readyToMove: false,
    newProject: false,
  });

  // Sample rental properties data
  const sampleRentals: RentalProperty[] = [
    {
      id: "r1",
      title: "Modern 2BHK in Tech Hub",
      location: "Whitefield, Bangalore",
      price: "₹25,000/month",
      deposit: "₹50,000",
      image: property1,
      bedrooms: 2,
      bathrooms: 2,
      area: "1,200 sq ft",
      type: "apartment",
      amenities: ["Parking", "Security", "Gym", "Swimming Pool"],
      isAvailable: true,
      ownerContact: {
        name: "Sanjay Reddy",
        phone: "+91 98765 43210",
        email: "sanjay@email.com"
      }
    },
    {
      id: "r2",
      title: "Luxury Villa with Garden",
      location: "Koramangala, Bangalore",
      price: "₹60,000/month",
      deposit: "₹1,20,000",
      image: property2,
      bedrooms: 4,
      bathrooms: 3,
      area: "2,500 sq ft",
      type: "villa",
      amenities: ["Garden", "Parking", "Security", "Power Backup"],
      isAvailable: true,
      ownerContact: {
        name: "Meera Patel",
        phone: "+91 87654 32109",
        email: "meera@email.com"
      }
    },
    {
      id: "r3",
      title: "Commercial Office Space",
      location: "MG Road, Bangalore",
      price: "₹80,000/month",
      deposit: "₹2,40,000",
      image: property3,
      bedrooms: 0,
      bathrooms: 2,
      area: "1,800 sq ft",
      type: "commercial",
      amenities: ["Elevator", "CCTV", "Fire Safety", "Parking"],
      isAvailable: true,
      ownerContact: {
        name: "Rajesh Kumar",
        phone: "+91 76543 21098",
        email: "rajesh@email.com"
      }
    },
    {
      id: "r4",
      title: "Cozy 1BHK Near Metro",
      location: "Indiranagar, Bangalore",
      price: "₹18,000/month",
      deposit: "₹36,000",
      image: property1,
      bedrooms: 1,
      bathrooms: 1,
      area: "800 sq ft",
      type: "apartment",
      amenities: ["Metro Access", "Security", "Parking"],
      isAvailable: true,
      ownerContact: {
        name: "Priya Sharma",
        phone: "+91 65432 10987",
        email: "priya@email.com"
      }
    }
  ];

  useEffect(() => {
    setProperties(sampleRentals);
    setFilteredProperties(sampleRentals);
  }, []);

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
      description: `Found ${filtered.length} rental properties matching your criteria.`,
    });
  };

  const handleReset = () => {
    setFilters({
      location: "",
      propertyType: "all",
      priceRange: [5000, 100000] as [number, number],
      bedrooms: "any",
      bathrooms: "any",
      amenities: [] as string[],
      area: [300, 3000] as [number, number],
      readyToMove: false,
      newProject: false,
    });
    setFilteredProperties(properties);
  };

  const handleViewDetails = (property: any) => {
    const rental = property as RentalProperty;
    toast({
      title: "Contact Details",
      description: `Owner: ${rental.ownerContact.name} - ${rental.ownerContact.phone}`,
    });
  };

  const handleDownloadBrochure = (property: any) => {
    toast({
      title: "Brochure Downloaded",
      description: `Property details for ${property.title} downloaded.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Gift className="h-12 w-12 text-success mr-3" />
            <Badge variant="outline" className="text-lg px-4 py-2 border-success text-success">
              100% FREE
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Rental Properties</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse rental properties completely free! Connect directly with property owners without any charges or commissions.
          </p>
        </div>

        {/* Free Service Highlight */}
        <Card className="mb-8 bg-gradient-to-r from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-success/20 p-3 rounded-full">
                  <Home className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Free Rental Service</h3>
                  <p className="text-muted-foreground">
                    No subscription fees, no hidden charges - completely free forever!
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">4.8/5 Rating</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Available Rentals</h2>
            <p className="text-muted-foreground">
              {filteredProperties.length} properties available for rent
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
                  <h3 className="text-xl font-semibold mb-2">No Rental Properties Found</h3>
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
                  <Card key={property.id} className="group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 overflow-hidden">
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
                      <Badge
                        className="absolute top-3 right-3 bg-success text-success-foreground"
                      >
                        Available
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                      <p className="text-muted-foreground mb-2">{property.location}</p>
                      <div className="space-y-1 mb-3">
                        <div className="text-2xl font-bold text-primary">{property.price}</div>
                        <div className="text-sm text-muted-foreground">Deposit: {property.deposit}</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-sm font-medium">{property.bedrooms}</div>
                          <div className="text-xs text-muted-foreground">Bedrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{property.bathrooms}</div>
                          <div className="text-xs text-muted-foreground">Bathrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{property.area}</div>
                          <div className="text-xs text-muted-foreground">Area</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{property.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => handleViewDetails(property)}
                        >
                          Contact Owner
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDownloadBrochure(property)}
                        >
                          Download Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* How Rental Service Works */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-12">How Our Free Rental Service Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-none shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Browse Properties</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  Browse through hundreds of verified rental properties across different locations
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-none shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Contact Directly</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  Get direct contact details of property owners - no intermediaries, no extra fees
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-none shadow-lg">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Move In</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  Complete the rental process directly with the owner and move into your new home
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalsPage;