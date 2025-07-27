
import { useState } from "react";
import PricingCard from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Crown, Building, Star, Phone, Mail } from "lucide-react";
import { SubscriptionService } from "@/services/subscriptionService";
import { useAuth } from "@/contexts/AuthContext";

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

interface PricingPageProps {
  onLogin: () => void;
}

const PricingPage = ({ onLogin }: PricingPageProps) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pricingPlans: PricingPlan[] = [
    {
      id: "starter",
      name: "Starter",
      price: "₹299",
      projects: 5,
      features: [
        "Access to 5 premium properties",
        "Basic property details",
        "Download brochures",
        "Email support",
        "7-day validity"
      ]
    },
    {
      id: "professional",
      name: "Professional",
      price: "₹599",
      originalPrice: "₹799",
      projects: 10,
      popular: true,
      badge: "Best Value",
      features: [
        "Access to 10 premium properties",
        "Detailed property information",
        "Builder contact details",
        "Download brochures",
        "Priority email support",
        "15-day validity",
        "Property comparison tool"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹999",
      originalPrice: "₹1,299",
      projects: 15,
      badge: "Most Popular",
      features: [
        "Access to 15 premium properties",
        "Complete property details",
        "Direct builder contacts",
        "Download brochures",
        "Phone & email support",
        "30-day validity",
        "Property comparison tool",
        "Market insights",
        "Virtual property tours"
      ]
    }
  ];

  const builderPlan = {
    name: "Builder Subscription",
    price: "₹1,00,000",
    duration: "per month",
    features: [
      "Post unlimited property ads",
      "Premium listing placement",
      "Builder profile page",
      "Lead management dashboard",
      "Analytics and insights",
      "Dedicated account manager",
      "Marketing support",
      "Mobile app access"
    ]
  };

  const handlePlanSelect = async (plan: PricingPlan) => {
    if (!user) {
      onLogin();
      return;
    }

    setSelectedPlan(plan);
    setIsProcessing(true);

    try {
      const result = await SubscriptionService.subscribeToPlan(plan.id, user, updateUser);
      
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
        title: "Subscription Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleBuilderSubscription = async () => {
    if (!user) {
      onLogin();
      return;
    }

    setIsProcessing(true);

    try {
      const result = await SubscriptionService.handleBuilderSubscription(user.email, updateUser);
      
      if (result.success) {
        toast({
          title: "Builder Subscription Activated!",
          description: result.message,
        });
        // Redirect to builder dashboard after successful subscription
        setTimeout(() => {
          window.location.href = '/builder-dashboard';
        }, 2000);
      } else {
        toast({
          title: "Request Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process builder subscription request.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Unlock premium property listings and direct builder contacts with our flexible subscription plans
          </p>
          
          {user?.plan && (
            <div className="mt-6">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Current Plan: {user.plan}
              </Badge>
            </div>
          )}
        </div>

        {/* User Plans */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Crown className="h-8 w-8 text-primary mr-3" />
              User Subscription Plans
            </h2>
            <p className="text-muted-foreground">
              Get direct access to premium properties and builder contacts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                onSelect={handlePlanSelect}
                userPlan={user?.plan}
              />
            ))}
          </div>

          {/* Features Comparison */}
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Plan Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Feature</th>
                      <th className="text-center py-4 px-4">Starter</th>
                      <th className="text-center py-4 px-4">Professional</th>
                      <th className="text-center py-4 px-4">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Property Access", "5", "10", "15"],
                      ["Builder Contacts", "✗", "✓", "✓"],
                      ["Priority Support", "✗", "✓", "✓"],
                      ["Comparison Tool", "✗", "✓", "✓"],
                      ["Market Insights", "✗", "✗", "✓"],
                      ["Virtual Tours", "✗", "✗", "✓"],
                      ["Validity", "7 days", "15 days", "30 days"]
                    ].map(([feature, starter, professional, premium], index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-4 font-medium">{feature}</td>
                        <td className="text-center py-4 px-4">
                          {starter === "✓" ? <Check className="h-5 w-5 text-success mx-auto" /> :
                           starter === "✗" ? <X className="h-5 w-5 text-muted-foreground mx-auto" /> :
                           starter}
                        </td>
                        <td className="text-center py-4 px-4">
                          {professional === "✓" ? <Check className="h-5 w-5 text-success mx-auto" /> :
                           professional === "✗" ? <X className="h-5 w-5 text-muted-foreground mx-auto" /> :
                           professional}
                        </td>
                        <td className="text-center py-4 px-4">
                          {premium === "✓" ? <Check className="h-5 w-5 text-success mx-auto" /> :
                           premium === "✗" ? <X className="h-5 w-5 text-muted-foreground mx-auto" /> :
                           premium}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Builder Plan */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Building className="h-8 w-8 text-primary mr-3" />
            Builder Subscription
          </h2>
          <p className="text-muted-foreground">
            Showcase your properties to thousands of potential buyers
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="relative border-2 border-primary shadow-[var(--shadow-elegant)]">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-primary-glow px-4 py-2">
                <Star className="h-4 w-4 mr-1" />
                For Builders
              </Badge>
            </div>

            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">{builderPlan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">{builderPlan.price}</span>
                <span className="text-muted-foreground ml-2">{builderPlan.duration}</span>
              </div>

              <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                {builderPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                variant="default"
                onClick={handleBuilderSubscription}
                disabled={isProcessing}
                className="w-full mb-4"
              >
                {isProcessing ? "Activating..." : "Activate Builder Plan"}
              </Button>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>builders@nonobroker.com</span>
                </div>
                <p className="mt-4">
                  Instant activation - Start posting projects immediately!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I access builder contacts?</h3>
                <p className="text-muted-foreground text-sm">
                  After subscribing to Professional or Premium plan, you'll get direct contact details of builder sourcing teams for the properties you view.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can upgrade your plan anytime. The remaining validity will be adjusted for the new plan.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What happens after plan expires?</h3>
                <p className="text-muted-foreground text-sm">
                  You can still browse properties but won't be able to access contact details until you renew your subscription.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Are there any hidden charges?</h3>
                <p className="text-muted-foreground text-sm">
                  No hidden charges! All prices are inclusive. You only pay the subscription fee - no broker commissions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
