
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, CreditCard, LogOut } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useNavigate } from "react-router-dom";
import { SubscriptionService } from "@/services/subscriptionService";

const ProfilePage = () => {
  const { user, logout } = useSecureAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your profile.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const subscriptionStatus = SubscriptionService.getSubscriptionStatus(user);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Current Plan:</span>
                <Badge variant={user.plan === 'Builder' ? 'default' : 'secondary'}>
                  {user.plan || 'No Plan'}
                </Badge>
              </div>
              
              {user.projectsLimit && (
                <div className="flex items-center justify-between">
                  <span>Projects Viewed:</span>
                  <span>{user.projectsViewed || 0} / {user.projectsLimit}</span>
                </div>
              )}
              
              {subscriptionStatus.isActive && (
                <div className="flex items-center justify-between">
                  <span>Days Remaining:</span>
                  <span>{subscriptionStatus.daysRemaining}</span>
                </div>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/pricing')}
                className="w-full"
              >
                {user.plan ? 'Upgrade Plan' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                <p className="text-sm">{user.role}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                <p className="text-sm">Recently joined</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
