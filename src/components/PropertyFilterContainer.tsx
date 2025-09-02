
import { useState, useEffect } from "react";
import PropertyFilters from "./PropertyFilters";
import { Property } from "@/hooks/useProperties";

interface PropertyFilterContainerProps {
  properties: Property[];
  onFilterChange: (filteredProperties: Property[]) => void;
}

const PropertyFilterContainer = ({ properties, onFilterChange }: PropertyFilterContainerProps) => {
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "all",
    priceRange: [1000000, 50000000] as [number, number],
    bedrooms: "any",
    bathrooms: "any",
    amenities: [] as string[],
    area: [500, 5000] as [number, number],
    readyToMove: false,
    newProject: false
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Auto-apply filters when they change
    applyFilters(newFilters);
  };

  const applyFilters = (filtersToApply: typeof filters) => {
    let filtered = properties;

    // Apply location filter
    if (filtersToApply.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filtersToApply.location.toLowerCase())
      );
    }

    // Apply property type filter
    if (filtersToApply.propertyType !== "all") {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === filtersToApply.propertyType.toLowerCase()
      );
    }

    // Apply price range filter
    filtered = filtered.filter(property => {
      // Extract numeric value from price string
      const priceStr = property.price.replace(/[₹,\s]/g, '');
      let priceValue = 0;
      
      if (priceStr.includes('Cr')) {
        // Property prices like "₹2.5 Cr" -> 25000000
        priceValue = parseFloat(priceStr.replace('Cr', '')) * 10000000;
      } else if (priceStr.includes('L')) {
        // Property prices like "₹50 L" -> 5000000
        priceValue = parseFloat(priceStr.replace('L', '')) * 100000;
      } else if (priceStr.includes('/month')) {
        // Rental/hostel prices like "₹45000/month" -> 45000 (convert to annual for comparison)
        priceValue = parseFloat(priceStr.replace('/month', '')) * 12;
      } else {
        priceValue = parseFloat(priceStr) || 0;
      }
      
      return priceValue >= filtersToApply.priceRange[0] && priceValue <= filtersToApply.priceRange[1];
    });

    // Apply bedrooms filter
    if (filtersToApply.bedrooms !== "any") {
      filtered = filtered.filter(property => {
        const bedrooms = property.bedrooms || property.type;
        return bedrooms.toLowerCase().includes(filtersToApply.bedrooms);
      });
    }

    // Apply bathrooms filter
    if (filtersToApply.bathrooms !== "any") {
      filtered = filtered.filter(property => {
        const bathrooms = property.bathrooms || "2";
        return bathrooms.includes(filtersToApply.bathrooms);
      });
    }

    // Apply amenities filter
    if (filtersToApply.amenities.length > 0) {
      filtered = filtered.filter(property => {
        const propertyAmenities = property.amenities || [];
        return filtersToApply.amenities.some(amenity => 
          propertyAmenities.some(propAmenity => 
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    // Apply ready to move filter
    if (filtersToApply.readyToMove) {
      filtered = filtered.filter(property => 
        property.status === 'active'
      );
    }

    // Apply new project filter
    if (filtersToApply.newProject) {
      filtered = filtered.filter(property => 
        new Date(property.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
      );
    }

    onFilterChange(filtered);
  };

  // Apply filters whenever properties change
  useEffect(() => {
    applyFilters(filters);
  }, [properties]);

  const handleSearch = () => {
    // This is now just an alias for applying current filters
    applyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: "",
      propertyType: "all",
      priceRange: [1000000, 50000000] as [number, number],
      bedrooms: "any",
      bathrooms: "any",
      amenities: [] as string[],
      area: [500, 5000] as [number, number],
      readyToMove: false,
      newProject: false
    };
    setFilters(resetFilters);
    applyFilters(resetFilters);
  };

  return (
    <PropertyFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onSearch={handleSearch}
      onReset={handleReset}
    />
  );
};

export default PropertyFilterContainer;
