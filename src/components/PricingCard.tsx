
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import AdminPricingControls from "./AdminPricingControls";

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

interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (plan: PricingPlan) => void;
  onUpdatePlan?: (planId: string, updates: Partial<PricingPlan>) => void;
  userPlan?: string;
  userRole?: string;
}

const PricingCard = ({ plan, onSelect, onUpdatePlan, userPlan, userRole }: PricingCardProps) => {
  const isCurrentPlan = userPlan === plan.name;
  const isBuilder = userRole === 'builder';
  const isTestUser = userRole === 'test';

  return (
    <Card className={`relative transition-all duration-300 hover:shadow-[var(--shadow-elegant)] ${
      plan.popular ? "border-primary shadow-lg scale-105" : ""
    }`}>
      {onUpdatePlan && (
        <AdminPricingControls plan={plan} onUpdate={onUpdatePlan} />
      )}
      
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-gradient-to-r from-primary to-primary-glow">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      {plan.badge && (
        <div className="absolute -top-3 right-3">
          <Badge variant="secondary">{plan.badge}</Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <div className="flex items-baseline justify-center space-x-2">
          <span className="text-3xl font-bold text-primary">{plan.price}</span>
          {plan.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
          )}
        </div>
        <CardDescription className="text-lg">
          Access to <span className="font-semibold text-foreground">{plan.projects} projects</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Check className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          variant={plan.popular ? "premium" : isCurrentPlan ? "outline" : "default"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(plan);
          }}
          disabled={isBuilder || isTestUser}
          type="button"
        >
          {isCurrentPlan ? "Renew Plan" : isBuilder ? "Builder Only" : isTestUser ? "Test Account" : "Choose Plan"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
