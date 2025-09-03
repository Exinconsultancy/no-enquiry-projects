
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import AdminFAB from "@/components/AdminFAB";
import { useProperties } from "@/hooks/useProperties";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import MaintenancePage from "@/components/MaintenancePage";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionService } from "@/services/subscriptionService";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const properties = getPropertiesByCategory("property");

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || locationFilter === "all" || property.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = !typeFilter || typeFilter === "all" || property.type.toLowerCase().includes(typeFilter.toLowerCase());
      // Parse property price for filtering
      const matchesPrice = !priceFilter || priceFilter === "all" || (() => {
        const priceStr = property.price.replace(/[₹,\s]/g, '');
        let priceValue = 0;
        
        if (priceStr.includes('Cr')) {
          priceValue = parseFloat(priceStr.replace('Cr', '')) * 10000000;
        } else if (priceStr.includes('L')) {
          priceValue = parseFloat(priceStr.replace('L', '')) * 100000;
        } else {
          priceValue = parseFloat(priceStr) || 0;
        }
        
        switch(priceFilter) {
          case "50L": return priceValue <= 5000000;
          case "1Cr": return priceValue >= 5000000 && priceValue <= 10000000;
          case "2Cr": return priceValue >= 10000000 && priceValue <= 20000000;
          case "5Cr": return priceValue > 20000000;
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
          const getPriceValue = (price: string) => {
            const priceStr = price.replace(/[₹,\s]/g, '');
            if (priceStr.includes('Cr')) {
              return parseFloat(priceStr.replace('Cr', '')) * 10000000;
            } else if (priceStr.includes('L')) {
              return parseFloat(priceStr.replace('L', '')) * 100000;
            }
            return parseFloat(priceStr) || 0;
          };
          return getPriceValue(a.price) - getPriceValue(b.price);
        case "price-high":
          const getPriceValue2 = (price: string) => {
            const priceStr = price.replace(/[₹,\s]/g, '');
            if (priceStr.includes('Cr')) {
              return parseFloat(priceStr.replace('Cr', '')) * 10000000;
            } else if (priceStr.includes('L')) {
              return parseFloat(priceStr.replace('L', '')) * 100000;
            }
            return parseFloat(priceStr) || 0;
          };
          return getPriceValue2(b.price) - getPriceValue2(a.price);
        case "title-az":
          return a.title.localeCompare(b.title);
        case "title-za":
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [properties, searchTerm, locationFilter, priceFilter, typeFilter, sortBy]);

  

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

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
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
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="50L">Under ₹50 Lakh</SelectItem>
                <SelectItem value="1Cr">₹50L - ₹1 Crore</SelectItem>
                <SelectItem value="2Cr">₹1 - ₹2 Crores</SelectItem>
                <SelectItem value="5Cr">Above ₹2 Crores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {filteredProperties.length} Properties Found
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
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Admin FAB */}
        <AdminFAB category="property" />
      </div>
    </div>
  );
};

export default PropertiesPage;
