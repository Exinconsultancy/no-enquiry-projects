
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, CreditCard, LogOut, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SubscriptionService } from "@/services/subscriptionService";

const ProfilePage = () => {
  const { user, profile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isBuilderLoading, setIsBuilderLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: profile?.display_name || "",
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

  const handleCancelBuilderSubscription = async () => {
    if (!user) return;

    setIsBuilderLoading(true);
    try {
      // Mock cancellation for now
      toast({
        title: "Subscription Cancelled",
        description: "Builder subscription has been cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel builder subscription",
        variant: "destructive",
      });
    } finally {
      setIsBuilderLoading(false);
    }
  };

  const subscriptionStatus = { isActive: false, daysRemaining: 0 };

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
                <Badge variant={profile?.plan === 'Builder' ? 'default' : 'secondary'}>
                  {profile?.plan || 'No Plan'}
                </Badge>
              </div>
              
              {profile?.projects_limit && (
                <div className="flex items-center justify-between">
                  <span>Projects Viewed:</span>
                  <span>{profile?.projects_viewed || 0} / {profile?.projects_limit}</span>
                </div>
              )}
              
              {subscriptionStatus.isActive && profile?.plan === 'Builder' && (
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
                {profile?.plan ? 'Upgrade Plan' : 'Choose Plan'}
              </Button>

              {/* Cancel Builder Subscription */}
              {profile?.plan === 'Builder' && (
                <div className="mt-4 pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        disabled={isBuilderLoading}
                        className="w-full text-destructive hover:text-destructive"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Cancel Builder Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Cancel Builder Subscription
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>Are you sure you want to cancel your Builder subscription?</p>
                          <div className="bg-destructive/10 p-3 rounded-lg">
                            <p className="text-sm font-medium text-destructive">This action will:</p>
                            <ul className="text-sm text-destructive mt-1 space-y-1">
                              <li>• Remove unlimited project access</li>
                              <li>• Remove priority listing benefits</li>
                              <li>• Remove dedicated account manager access</li>
                              <li>• Remove custom branding options</li>
                              <li>• Reset your plan to "No Plan"</li>
                            </ul>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            You can resubscribe anytime, but you'll need to purchase a new Builder subscription.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleCancelBuilderSubscription}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Yes, Cancel Subscription
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
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
                <p className="text-sm">{profile?.role || user?.role}</p>
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
