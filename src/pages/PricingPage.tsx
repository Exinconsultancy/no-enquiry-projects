
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, CheckCircle, Clock, Star, AlertTriangle } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionService } from "@/services/subscriptionService";
import PricingCard from "@/components/PricingCard";

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

const PricingPage = () => {
  const { user, isAdmin, updateUser } = useSecureAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isBuilderLoading, setIsBuilderLoading] = useState(false);

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
    {
      id: "starter",
      name: "Starter",
      price: "₹299",
      originalPrice: "₹499",
      projects: 5,
      features: [
        "Access to 5 projects",
        "Basic property details",
        "Email support",
        "Valid for 7 days from purchase"
      ],
      badge: "Save 40%"
    },
    {
      id: "professional",
      name: "Professional",
      price: "₹499",
      originalPrice: "₹899",
      projects: 10,
      features: [
        "Access to 10 projects",
        "Detailed property information",
        "Priority support",
        "Download brochures",
        "Valid for 15 days from purchase"
      ],
      popular: true,
      badge: "Best Value"
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹799",
      originalPrice: "₹1299",
      projects: 15,
      features: [
        "Access to 15 projects",
        "Premium property details",
        "24/7 support",
        "Download all brochures",
        "Schedule property visits",
        "Valid for 30 days from purchase"
      ],
      badge: "Most Popular"
    }
  ]);

  const handleUpdatePlan = (planId: string, updates: Partial<PricingPlan>) => {
    setPricingPlans(prev => 
      prev.map(plan => 
        plan.id === planId ? { ...plan, ...updates } : plan
      )
    );
    
    toast({
      title: "Success",
      description: "Pricing plan updated successfully!",
    });
  };

  const handlePlanSelect = async (plan: PricingPlan) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    // Prevent builders from subscribing to regular plans
    if (user.role === 'builder') {
      toast({
        title: "Access Restricted",
        description: "Builders can only use the Builder Subscription. Regular plans are for property viewers only.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await SubscriptionService.subscribeToPlan(
        plan.id, 
        user, 
        updateUser
      );
      
      if (result.success) {
        toast({
          title: "Subscription Successful!",
          description: result.message,
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBuilderSubscription = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login for builder subscription",
        variant: "destructive",
      });
      return;
    }

    setIsBuilderLoading(true);
    
    try {
      const result = await SubscriptionService.handleBuilderSubscription(user.email, updateUser);
      
      if (result.success) {
        // Update user role to builder
        updateUser({ role: 'builder' });
        
        toast({
          title: "Builder Subscription Activated!",
          description: result.message,
        });
        
        // Redirect to builder dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/builder-dashboard';
        }, 2000);
      } else {
        toast({
          title: "Subscription Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process builder subscription",
        variant: "destructive",
      });
    } finally {
      setIsBuilderLoading(false);
    }
  };

  const handleCancelBuilderSubscription = async () => {
    if (!user) return;

    setIsBuilderLoading(true);
    try {
      const result = await SubscriptionService.cancelBuilderSubscription(user, updateUser);
      
      if (result.success) {
        toast({
          title: "Subscription Cancelled",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
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

  // Mock subscription status for now
  const subscriptionStatus = user ? {
    isActive: true,
    daysRemaining: 30,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
  } : null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your property search needs
          </p>
        </div>

        {/* Current Subscription Status */}
        {user && user.plan && (
          <div className="mb-8 max-w-2xl mx-auto">
            <Card className="border-success bg-success/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <CardTitle className="text-lg">Current Plan: {user.plan}</CardTitle>
                  </div>
                  {subscriptionStatus?.isActive && (
                    <Badge variant="default" className="bg-success">
                      Active
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {user.plan === 'Builder' && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {subscriptionStatus?.isActive 
                          ? `${subscriptionStatus.daysRemaining} days left`
                          : 'Expired'
                        }
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{user.projectsViewed || 0} of {user.projectsLimit || 0} projects viewed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {subscriptionStatus?.expiryDate 
                        ? `Until ${subscriptionStatus.expiryDate}`
                        : 'No expiry date'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={handlePlanSelect}
              onUpdatePlan={isAdmin ? handleUpdatePlan : undefined}
              userPlan={user?.plan}
              userRole={user?.role}
            />
          ))}
        </div>

        {/* Builder Subscription Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Builder Subscription</CardTitle>
              <CardDescription className="text-center text-lg">
                Special plan for property builders and developers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Builder Benefits</h3>
                  <ul className="space-y-3">
                    {[
                      "Unlimited project access",
                      "Priority listing for your projects",
                      "Dedicated account manager",
                      "Advanced analytics and insights",
                      "Custom branding options",
                      "30-day validity"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">₹1,00,000/month</div>
                    <div className="text-muted-foreground">Premium builder subscription</div>
                  </div>
                  
                  <Button
                    onClick={handleBuilderSubscription}
                    disabled={isBuilderLoading}
                    className="w-full"
                    variant="default"
                  >
                    {isBuilderLoading ? "Processing..." : "Subscribe Now"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
