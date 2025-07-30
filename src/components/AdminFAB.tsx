
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminFABProps {
  category: "property" | "rental" | "hostel";
}

const AdminFAB = ({ category }: AdminFABProps) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    type: getDefaultType(category),
    builder: "",
    description: "",
    status: "active" as "active" | "pending" | "sold"
  });

  function getDefaultType(category: string) {
    switch (category) {
      case "property":
        return "Apartment";
      case "rental":
        return "Apartment";
      case "hostel":
        return "Hostel";
      default:
        return "Apartment";
    }
  }

  function getTypeOptions(category: string) {
    switch (category) {
      case "property":
        return ["Apartment", "Villa", "Commercial", "Plot"];
      case "rental":
        return ["Apartment", "Villa", "House", "Room"];
      case "hostel":
        return ["Hostel", "PG", "Dormitory", "Shared Room"];
      default:
        return ["Apartment", "Villa", "House"];
    }
  }

  if (!isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.price) {
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
        .insert([{
          title: formData.title,
          location: formData.location,
          price: formData.price,
          type: formData.type,
          builder: formData.builder,
          description: formData.description,
          status: formData.status,
          category: category,
          amenities: [],
          images: [],
          brochures: [],
          bedrooms: category === 'hostel' ? '1' : '2-3 BHK',
          bathrooms: category === 'hostel' ? '1' : '2-3 Bath',
          area: category === 'hostel' ? '100-200 sq ft' : '1200-1800 sq ft'
        }]);

      if (error) {
        throw error;
      }
      
      setFormData({
        title: "",
        location: "",
        price: "",
        type: getDefaultType(category),
        builder: "",
        description: "",
        status: "active"
      });
      setIsOpen(false);
      
      toast({
        title: "Success",
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} added successfully!`,
      });
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: `Failed to add ${category}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="sm"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New {category.charAt(0).toUpperCase() + category.slice(1)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {getTypeOptions(category).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="builder">Builder/Provider</Label>
            <Input
              id="builder"
              value={formData.builder}
              onChange={(e) => setFormData({ ...formData, builder: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Add {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminFAB;
