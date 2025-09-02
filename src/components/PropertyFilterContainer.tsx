
import { useState } from "react";
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
  };

  const handleSearch = () => {
    let filtered = properties;

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply property type filter
    if (filters.propertyType !== "all") {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    // Apply price range filter
    filtered = filtered.filter(property => {
      // Extract numeric value from price string (e.g., "₹2.5 Cr" -> 25000000)
      const priceStr = property.price.replace(/[₹,\s]/g, '');
      let priceValue = 0;
      
      if (priceStr.includes('Cr')) {
        priceValue = parseFloat(priceStr.replace('Cr', '')) * 10000000;
      } else if (priceStr.includes('L')) {
        priceValue = parseFloat(priceStr.replace('L', '')) * 100000;
      } else {
        priceValue = parseFloat(priceStr) || 0;
      }
      
      return priceValue >= filters.priceRange[0] && priceValue <= filters.priceRange[1];
    });

    // Apply bedrooms filter
    if (filters.bedrooms !== "any") {
      filtered = filtered.filter(property => {
        const bedrooms = property.bedrooms || property.type;
        return bedrooms.toLowerCase().includes(filters.bedrooms);
      });
    }

    // Apply bathrooms filter
    if (filters.bathrooms !== "any") {
      filtered = filtered.filter(property => {
        const bathrooms = property.bathrooms || "2";
        return bathrooms.includes(filters.bathrooms);
      });
    }

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property => {
        const propertyAmenities = property.amenities || [];
        return filters.amenities.some(amenity => 
          propertyAmenities.some(propAmenity => 
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    // Apply ready to move filter
    if (filters.readyToMove) {
      filtered = filtered.filter(property => 
        property.status === 'active'
      );
    }

    // Apply new project filter
    if (filters.newProject) {
      filtered = filtered.filter(property => 
        new Date(property.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
      );
    }

    onFilterChange(filtered);
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
    onFilterChange(properties);
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
