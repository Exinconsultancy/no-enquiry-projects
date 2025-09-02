
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, CheckCircle, Clock, Star, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PricingCard from "@/components/PricingCard";
import AuthModal from "@/components/AuthModal";

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
  const { user, profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isBuilderLoading, setIsBuilderLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  // Check subscription status on component mount and when user changes
  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

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
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Prevent builders and test users from subscribing to regular plans
    if (profile?.role === 'builder') {
      toast({
        title: "Access Restricted",
        description: "Builders can only use the Builder Subscription. Regular plans are for property viewers only.",
        variant: "destructive",
      });
      return;
    }

    if (profile?.role === 'test') {
      toast({
        title: "Test Account",
        description: "Test accounts have full access without subscriptions.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get price amount from plan
      const priceAmount = parseInt(plan.price.replace('₹', '').replace(',', ''));
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId: plan.id,
          planName: plan.name,
          priceAmount: priceAmount
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Please complete your payment in the new tab.",
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBuilderSubscription = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsBuilderLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId: 'builder',
          planName: 'Builder',
          priceAmount: 100000 // ₹1,00,000
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Please complete your payment in the new tab.",
      });
    } catch (error) {
      console.error('Builder subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to process builder subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBuilderLoading(false);
    }
  };

  // Add refresh subscription button
  const handleRefreshSubscription = async () => {
    await checkSubscriptionStatus();
    toast({
      title: "Subscription Status Updated",
      description: "Your subscription status has been refreshed.",
    });
  };

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
        {profile && subscriptionStatus && subscriptionStatus.subscribed && (
          <div className="mb-8 max-w-2xl mx-auto">
            <Card className="border-success bg-success/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <CardTitle className="text-lg">
                      Current Plan: {subscriptionStatus.subscription_tier}
                    </CardTitle>
                  </div>
                  <Badge variant="default" className="bg-success">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Until {subscriptionStatus.subscription_end 
                        ? new Date(subscriptionStatus.subscription_end).toLocaleDateString()
                        : 'No expiry date'
                      }
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshSubscription}
                  >
                    Refresh Status
                  </Button>
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
              onUpdatePlan={profile?.role === 'admin' ? handleUpdatePlan : undefined}
              userPlan={profile?.plan}
              userRole={profile?.role}
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
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            toast({
              title: "Welcome!",
              description: "You can now subscribe to a plan.",
            });
          }}
        />
      </div>
    </div>
  );
};

export default PricingPage;
