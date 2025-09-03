
import React, { useState, useMemo } from "react";
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
import PropertyCard from "@/components/PropertyCard";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import MaintenancePage from "@/components/MaintenancePage";
import { SubscriptionService } from "@/services/subscriptionService";

const HostelPage = () => {
  const { user } = useAuth();
  const { getPropertiesByCategory } = useProperties();
  const { isPageInMaintenance, maintenanceMode } = useMaintenance();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if hostels page is in maintenance mode
  if (isPageInMaintenance('hostels')) {
    return <MaintenancePage pageName="Hostels" customMessage={maintenanceMode.globalMessage} />;
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const hostels = getPropertiesByCategory("hostel");

  const filteredHostels = useMemo(() => {
    let filtered = hostels.filter(hostel => {
      const matchesSearch = hostel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hostel.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || locationFilter === "all" || hostel.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = !typeFilter || typeFilter === "all" || hostel.type.toLowerCase() === typeFilter.toLowerCase();
      // Parse hostel price for filtering
      const matchesPrice = !priceFilter || priceFilter === "all" || (() => {
        const priceStr = hostel.price.replace(/[₹,\s]/g, '');
        const priceValue = parseFloat(priceStr.replace('/month', '')) || 0;
        
        switch(priceFilter) {
          case "12000": return priceValue <= 15000;
          case "18000": return priceValue >= 15000 && priceValue <= 20000;
          case "25000": return priceValue > 20000;
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
  }, [hostels, searchTerm, locationFilter, priceFilter, typeFilter, sortBy]);

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
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Hostel</h1>
          <p className="text-muted-foreground text-lg">
            Comfortable and affordable accommodation for students and professionals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hostels..."
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
                <SelectItem value="katraj">Katraj</SelectItem>
                <SelectItem value="shivaji nagar">Shivaji Nagar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hostel">Hostel</SelectItem>
                <SelectItem value="pg">PG</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="12000">Under ₹15,000</SelectItem>
                <SelectItem value="18000">₹15,000 - ₹20,000</SelectItem>
                <SelectItem value="25000">Above ₹20,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {filteredHostels.length} Hostels Found
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
          {filteredHostels.map((hostel) => (
            <PropertyCard
              key={hostel.id}
              property={hostel}
              onViewDetails={handleViewDetails}
              onDownloadBrochure={handleDownloadBrochure}
              user={user}
            />
          ))}
        </div>

        {filteredHostels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hostels found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelPage;
