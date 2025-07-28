
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import ConfirmationDialog from "./ConfirmationDialog";

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

interface AdminPropertyControlsProps {
  property: Property;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const AdminPropertyControls = ({ property, onUpdate, onDelete }: AdminPropertyControlsProps) => {
  const { isAdmin, user } = useAuth();
  const { updateProperty, deleteProperty } = useAdmin();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: property.title,
    location: property.location,
    price: property.price,
    type: property.type,
    builder: property.builder,
    description: property.description || "",
    status: property.status
  });

  console.log("AdminPropertyControls - Current user:", user);
  console.log("AdminPropertyControls - isAdmin:", isAdmin);
  console.log("AdminPropertyControls - Property:", property.id);

  if (!isAdmin) {
    console.log("AdminPropertyControls - User is not admin, hiding controls");
    return null;
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AdminPropertyControls - Updating property:", property.id, "with data:", editForm);
    
    if (!editForm.title || !editForm.location || !editForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      updateProperty(property.id, editForm);
      setIsEditOpen(false);
      onUpdate?.();
      
      toast({
        title: "Success",
        description: "Property updated successfully!",
      });
    } catch (error) {
      console.error("AdminPropertyControls - Error updating property:", error);
      toast({
        title: "Error",
        description: "Failed to update property.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    console.log("AdminPropertyControls - Deleting property:", property.id);
    try {
      deleteProperty(property.id);
      onDelete?.();
      
      toast({
        title: "Success",
        description: "Property deleted successfully!",
      });
    } catch (error) {
      console.error("AdminPropertyControls - Error deleting property:", error);
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

  console.log("AdminPropertyControls - Rendering controls for property:", property.id);

  return (
    <div className="flex space-x-2 opacity-100 z-10" onClick={(e) => e.stopPropagation()}>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white hover:bg-gray-100">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
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
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Update Property
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
