
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Calendar, User, AlertTriangle } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useNavigate } from "react-router-dom";

const BuilderDashboard = () => {
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user.plan !== 'Builder') {
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
    toast({
      title: "Add Project",
      description: "Project creation feature coming soon!",
    });
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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Projects created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
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

        {/* Add Project Button */}
        <div className="mb-8">
          <Button onClick={handleAddProject} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Project</span>
          </Button>
        </div>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>
              Manage and track your property listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first project to showcase your properties.
              </p>
              <Button onClick={handleAddProject} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuilderDashboard;
