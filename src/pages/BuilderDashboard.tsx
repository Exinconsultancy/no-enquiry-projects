
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionService } from "@/services/subscriptionService";
import { Building, Plus, Upload, Calendar, AlertTriangle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  location: string;
  price: string;
  type: "apartment" | "villa" | "commercial";
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  amenities: string[];
  images: string[];
  brochure?: string;
  status: "active" | "pending" | "sold";
  createdAt: string;
}

const BuilderDashboard = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isActive: boolean;
    daysRemaining: number;
    expiryDate: string | null;
  }>({ isActive: false, daysRemaining: 0, expiryDate: null });

  const [newProject, setNewProject] = useState({
    title: "",
    location: "",
    price: "",
    type: "apartment" as const,
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    description: "",
    amenities: "",
    brochure: null as File | null
  });

  useEffect(() => {
    if (user) {
      const status = SubscriptionService.getSubscriptionStatus(user);
      setSubscriptionStatus(status);
      
      // Auto-cancel expired subscriptions
      if (user.plan === 'Builder' && !status.isActive) {
        updateUser({
          plan: 'No Plan',
          projectsLimit: 0,
          subscriptionExpiry: undefined
        });
      }
    }
  }, [user, updateUser]);

  const handleAddProject = async () => {
    if (!user || user.plan !== 'Builder') {
      toast({
        title: "Access Denied",
        description: "You need an active Builder subscription to add projects.",
        variant: "destructive",
      });
      return;
    }

    if (!subscriptionStatus.isActive) {
      toast({
        title: "Subscription Expired",
        description: "Your Builder subscription has expired. Please renew to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const project: Project = {
        id: Date.now().toString(),
        ...newProject,
        amenities: newProject.amenities.split(',').map(a => a.trim()),
        images: ["/src/assets/property-1.jpg"],
        brochure: newProject.brochure ? `brochure_${Date.now()}.pdf` : undefined,
        status: "active",
        createdAt: new Date().toISOString()
      };

      setProjects([...projects, project]);
      setNewProject({
        title: "",
        location: "",
        price: "",
        type: "apartment",
        bedrooms: 1,
        bathrooms: 1,
        area: "",
        description: "",
        amenities: "",
        brochure: null
      });
      setShowAddProject(false);

      toast({
        title: "Project Added Successfully!",
        description: "Your property has been listed and is now live.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    try {
      const result = await SubscriptionService.cancelBuilderSubscription(user, updateUser);
      
      if (result.success) {
        toast({
          title: "Subscription Cancelled",
          description: result.message,
        });
        navigate('/');
      } else {
        toast({
          title: "Cancellation Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user || user.plan !== 'Builder') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Builder Access Required</h2>
            <p className="text-muted-foreground mb-4">
              You need an active Builder subscription to access this dashboard.
            </p>
            <Button onClick={() => navigate('/pricing')}>
              Get Builder Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span className="font-bold text-lg">NoBroker</span>
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-2xl font-bold">Builder Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Subscription Status</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={subscriptionStatus.isActive ? "default" : "destructive"}>
                    {subscriptionStatus.isActive ? "Active" : "Expired"}
                  </Badge>
                  {subscriptionStatus.isActive && (
                    <span className="text-sm text-muted-foreground">
                      {subscriptionStatus.daysRemaining} days left
                    </span>
                  )}
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Builder Subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your Builder subscription? This will:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Remove access to the Builder Dashboard</li>
                        <li>Hide all your active property listings</li>
                        <li>Cancel all pending inquiries</li>
                        <li>This action cannot be undone</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Subscription Warning */}
        {subscriptionStatus.isActive && subscriptionStatus.daysRemaining <= 7 && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Subscription Expiring Soon</p>
                  <p className="text-sm text-yellow-700">
                    Your Builder subscription expires in {subscriptionStatus.daysRemaining} days on {subscriptionStatus.expiryDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
                </div>
                <Calendar className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p className="text-2xl font-bold">{subscriptionStatus.daysRemaining}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Project Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowAddProject(true)}
            disabled={!subscriptionStatus.isActive}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        </div>

        {/* Add Project Form */}
        {showAddProject && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newProject.location}
                    onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={newProject.price}
                    onChange={(e) => setNewProject({...newProject, price: e.target.value})}
                    placeholder="₹1.5 Cr"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <Select value={newProject.type} onValueChange={(value: any) => setNewProject({...newProject, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={newProject.area}
                    onChange={(e) => setNewProject({...newProject, area: e.target.value})}
                    placeholder="2500 sq ft"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={newProject.bedrooms}
                    onChange={(e) => setNewProject({...newProject, bedrooms: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={newProject.bathrooms}
                    onChange={(e) => setNewProject({...newProject, bathrooms: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="amenities">Amenities (comma separated)</Label>
                <Input
                  id="amenities"
                  value={newProject.amenities}
                  onChange={(e) => setNewProject({...newProject, amenities: e.target.value})}
                  placeholder="Swimming Pool, Gym, Parking, Security"
                />
              </div>

              <div>
                <Label htmlFor="brochure">Project Brochure (PDF)</Label>
                <Input
                  id="brochure"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setNewProject({...newProject, brochure: e.target.files?.[0] || null})}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a PDF brochure for your project (optional)
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddProject}
                  disabled={isUploading || !newProject.title || !newProject.location}
                >
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowAddProject(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          
          {projects.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground">
                  Start by adding your first project to showcase your properties.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      variant={project.status === 'active' ? 'default' : 'secondary'}
                      className="absolute top-3 right-3"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{project.location}</p>
                    <p className="text-xl font-bold text-primary mb-2">{project.price}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{project.bedrooms} bed</span>
                      <span>{project.bathrooms} bath</span>
                      <span>{project.area}</span>
                    </div>
                    {project.brochure && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Brochure Available
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderDashboard;
