
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminPropertyControls from "./AdminPropertyControls";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: string;
    image: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    type: "apartment" | "villa" | "commercial";
    amenities: string[];
    builderContact: {
      name: string;
      phone: string;
      email: string;
    };
    category?: "property" | "rental" | "hostel";
    status?: "active" | "pending" | "sold";
    builder?: string;
  };
  onViewDetails: (property: any) => void;
  onDownloadBrochure: (property: any) => void;
  user: any;
}

const PropertyCard = ({ property, onViewDetails, onDownloadBrochure, user }: PropertyCardProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(property);
  };

  const handleDownloadBrochure = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownloadBrochure(property);
  };

  // Convert property data to admin-compatible format
  const adminProperty = {
    id: property.id,
    title: property.title,
    location: property.location,
    price: property.price,
    type: property.type,
    builder: property.builder || property.builderContact.name,
    status: property.status || "active",
    createdDate: new Date().toISOString().split('T')[0],
    category: property.category || "property",
    description: ""
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {property.status && (
          <Badge className="absolute top-2 right-2" variant={property.status === "active" ? "default" : "secondary"}>
            {property.status}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {property.title}
          </CardTitle>
          {isAdmin && (
            <AdminPropertyControls 
              property={adminProperty} 
              onUpdate={() => window.location.reload()} 
              onDelete={() => window.location.reload()} 
            />
          )}
        </div>
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">{property.price}</span>
          <Badge variant="outline">{property.type}</Badge>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1" 
            onClick={handleViewDetails}
            disabled={!user}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDownloadBrochure}
            disabled={!user}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
