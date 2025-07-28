
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Calendar, User, AlertTriangle, Edit, Save, Upload, X } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useNavigate } from "react-router-dom";

const BuilderDashboard = () => {
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProject, setHasProject] = useState(false);
  
  // Mock project data - in real app this would come from API
  const [project, setProject] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    type: "",
    amenities: "",
    images: [] as string[]
  });

  if (!user || user.role !== 'builder') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You need a Builder subscription to access this dashboard.
            </p>
            <Button onClick={() => navigate('/pricing')}>
              View Builder Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddProject = () => {
    if (hasProject) {
      toast({
        title: "Project Limit Reached",
        description: "You can only upload one project with your Builder subscription.",
        variant: "destructive",
      });
      return;
    }
    setIsEditing(true);
  };

  const handleSaveProject = () => {
    if (!project.title || !project.description || !project.location || !project.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setHasProject(true);
    setIsEditing(false);
    toast({
      title: "Project Saved",
      description: "Your project has been successfully saved!",
    });
  };

  const handleEditProject = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoHome}
              className="flex items-center space-x-2"
            >
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">NoNo Broker</span>
            </Button>
            <div className="border-l border-border pl-4">
              <h1 className="text-3xl font-bold mb-2">Builder Dashboard</h1>
              <p className="text-muted-foreground">Manage your property listings and projects</p>
            </div>
          </div>
          <Button onClick={handleGoToProfile} variant="outline" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hasProject ? 1 : 0}</div>
              <p className="text-xs text-muted-foreground">Projects created (max: 1)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hasProject ? 1 : 0}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Remaining</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
              <p className="text-xs text-muted-foreground">Subscription active</p>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Project Section */}
        <div className="mb-8">
          {!hasProject ? (
            <Button onClick={handleAddProject} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Your Project</span>
            </Button>
          ) : !isEditing ? (
            <Button onClick={handleEditProject} variant="outline" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit Project</span>
            </Button>
          ) : null}
        </div>

        {/* Project Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Project</CardTitle>
            <CardDescription>
              {hasProject ? "Manage your property listing" : "Add your property project (1 project limit)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={project.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={project.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter project location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      value={project.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Enter price (e.g., ₹50 Lakh)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Property Type</Label>
                    <Input
                      id="type"
                      value={project.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      placeholder="e.g., Apartment, Villa, Plot"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={project.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="amenities">Amenities</Label>
                  <Textarea
                    id="amenities"
                    value={project.amenities}
                    onChange={(e) => handleInputChange('amenities', e.target.value)}
                    placeholder="List amenities (swimming pool, gym, parking, etc.)"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button onClick={handleSaveProject} className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Project</span>
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" className="flex items-center space-x-2">
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
              </div>
            ) : hasProject ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                    <p className="text-lg font-semibold">{project.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                    <p className="text-lg">{project.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                    <p className="text-lg font-semibold text-primary">{project.price}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <p className="text-lg">{project.type || "Not specified"}</p>
                  </div>
                </div>
                
                {project.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  </div>
                )}
                
                {project.amenities && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amenities</Label>
                    <p className="text-sm text-muted-foreground mt-1">{project.amenities}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <Badge variant="default" className="bg-success">Active</Badge>
                  <Button onClick={handleEditProject} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Project Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your property project to start showcasing your development.
                </p>
                <Button onClick={handleAddProject} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your Project
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuilderDashboard;
