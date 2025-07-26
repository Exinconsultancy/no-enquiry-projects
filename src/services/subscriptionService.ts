
interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  projects: number;
  features: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  plan?: string;
  projectsViewed?: number;
  projectsLimit?: number;
}

export class SubscriptionService {
  static async subscribeToPlan(planId: string, user: User, updateUser: (updates: Partial<User>) => void): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock subscription logic
      const plans = {
        'starter': { name: 'Starter', projectsLimit: 5 },
        'professional': { name: 'Professional', projectsLimit: 10 },
        'premium': { name: 'Premium', projectsLimit: 15 }
      };
      
      const selectedPlan = plans[planId as keyof typeof plans];
      if (!selectedPlan) {
        throw new Error('Invalid plan selected');
      }
      
      // Update user with new plan
      updateUser({
        plan: selectedPlan.name,
        projectsLimit: selectedPlan.projectsLimit,
        projectsViewed: user.projectsViewed || 0
      });
      
      console.log(`User ${user.email} subscribed to ${selectedPlan.name} plan`);
      
      return {
        success: true,
        message: `Successfully subscribed to ${selectedPlan.name} plan!`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Subscription failed'
      };
    }
  }

  static async getBuilderSubscriptionInfo(): Promise<{ contactEmail: string; contactPhone: string }> {
    // Return builder subscription contact information
    return {
      contactEmail: 'builders@nonobroker.com',
      contactPhone: '+91 98765 43210'
    };
  }

  static async handleBuilderSubscription(userEmail: string, updateUser: (updates: Partial<User>) => void): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate sending builder subscription request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user to builder plan
      updateUser({
        plan: 'Builder',
        projectsLimit: 999, // Unlimited for builders
        projectsViewed: 0
      });
      
      console.log(`Builder subscription activated for ${userEmail}`);
      
      return {
        success: true,
        message: 'Builder subscription activated! You can now post unlimited projects.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process builder subscription request'
      };
    }
  }

  static canAccessPremiumFeatures(user: User | null): boolean {
    if (!user || !user.plan) return false;
    return user.plan !== 'No Plan';
  }

  static canViewMoreProjects(user: User | null): boolean {
    if (!user || !user.plan) return false;
    if (user.plan === 'Builder') return true; // Builders can view unlimited
    const viewed = user.projectsViewed || 0;
    const limit = user.projectsLimit || 0;
    return viewed < limit;
  }

  static incrementProjectView(user: User, updateUser: (updates: Partial<User>) => void): void {
    if (user.plan === 'Builder') return; // Builders have unlimited views
    const newViewed = (user.projectsViewed || 0) + 1;
    updateUser({ projectsViewed: newViewed });
  }
}
