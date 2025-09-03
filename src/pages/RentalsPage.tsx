
import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useProperties";
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
import { useMaintenance } from "@/contexts/MaintenanceContext";
import MaintenancePage from "@/components/MaintenancePage";
import { SubscriptionService } from "@/services/subscriptionService";

const RentalsPage = () => {
  const { user } = useAuth();
  const { getPropertiesByCategory } = useProperties();
  const { isPageInMaintenance, maintenanceMode } = useMaintenance();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if rentals page is in maintenance mode
  if (isPageInMaintenance('rentals')) {
    return <MaintenancePage pageName="Rentals" customMessage={maintenanceMode.globalMessage} />;
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const rentals = getPropertiesByCategory("rental");

  const filteredRentals = useMemo(() => {
    let filtered = rentals.filter(rental => {
      const matchesSearch = rental.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rental.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || locationFilter === "all" || rental.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = !typeFilter || typeFilter === "all" || rental.type.toLowerCase() === typeFilter.toLowerCase();
      // Parse rental price for filtering
      const matchesPrice = !priceFilter || priceFilter === "all" || (() => {
        const priceStr = rental.price.replace(/[₹,\s]/g, '');
        const priceValue = parseFloat(priceStr.replace('/month', '')) || 0;
        
        switch(priceFilter) {
          case "30000": return priceValue <= 35000;
          case "50000": return priceValue >= 35000 && priceValue <= 60000;
          case "80000": return priceValue > 60000;
          default: return true;
        }
      })();
      
      return matchesSearch && matchesLocation && matchesType && matchesPrice;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch(sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-low":
          const priceA = parseFloat(a.price.replace(/[₹,\s/month]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[₹,\s/month]/g, '')) || 0;
          return priceA - priceB;
        case "price-high":
          const priceA2 = parseFloat(a.price.replace(/[₹,\s/month]/g, '')) || 0;
          const priceB2 = parseFloat(b.price.replace(/[₹,\s/month]/g, '')) || 0;
          return priceB2 - priceA2;
        case "title-az":
          return a.title.localeCompare(b.title);
        case "title-za":
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [rentals, searchTerm, locationFilter, priceFilter, typeFilter, sortBy]);

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
                <SelectItem value="koregaon park">Koregaon Park</SelectItem>
                <SelectItem value="viman nagar">Viman Nagar</SelectItem>
                <SelectItem value="baner">Baner</SelectItem>
                <SelectItem value="hinjewadi">Hinjewadi</SelectItem>
                <SelectItem value="wakad">Wakad</SelectItem>
                <SelectItem value="magarpatta">Magarpatta</SelectItem>
                <SelectItem value="hadapsar">Hadapsar</SelectItem>
                <SelectItem value="shivaji nagar">Shivaji Nagar</SelectItem>
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
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="30000">Under ₹35,000</SelectItem>
                <SelectItem value="50000">₹35,000 - ₹60,000</SelectItem>
                <SelectItem value="80000">Above ₹60,000</SelectItem>
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="title-az">Title: A-Z</SelectItem>
                <SelectItem value="title-za">Title: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => (
            <PropertyCard
              key={rental.id}
              property={rental}
              onViewDetails={handleViewDetails}
              onDownloadBrochure={handleDownloadBrochure}
              user={user}
            />
          ))}
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
