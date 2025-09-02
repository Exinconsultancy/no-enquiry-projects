import { useState, useEffect } from "react";
import PropertySpecificFilters from "./PropertySpecificFilters";
import { Property } from "@/hooks/useProperties";

interface PropertySpecificFilterContainerProps {
  properties: Property[];
  onFilterChange: (filteredProperties: Property[]) => void;
}

const PropertySpecificFilterContainer = ({ properties, onFilterChange }: PropertySpecificFilterContainerProps) => {
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "all",
    priceRange: [1000000, 100000000] as [number, number],
    bedrooms: "any",
    amenities: [] as string[],
    readyToMove: false,
    newProject: false
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Auto-apply filters when they change
    applyFilters(newFilters);
  };

  const applyFilters = (filtersToApply: typeof filters) => {
    console.log('Applying property filters:', filtersToApply);
    console.log('Total properties:', properties.length);
    
    let filtered = [...properties];

    // Apply location filter with intelligent matching
    if (filtersToApply.location && filtersToApply.location.trim()) {
      const searchTerm = filtersToApply.location.toLowerCase().trim();
      filtered = filtered.filter(property => {
        const propertyLocation = property.location.toLowerCase();
        // Direct match, partial match, or word match
        return propertyLocation.includes(searchTerm) || 
               searchTerm.split(' ').some(term => 
                 term.length > 2 && propertyLocation.includes(term)
               );
      });
      console.log('After location filter:', filtered.length);
    }

    // Apply property type filter
    if (filtersToApply.propertyType && filtersToApply.propertyType !== "all") {
      filtered = filtered.filter(property => {
        const propertyType = property.type.toLowerCase();
        const filterType = filtersToApply.propertyType.toLowerCase();
        return propertyType.includes(filterType) || filterType.includes(propertyType);
      });
      console.log('After type filter:', filtered.length);
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
        // Skip monthly rentals for property filtering
        return false;
      } else {
        priceValue = parseFloat(priceStr) || 0;
      }
      
      const inRange = priceValue >= filtersToApply.priceRange[0] && priceValue <= filtersToApply.priceRange[1];
      return inRange;
    });
    console.log('After price filter:', filtered.length);

    // Apply bedrooms filter
    if (filtersToApply.bedrooms && filtersToApply.bedrooms !== "any") {
      filtered = filtered.filter(property => {
        const bedrooms = (property.bedrooms || property.type || "").toLowerCase();
        const filterBedrooms = filtersToApply.bedrooms.toLowerCase();
        
        // Handle specific configurations
        if (filterBedrooms === "villa" || filterBedrooms === "penthouse") {
          return bedrooms.includes(filterBedrooms) || property.type.toLowerCase().includes(filterBedrooms);
        }
        
        // Handle BHK configurations
        return bedrooms.includes(filterBedrooms) || 
               bedrooms.includes(`${filterBedrooms} bhk`) ||
               bedrooms.includes(`${filterBedrooms}bhk`);
      });
      console.log('After bedrooms filter:', filtered.length);
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
      console.log('After amenities filter:', filtered.length);
    }

    // Apply ready to move filter
    if (filtersToApply.readyToMove) {
      filtered = filtered.filter(property => 
        property.status === 'active'
      );
      console.log('After ready to move filter:', filtered.length);
    }

    // Apply new project filter (properties created in last 60 days)
    if (filtersToApply.newProject) {
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(property => 
        new Date(property.created_at) > sixtyDaysAgo
      );
      console.log('After new project filter:', filtered.length);
    }

    console.log('Final filtered properties:', filtered.length);
    onFilterChange(filtered);
  };

  // Apply filters whenever properties change
  useEffect(() => {
    if (properties.length > 0) {
      applyFilters(filters);
    }
  }, [properties]);

  const handleReset = () => {
    const resetFilters = {
      location: "",
      propertyType: "all",
      priceRange: [1000000, 100000000] as [number, number],
      bedrooms: "any",
      amenities: [] as string[],
      readyToMove: false,
      newProject: false
    };
    setFilters(resetFilters);
    applyFilters(resetFilters);
  };

  return (
    <PropertySpecificFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onReset={handleReset}
    />
  );
};

export default PropertySpecificFilterContainer;