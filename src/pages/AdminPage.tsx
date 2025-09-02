
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Building2, Users, Calendar, Settings, Upload, X, Image, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useProperties";
import { useNavigate } from "react-router-dom";
import AdminPropertyControls from "@/components/AdminPropertyControls";
import MaintenanceControls from "@/components/MaintenanceControls";
import AdminUserManagement from "@/components/AdminUserManagement";
import { supabase } from "@/integrations/supabase/client";

const AdminPage = () => {
  const { user, profile } = useAuth();
  const { properties, refetch } = useProperties();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    builder: "",
    description: "",
    category: "property" as "property" | "rental" | "hostel",
    status: "active" as "active" | "pending" | "sold",
    images: [] as string[],
    brochure: "" as string
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login to access the admin panel.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this admin area.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProperty.title || !newProperty.location || !newProperty.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: newProperty.title,
          location: newProperty.location,
          price: newProperty.price,
          type: newProperty.type,
          builder: newProperty.builder,
          description: newProperty.description,
          category: newProperty.category,
          status: newProperty.status,
          images: newProperty.images,
          brochures: newProperty.brochure ? [newProperty.brochure] : []
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property added successfully!",
      });
      
      // Reset form
      setNewProperty({
        title: "",
        location: "",
        price: "",
        type: "Apartment",
        builder: "",
        description: "",
        category: "property",
        status: "active",
        images: [],
        brochure: ""
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: "Failed to add property.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
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
        
        setNewProperty(prev => ({
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
      }
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

        setNewProperty(prev => ({
          ...prev,
          brochure: data.publicUrl
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
      }
    }
  };

  const removeImage = (index: number) => {
    setNewProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const stats = [
    { title: "Total Properties", value: properties.length, icon: Building2 },
    { title: "Active Listings", value: properties.filter(p => p.status === "active").length, icon: Calendar },
    { title: "Total Users", value: "25", icon: Users },
    { title: "Pending Approvals", value: properties.filter(p => p.status === "pending").length, icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage properties, users, and system settings</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Property</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Property Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Property</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProperty} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newProperty.title}
                      onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={newProperty.type} onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Plot">Plot</SelectItem>
                        <SelectItem value="Hostel">Hostel</SelectItem>
                        <SelectItem value="PG">PG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="builder">Builder/Provider</Label>
                    <Input
                      id="builder"
                      value={newProperty.builder}
                      onChange={(e) => setNewProperty({ ...newProperty, builder: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newProperty.category} onValueChange={(value: "property" | "rental" | "hostel") => setNewProperty({ ...newProperty, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="property">Property</SelectItem>
                        <SelectItem value="rental">Rental</SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                {/* Property Images Upload */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Property Images</Label>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full"
                    />
                    
                    {newProperty.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {newProperty.images.map((image, index) => (
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

                {/* Property Brochure Upload */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Property Brochure</Label>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleBrochureUpload}
                          />
                          {newProperty.brochure && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ Brochure uploaded successfully
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Property"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Maintenance Controls */}
        <MaintenanceControls />

        {/* User Management */}
        <div className="mb-8">
          <AdminUserManagement />
        </div>

        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle>All Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <p className="text-sm font-medium text-primary">{property.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">{property.type}</Badge>
                      <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                      <Badge variant="outline">{property.category}</Badge>
                    </div>
                  </div>
                  <AdminPropertyControls 
                    property={property} 
                    onUpdate={() => refetch()}
                    onDelete={() => refetch()}
                  />
                </div>
              ))}
            </div>
            
            {properties.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                <p className="text-muted-foreground">
                  Start by adding your first property to the system.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
