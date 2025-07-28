
import { useState } from "react";
import PropertyFilters from "./PropertyFilters";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  builder: string;
  status: "active" | "pending" | "sold";
  createdDate: string;
  image?: string;
  description?: string;
  category: "property" | "rental" | "hostel";
}

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

    // Apply new project filter
    if (filters.newProject) {
      filtered = filtered.filter(property => 
        new Date(property.createdDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
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
