import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Crown, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionService } from "@/services/subscriptionService";

const ProfilePage = () => {
  const { user, updateUserName, changePassword, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">Please login to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscriptionStatus = SubscriptionService.getSubscriptionStatus(user);

  const handleCancelBuilderSubscription = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await SubscriptionService.cancelBuilderSubscription(user, updateUser);
      
      if (result.success) {
        toast({
          title: "Subscription Cancelled",
          description: result.message,
        });
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateUserName(newName.trim());
      
      toast({
        title: "Name Updated",
        description: "Your name has been updated successfully.",
      });
      setIsEditingName(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      });
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanBadgeVariant = (plan?: string) => {
    if (!plan) return "secondary";
    if (plan.toLowerCase() === "premium") return "default";
    if (plan.toLowerCase() === "professional") return "secondary";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and subscription.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <Label htmlFor="name">Name</Label>
                {isEditingName ? (
                  <div className="space-y-2">
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={handleNameUpdate}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditingName(false);
                          setNewName(user.name);
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Input
                      value={user.name}
                      disabled
                      className="bg-muted"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditingName(true)}
                      className="ml-2"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <Button onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                    >
                      {isLoading ? "Changing..." : "Change Password"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Subscription Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Subscription Status */}
                {user.plan && user.plan !== "No Plan" && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant={subscriptionStatus.isActive ? "default" : "destructive"}>
                        {subscriptionStatus.isActive ? "Active" : "Expired"}
                      </Badge>
                      {subscriptionStatus.isActive && (
                        <span className="text-sm text-muted-foreground">
                          {subscriptionStatus.daysRemaining} days left
                        </span>
                      )}
                    </div>
                    {subscriptionStatus.expiryDate && (
                      <div className="text-sm text-muted-foreground">
                        Expires: {subscriptionStatus.expiryDate}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <Badge 
                      variant={getPlanBadgeVariant(user.plan)} 
                      className="text-sm px-3 py-1"
                    >
                      {user.plan || "No Plan"}
                    </Badge>
                    {user.plan && user.plan !== "Builder" && (
                      <div className="text-sm text-muted-foreground">
                        Projects: {user.projectsViewed || 0}/{user.projectsLimit || 0}
                      </div>
                    )}
                    {user.plan === "Builder" && (
                      <div className="text-sm text-muted-foreground">
                        Builder Account - Unlimited Project Posting
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!user.plan && (
                      <Button variant="default" onClick={() => window.location.href = '/pricing'}>
                        Subscribe Now
                      </Button>
                    )}
                    {user.plan && user.plan !== "Builder" && (
                      <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                        Upgrade Plan
                      </Button>
                    )}
                    {user.plan === "Builder" && (
                      <>
                        <Button variant="outline" onClick={() => window.location.href = '/builder-dashboard'}>
                          Manage Projects
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleCancelBuilderSubscription}
                          disabled={isLoading}
                        >
                          {isLoading ? "Cancelling..." : "Cancel Subscription"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {!user.plan && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Subscribe to a plan to access premium property details and builder contacts.
                  </p>
                )}
                {user.plan === "Builder" && (
                  <p className="text-sm text-muted-foreground mt-4">
                    As a builder, you can post unlimited projects and manage your listings.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
