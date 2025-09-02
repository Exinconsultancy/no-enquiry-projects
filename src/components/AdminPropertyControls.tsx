import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Upload, X, Image as ImageIcon, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ConfirmationDialog from "./ConfirmationDialog";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import type { Property } from "@/hooks/useProperties";


interface AdminPropertyControlsProps {
  property: Property;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const AdminPropertyControls = ({ property, onUpdate, onDelete }: AdminPropertyControlsProps) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: property.title,
    location: property.location,
    price: property.price,
    type: property.type,
    builder: property.builder,
    description: property.description || "",
    status: property.status,
    images: property.images || [],
    brochures: property.brochures || [],
    amenities: property.amenities ? property.amenities.join(', ') : "",
    bedrooms: property.bedrooms || "2-3 BHK",
    bathrooms: property.bathrooms || "2-3 Bath",
    area: property.area || "1200-1800 sq ft"
  });

  if (!isAdmin) {
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editForm.title || !editForm.location || !editForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: editForm.title,
          location: editForm.location,
          price: editForm.price,
          type: editForm.type,
          builder: editForm.builder,
          description: editForm.description,
          status: editForm.status,
          images: editForm.images,
          brochures: editForm.brochures,
          amenities: editForm.amenities.split(',').map(a => a.trim()).filter(a => a),
          bedrooms: editForm.bedrooms,
          bathrooms: editForm.bathrooms,
          area: editForm.area
        })
        .eq('id', property.id);

      if (error) {
        throw error;
      }

      setIsEditOpen(false);
      onUpdate?.();
      
      toast({
        title: "Success",
        description: "Property updated successfully!",
      });
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsUploading(true);
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `property-images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('property-media')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('property-media')
            .getPublicUrl(filePath);

          return data.publicUrl;
        });

        const imageUrls = await Promise.all(uploadPromises);
        
        setEditForm(prev => ({
          ...prev,
          images: [...prev.images, ...imageUrls]
        }));
        
        toast({
          title: "Images Uploaded",
          description: `${files.length} image(s) uploaded successfully.`,
        });
      } catch (error) {
        console.error('Error uploading images:', error);
        toast({
          title: "Upload Error",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `property-brochures/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('property-media')
          .getPublicUrl(filePath);

        setEditForm(prev => ({
          ...prev,
          brochures: [...prev.brochures, data.publicUrl]
        }));
        
        toast({
          title: "Brochure Uploaded",
          description: "Property brochure uploaded successfully.",
        });
      } catch (error) {
        console.error('Error uploading brochure:', error);
        toast({
          title: "Upload Error",
          description: "Failed to upload brochure. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeBrochure = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      brochures: prev.brochures.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) {
        throw error;
      }

      onDelete?.();
      
      toast({
        title: "Success",
        description: "Property deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property.",
        variant: "destructive",
      });
    }
  };

  const getTypeOptions = () => {
    switch (property.category) {
      case "property":
        return ["Apartment", "Villa", "Commercial", "Plot"];
      case "rental":
        return ["Apartment", "Villa", "House", "Room"];
      case "hostel":
        return ["Hostel", "PG", "Dormitory", "Shared Room"];
      default:
        return ["Apartment", "Villa", "House"];
    }
  };

  return (
    <div className="flex space-x-2 opacity-100 z-10" onClick={(e) => e.stopPropagation()}>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white hover:bg-gray-100">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={editForm.type} onValueChange={(value) => setEditForm({ ...editForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTypeOptions().map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                <Input
                  id="edit-bedrooms"
                  value={editForm.bedrooms}
                  onChange={(e) => setEditForm({ ...editForm, bedrooms: e.target.value })}
                  placeholder="2-3 BHK"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                <Input
                  id="edit-bathrooms"
                  value={editForm.bathrooms}
                  onChange={(e) => setEditForm({ ...editForm, bathrooms: e.target.value })}
                  placeholder="2-3 Bath"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-area">Area</Label>
                <Input
                  id="edit-area"
                  value={editForm.area}
                  onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                  placeholder="1200-1800 sq ft"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-builder">Builder/Provider</Label>
              <Input
                id="edit-builder"
                value={editForm.builder}
                onChange={(e) => setEditForm({ ...editForm, builder: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editForm.status} onValueChange={(value: "active" | "pending" | "sold") => setEditForm({ ...editForm, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-amenities">Amenities</Label>
              <Textarea
                id="edit-amenities"
                value={editForm.amenities}
                onChange={(e) => setEditForm({ ...editForm, amenities: e.target.value })}
                rows={3}
                placeholder="Swimming Pool, Gymnasium, Security, Parking, Garden (comma separated)"
              />
              <p className="text-sm text-muted-foreground">
                Enter amenities separated by commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Property Images Management */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Property Images</Label>
              <div className="space-y-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full"
                />
                
                {editForm.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {editForm.images.map((image, index) => (
                      <Card key={index} className="relative">
                        <CardContent className="p-2">
                          <img
                            src={image}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Property Brochures Management */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Property Brochures</Label>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleBrochureUpload}
                  disabled={isUploading}
                  className="w-full"
                />
                
                {editForm.brochures.length > 0 && (
                  <div className="space-y-2">
                    {editForm.brochures.map((brochure, index) => (
                      <Card key={index} className="relative">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm">Brochure {index + 1}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-6 w-6 p-0"
                              onClick={() => removeBrochure(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Update Property"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        trigger={
          <Button size="sm" variant="destructive" className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        }
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
};

export default AdminPropertyControls;
