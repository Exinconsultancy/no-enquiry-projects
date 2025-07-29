import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Edit, X, Image, FileText, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface AdminPropertyMediaControlsProps {
  property: Property;
  onUpdate?: (images: string[]) => void;
}

const AdminPropertyMediaControls = ({ property, onUpdate }: AdminPropertyMediaControlsProps) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { toast } = useToast();
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [images, setImages] = useState<string[]>([
    property.image || "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ]);
  const [brochure, setBrochure] = useState<string | null>(null);

  if (!isAdmin) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${property.id}/images/${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('property-media')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('property-media')
          .getPublicUrl(fileName);

        const newImages = [...images];
        newImages[index] = publicUrl;
        setImages(newImages);
        
        toast({
          title: "Image Updated",
          description: `Image ${index + 1} has been updated successfully.`,
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${property.id}/brochure/${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('property-media')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('property-media')
          .getPublicUrl(fileName);

        setBrochure(publicUrl);
        
        toast({
          title: "Brochure Updated",
          description: "Property brochure has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Error", 
          description: "Failed to upload brochure. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = "/placeholder.svg";
    setImages(newImages);
    
    toast({
      title: "Image Removed",
      description: `Image ${index + 1} has been removed.`,
    });
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    const validImages = images.filter(img => img !== "/placeholder.svg");
    onUpdate?.(validImages.length > 0 ? validImages : [property.image || "/placeholder.svg"]);
    setIsMediaOpen(false);
    
    toast({
      title: "Changes Saved",
      description: "All media changes have been saved successfully.",
    });
  };

  return (
    <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Manage Property Media - {property.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Images Section */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Property Images</Label>
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-2">
                    <div className="relative">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      {image !== "/placeholder.svg" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        className="text-xs"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {index === 0 ? "Main Image" : `Image ${index + 1}`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Brochure Section */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Property Brochure</Label>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-lg">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleBrochureUpload}
                      />
                      {brochure && (
                        <p className="text-sm text-green-600">
                          ✓ New brochure uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={handleSaveChanges} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsMediaOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPropertyMediaControls;