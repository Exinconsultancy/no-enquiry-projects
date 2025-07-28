
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  projects: number;
  features: string[];
  popular?: boolean;
  badge?: string;
}

interface AdminPricingControlsProps {
  plan: PricingPlan;
  onUpdate: (planId: string, updates: Partial<PricingPlan>) => void;
}

const AdminPricingControls = ({ plan, onUpdate }: AdminPricingControlsProps) => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: plan.name,
    price: plan.price,
    originalPrice: plan.originalPrice || "",
    projects: plan.projects,
    badge: plan.badge || ""
  });

  if (!isAdmin) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editForm.name || !editForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates = {
        name: editForm.name,
        price: editForm.price,
        originalPrice: editForm.originalPrice || undefined,
        projects: editForm.projects,
        badge: editForm.badge || undefined
      };

      onUpdate(plan.id, updates);
      setIsEditOpen(false);
      
      toast({
        title: "Success",
        description: "Pricing plan updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pricing plan.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute top-2 right-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pricing Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Plan Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                  placeholder="e.g., $9.99/month"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-original-price">Original Price</Label>
                <Input
                  id="edit-original-price"
                  value={editForm.originalPrice}
                  onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })}
                  placeholder="e.g., $19.99/month"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-projects">Number of Projects</Label>
              <Input
                id="edit-projects"
                type="number"
                value={editForm.projects}
                onChange={(e) => setEditForm({ ...editForm, projects: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-badge">Badge Text</Label>
              <Input
                id="edit-badge"
                value={editForm.badge}
                onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                placeholder="e.g., Best Value"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Update Plan
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPricingControls;
