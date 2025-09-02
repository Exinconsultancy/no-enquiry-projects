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

interface PropertyFilters {
  location: string;
  propertyType: string;
  priceRange: [number, number];
  bedrooms: string;
  amenities: string[];
  readyToMove: boolean;
  newProject: boolean;
}

interface PropertySpecificFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onApplyFilters: () => void;
  onReset: () => void;
}

const PropertySpecificFilters = ({ filters, onFiltersChange, onApplyFilters, onReset }: PropertySpecificFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const amenitiesList = [
    "Swimming Pool", "Gym", "Parking", "Security", "Garden", "Club House",
    "Children's Play Area", "Elevator", "Power Backup", "Water Supply",
    "CCTV", "Intercom", "Fire Safety", "Waste Management", "Jogging Track",
    "Indoor Games", "Visitor Parking", "Landscaped Gardens"
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
            <span>Property Filters</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location Search */}
        <div className="space-y-2">
          <Label>Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by area (e.g., Baner, Hinjewadi)..."
              value={filters.location}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Search for specific areas like Baner, Koregaon Park, etc.
          </p>
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
              <SelectItem value="duplex">Duplex</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="commercial">Commercial Space</SelectItem>
              <SelectItem value="row house">Row House</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Budget Range</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
              max={100000000}
              min={1000000}
              step={1000000}
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
          <Label>Configuration</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => onFiltersChange({ ...filters, bedrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Configuration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Configuration</SelectItem>
              <SelectItem value="1">1 BHK</SelectItem>
              <SelectItem value="2">2 BHK</SelectItem>
              <SelectItem value="3">3 BHK</SelectItem>
              <SelectItem value="4">4+ BHK</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label>Property Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ready-to-move"
                checked={filters.readyToMove}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, readyToMove: checked as boolean })}
              />
              <label htmlFor="ready-to-move" className="text-sm font-medium">Ready to Move</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-project"
                checked={filters.newProject}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, newProject: checked as boolean })}
              />
              <label htmlFor="new-project" className="text-sm font-medium">New Launch</label>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Amenities & Features</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {amenitiesList.slice(0, isExpanded ? amenitiesList.length : 8).map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</label>
              </div>
            ))}
          </div>

          {/* Selected Amenities */}
          {filters.amenities.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs">Selected Amenities:</Label>
              <div className="flex flex-wrap gap-1">
                {filters.amenities.map((amenity) => (
                  <Badge 
                    key={amenity} 
                    variant="secondary" 
                    className="text-xs cursor-pointer"
                    onClick={() => handleAmenityChange(amenity, false)}
                  >
                    {amenity} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply Filters Button */}
        <div className="pt-4 border-t">
          <Button onClick={onApplyFilters} className="w-full mb-3">
            Apply Filters
          </Button>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Active Filters:</span>
            <span className="font-medium">
              {[
                filters.location && 'Location',
                filters.propertyType !== 'all' && 'Type',
                filters.bedrooms !== 'any' && 'Config',
                filters.readyToMove && 'Ready',
                filters.newProject && 'New',
                filters.amenities.length > 0 && `${filters.amenities.length} Amenities`
              ].filter(Boolean).length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertySpecificFilters;