
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X } from "lucide-react";

interface Filters {
  location: string;
  propertyType: string;
  priceRange: [number, number];
  bedrooms: string;
  amenities: string[];
  area: [number, number];
  readyToMove: boolean;
  newProject: boolean;
}

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onSearch: () => void;
  onReset: () => void;
}

const PropertyFilters = ({ filters, onFiltersChange, onSearch, onReset }: PropertyFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const amenitiesList = [
    "Swimming Pool", "Gym", "Parking", "Security", "Garden", "Club House",
    "Children's Play Area", "Elevator", "Power Backup", "Water Supply",
    "CCTV", "Intercom", "Fire Safety", "Waste Management"
  ];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updatedAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    
    onFiltersChange({ ...filters, amenities: updatedAmenities });
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => onFiltersChange({ ...filters, propertyType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
              max={50000000}
              min={1000000}
              step={500000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => onFiltersChange({ ...filters, bedrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1 BHK</SelectItem>
              <SelectItem value="2">2 BHK</SelectItem>
              <SelectItem value="3">3 BHK</SelectItem>
              <SelectItem value="4">4+ BHK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label>Quick Filters</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ready-to-move"
              checked={filters.readyToMove}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, readyToMove: checked as boolean })}
            />
            <label htmlFor="ready-to-move" className="text-sm">Ready to Move</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-project"
              checked={filters.newProject}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, newProject: checked as boolean })}
            />
            <label htmlFor="new-project" className="text-sm">New Project</label>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Amenities</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>
          
          <div className="space-y-2">
            {amenitiesList.slice(0, isExpanded ? amenitiesList.length : 6).map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <label htmlFor={amenity} className="text-sm">{amenity}</label>
              </div>
            ))}
          </div>

          {filters.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button onClick={onSearch} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyFilters;
