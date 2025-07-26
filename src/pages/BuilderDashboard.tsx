
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building, Plus, Edit, Trash2, Eye, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Project {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: "apartment" | "villa" | "commercial";
  description: string;
  amenities: string[];
  status: "active" | "inactive";
  views: number;
  inquiries: number;
  createdAt: string;
}

const BuilderDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Luxury Residences at Marina Bay",
      location: "Mumbai, Maharashtra",
      price: "₹2.5 Cr onwards",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,450 sq ft",
      type: "apartment",
      description: "Premium residential complex with modern amenities",
      amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Garden"],
      status: "active",
      views: 245,
      inquiries: 12,
      createdAt: "2024-01-15"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    type: "apartment" as "apartment" | "villa" | "commercial",
    description: "",
    amenities: ""
  });

  if (!user || user.plan !== 'Builder') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Builder Access Required</h2>
            <p className="text-muted-foreground">You need a builder subscription to access this dashboard.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/pricing'}>
              Get Builder Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmitProject = async () => {
    if (!formData.title || !formData.location || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title,
      location: formData.location,
      price: formData.price,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      area: formData.area,
      type: formData.type,
      description: formData.description,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      status: "active",
      views: 0,
      inquiries: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...newProject, id: editingProject.id } : p));
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully.",
      });
    } else {
      setProjects(prev => [...prev, newProject]);
      toast({
        title: "Project Added",
        description: "Your project has been posted successfully.",
      });
    }

    setFormData({
      title: "",
      location: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      type: "apartment",
      description: "",
      amenities: ""
    });
    setShowAddForm(false);
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setFormData({
      title: project.title,
      location: project.location,
      price: project.price,
      bedrooms: project.bedrooms.toString(),
      bathrooms: project.bathrooms.toString(),
      area: project.area,
      type: project.type,
      description: project.description,
      amenities: project.amenities.join(', ')
    });
    setEditingProject(project);
    setShowAddForm(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Project Deleted",
      description: "Project has been removed successfully.",
    });
  };

  const toggleProjectStatus = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ));
    toast({
      title: "Status Updated",
      description: "Project status has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Building className="h-8 w-8 mr-3" />
            Builder Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your property listings and track performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.views, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                  <p className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.inquiries, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Project Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        </div>

        {/* Add/Edit Project Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Project Title*</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location*</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price*</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="₹2.5 Cr onwards"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                    placeholder="2"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="1,450 sq ft"
                  />
                </div>
                <div>
                  <Label htmlFor="amenities">Amenities (comma separated)</Label>
                  <Input
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
                    placeholder="Swimming Pool, Gym, Parking"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSubmitProject}>
                  {editingProject ? 'Update Project' : 'Add Project'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowAddForm(false);
                  setEditingProject(null);
                  setFormData({
                    title: "",
                    location: "",
                    price: "",
                    bedrooms: "",
                    bathrooms: "",
                    area: "",
                    type: "apartment",
                    description: "",
                    amenities: ""
                  });
                }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-2">{project.location}</p>
                    <p className="text-lg font-semibold text-primary">{project.price}</p>
                  </div>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{project.views}</p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{project.inquiries}</p>
                    <p className="text-sm text-muted-foreground">Inquiries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{project.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{project.area}</p>
                    <p className="text-sm text-muted-foreground">Area</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.amenities.slice(0, 5).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleProjectStatus(project.id)}>
                    {project.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuilderDashboard;
