
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Bath, Maximize, Download, Eye, Heart } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";
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
    category: string;
    status: string;
    builder: string;
  };
  onViewDetails: (property: any) => void;
  onDownloadBrochure: (property: any) => void;
  user: any;
}

const PropertyCard = ({ property, onViewDetails, onDownloadBrochure, user }: PropertyCardProps) => {
  const { isAdmin } = useSecureAuth();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  const isFavorite = favorites.includes(property.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/${property.category}/${property.id}`);
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteToggle();
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <AdminPropertyControls property={property} />
          </div>
        )}
      </div>

      <CardHeader className="pb-2" onClick={handleCardClick}>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{property.title}</CardTitle>
          <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
            {property.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{property.location}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0" onClick={handleCardClick}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold text-primary">{property.price}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <Home className="h-3 w-3" />
            <span>{property.bedrooms} BHK</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-3 w-3" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center space-x-1">
            <Maximize className="h-3 w-3" />
            <span>{property.area}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(property);
            }}
            className="flex-1"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadBrochure(property);
            }}
            className="flex-1"
          >
            <Download className="h-3 w-3 mr-1" />
            Brochure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
