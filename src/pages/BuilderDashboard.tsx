import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Calendar, User, AlertTriangle, Edit, Save, Upload, X, Eye, Trash2, FileText } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useBuilder } from "@/contexts/BuilderContext";
import { useNavigate } from "react-router-dom";

const BuilderDashboard = () => {
  const { user } = useSecureAuth();
  const { getUserProjects, addProject, updateProject, deleteProject, publishProject } = useBuilder();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  // Form state for new/edited project
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    type: "",
    amenities: "",
    images: [] as string[],
    brochure: ""
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

  const userProjects = getUserProjects(user.email);
  const canAddProject = userProjects.length === 0; // Only one project allowed

  const handleSubmitProject = async () => {
    if (!projectForm.title || !projectForm.location || !projectForm.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (editingProjectId) {
        updateProject(editingProjectId, projectForm);
        toast({
          title: "Project Updated",
          description: "Your project has been updated successfully.",
        });
      } else {
        addProject({
          ...projectForm,
          builderEmail: user.email
        });
      }
      
      // Reset form
      setProjectForm({
        title: "",
        description: "",
        location: "",
        price: "",
        type: "",
        amenities: "",
        images: [],
        brochure: ""
      });
      setIsEditing(false);
      setEditingProjectId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (project: any) => {
    setProjectForm({
      title: project.title,
      description: project.description,
      location: project.location,
      price: project.price,
      type: project.type,
      amenities: project.amenities,
      images: project.images,
      brochure: project.brochure || ""
    });
    setEditingProjectId(project.id);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProjectForm({
      title: "",
      description: "",
      location: "",
      price: "",
      type: "",
      amenities: "",
      images: [],
      brochure: ""
    });
    setIsEditing(false);
    setEditingProjectId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you'd upload to cloud storage
      // For now, we'll just use file names as placeholders
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setProjectForm(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
      
      toast({
        title: "Images Added",
        description: `${files.length} image(s) added to project.`,
      });
    }
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to cloud storage
      const brochureUrl = URL.createObjectURL(file);
      setProjectForm(prev => ({
        ...prev,
        brochure: brochureUrl
      }));
      
      toast({
        title: "Brochure Uploaded",
        description: "Project brochure has been uploaded successfully.",
      });
    }
  };

  const removeImage = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handlePublishProject = (projectId: string) => {
    publishProject(projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Builder Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name || user.email}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Projects</span>
                </div>
                <p className="text-2xl font-bold mt-2">{userProjects.length}/1</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Published</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {userProjects.filter(p => p.status === 'published').length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Plan Status</span>
                </div>
                <Badge variant="secondary" className="mt-2">Builder Active</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add New Project Button */}
        {canAddProject && !isEditing && (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create Your Project</h3>
              <p className="text-muted-foreground mb-4">
                You can create and manage one project with your builder subscription.
              </p>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Project Form */}
        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingProjectId ? "Edit Project" : "Create New Project"}
              </CardTitle>
              <CardDescription>
                Fill in the details for your property project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={projectForm.price}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="₹1.5 Cr"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <Input
                    id="type"
                    value={projectForm.type}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="Apartment, Villa, etc."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="amenities">Amenities</Label>
                <Textarea
                  id="amenities"
                  value={projectForm.amenities}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, amenities: e.target.value }))}
                  placeholder="Swimming pool, gym, parking, etc."
                  rows={2}
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <Label>Project Images</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4"
                  />
                  {projectForm.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {projectForm.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Project ${index + 1}`}
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Brochure Upload */}
              <div>
                <Label>Project Brochure</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleBrochureUpload}
                    className="mb-2"
                  />
                  {projectForm.brochure && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Brochure uploaded</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleSubmitProject}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : editingProjectId ? "Update Project" : "Save Project"}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Projects */}
        {userProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
            <div className="grid gap-6">
              {userProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.location}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold">{project.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-semibold">{project.type}</p>
                      </div>
                    </div>
                    
                    {project.description && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm">{project.description}</p>
                      </div>
                    )}
                    
                    {project.images.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Images ({project.images.length})</p>
                        <div className="grid grid-cols-4 gap-2">
                          {project.images.slice(0, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Project ${index + 1}`}
                              className="w-full h-16 object-cover rounded-md"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      
                      {project.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => handlePublishProject(project.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Publish to Properties
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!canAddProject && userProjects.length === 0 && !isEditing && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">
                You haven't created any projects yet. Start by creating your first project.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BuilderDashboard;
