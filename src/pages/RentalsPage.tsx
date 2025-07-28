
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Bath, Maximize, Download, Eye, Heart, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard";

const RentalsPage = () => {
  const { user } = useSecureAuth();
  const { getPropertiesByCategory } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const rentals = getPropertiesByCategory("rental");

  const filteredRentals = useMemo(() => {
    return rentals.filter(rental => {
      const matchesSearch = rental.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rental.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || rental.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = !typeFilter || rental.type.toLowerCase() === typeFilter.toLowerCase();
      // Basic price filtering - in real app, you'd parse price ranges
      const matchesPrice = !priceFilter || rental.price.includes(priceFilter);
      
      return matchesSearch && matchesLocation && matchesType && matchesPrice;
    });
  }, [rentals, searchTerm, locationFilter, priceFilter, typeFilter]);

  const handleViewDetails = (property: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view property details",
        variant: "destructive",
      });
      return;
    }

    if (!user.plan) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to view property details",
        variant: "destructive",
      });
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Rental</h1>
          <p className="text-muted-foreground text-lg">
            Discover comfortable and affordable rental properties in prime locations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rentals..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="25000">Under ₹30,000</SelectItem>
                <SelectItem value="35000">₹30,000 - ₹40,000</SelectItem>
                <SelectItem value="45000">Above ₹40,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {filteredRentals.length} Rentals Found
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Sort by: Newest</span>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => {
            const propertyData = {
              id: rental.id,
              title: rental.title,
              location: rental.location,
              price: rental.price,
              image: rental.image || "/placeholder.svg",
              bedrooms: rental.type === "Villa" ? 4 : 2,
              bathrooms: rental.type === "Villa" ? 3 : 2,
              area: rental.type === "Villa" ? "2500 sq ft" : "1200 sq ft",
              type: rental.type as "apartment" | "villa" | "commercial",
              amenities: ["Parking", "Security", "Maintenance", "Power Backup"],
              builderContact: {
                name: rental.builder,
                phone: "+91 9876543210",
                email: "contact@builder.com"
              },
              category: rental.category as "property" | "rental" | "hostel",
              status: rental.status as "active" | "pending" | "sold",
              builder: rental.builder,
              createdDate: rental.createdDate
            };

            return (
              <PropertyCard
                key={rental.id}
                property={propertyData}
                onViewDetails={handleViewDetails}
                onDownloadBrochure={handleDownloadBrochure}
                user={user}
              />
            );
          })}
        </div>

        {filteredRentals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No rentals found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalsPage;
