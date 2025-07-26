
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Download, Lock, Phone, Mail } from "lucide-react";
import { useState } from "react";

interface Property {
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
  isLocked?: boolean;
  builderContact?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onDownloadBrochure: (property: Property) => void;
  user?: { plan?: string; projectsViewed?: number; projectsLimit?: number } | null;
}

const PropertyCard = ({ property, onViewDetails, onDownloadBrochure, user }: PropertyCardProps) => {
  const [showContactDetails, setShowContactDetails] = useState(false);
  
  const hasSubscription = user && user.plan;
  const hasReachedLimit = user?.projectsViewed && user?.projectsLimit && user.projectsViewed >= user.projectsLimit;
  const canViewDetails = hasSubscription && !hasReachedLimit;
  const canDownloadBrochure = hasSubscription;

  const handleViewDetails = () => {
    if (canViewDetails) {
      setShowContactDetails(true);
      onViewDetails(property);
    } else {
      onViewDetails(property);
    }
  };

  return (
    <Card className="group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
        >
          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
        </Badge>
        {!hasSubscription && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Subscription Required</p>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
        
        {/* Show contact details for subscribed users who clicked view details */}
        {canViewDetails && showContactDetails && property.builderContact && (
          <div className="mb-3 p-3 bg-accent/20 rounded-lg border">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Builder Contact</h4>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Phone className="h-3 w-3 mr-2" />
                <span>{property.builderContact.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-3 w-3 mr-2" />
                <span>{property.builderContact.email}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Contact: {property.builderContact.name}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="text-2xl font-bold text-primary mb-3">{property.price}</div>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleViewDetails}
          disabled={!canViewDetails}
          variant={canViewDetails ? "default" : "outline"}
        >
          {!user ? "Login to View Details" : 
           !hasSubscription ? "Subscribe to View Details" :
           hasReachedLimit ? "Upgrade Plan" :
           showContactDetails ? "Contact Details Shown" :
           "View Details"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onDownloadBrochure(property)}
          disabled={!canDownloadBrochure}
        >
          <Download className="h-4 w-4 mr-2" />
          {canDownloadBrochure ? "Download Brochure" : "Subscribe to Download"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
