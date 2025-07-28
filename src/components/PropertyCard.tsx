
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Home, Bath, Maximize, Download, Eye, Heart, Crown, Check } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
    category: "property" | "rental" | "hostel";
    status: "active" | "pending" | "sold";
    builder: string;
    createdDate: string;
  };
  onViewDetails: (property: any) => void;
  onDownloadBrochure: (property: any) => void;
  user: any;
}

const PropertyCard = ({ property, onViewDetails, onDownloadBrochure, user }: PropertyCardProps) => {
  const { isAdmin } = useSecureAuth();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);

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

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user || !user.plan) {
      setShowSubscriptionDialog(true);
      return;
    }
    
    onViewDetails(property);
  };

  const handleDownloadBrochure = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user || !user.plan) {
      setShowSubscriptionDialog(true);
      return;
    }
    
    onDownloadBrochure(property);
  };

  const handleSubscribeNow = () => {
    setShowSubscriptionDialog(false);
    navigate('/pricing');
  };

  const SubscriptionDialog = () => (
    <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Premium Access Required
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Unlock premium features to access detailed property information and download brochures.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">View detailed property information</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Download property brochures</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Access builder contact information</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Schedule property visits</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowSubscriptionDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubscribeNow}
              className="flex-1"
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
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
              onClick={handleViewDetails}
              className="flex-1"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadBrochure}
              className="flex-1"
            >
              <Download className="h-3 w-3 mr-1" />
              Brochure
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <SubscriptionDialog />
    </>
  );
};

export default PropertyCard;
