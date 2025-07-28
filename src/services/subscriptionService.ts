
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
  role?: string;
  plan?: string;
  projectsViewed?: number;
  projectsLimit?: number;
  subscriptionExpiry?: string;
}

export class SubscriptionService {
  static async subscribeToPlan(planId: string, user: User, updateUser: (updates: Partial<User>) => void): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock subscription logic with project-based plans
      const plans = {
        'starter': { name: 'Starter', projectsLimit: 5, duration: 7 },
        'professional': { name: 'Professional', projectsLimit: 10, duration: 15 },
        'premium': { name: 'Premium', projectsLimit: 15, duration: 30 }
      };
      
      const selectedPlan = plans[planId as keyof typeof plans];
      if (!selectedPlan) {
        throw new Error('Invalid plan selected');
      }
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + selectedPlan.duration);
      
      // Update user with new plan
      updateUser({
        plan: selectedPlan.name,
        projectsLimit: selectedPlan.projectsLimit,
        projectsViewed: 0, // Reset project count on new subscription
        subscriptionExpiry: expiryDate.toISOString()
      });
      
      console.log(`User ${user.email} subscribed to ${selectedPlan.name} plan`);
      
      return {
        success: true,
        message: `Successfully subscribed to ${selectedPlan.name} plan! You can now view ${selectedPlan.projectsLimit} projects.`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Subscription failed'
      };
    }
  }

  static async handleBuilderSubscription(userEmail: string, updateUser: (updates: Partial<User>) => void): Promise<{ success: boolean; message: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Builder subscription lasts 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      updateUser({
        role: 'builder',
        plan: 'Builder',
        projectsLimit: 999,
        projectsViewed: 0,
        subscriptionExpiry: expiryDate.toISOString()
      });
      
      console.log(`Builder subscription activated for ${userEmail} until ${expiryDate.toDateString()}`);
      
      return {
        success: true,
        message: `Builder subscription activated for 30 days! Valid until ${expiryDate.toDateString()}`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process builder subscription request'
      };
    }
  }

  static async cancelBuilderSubscription(user: User, updateUser: (updates: Partial<User>) => void): Promise<{ success: boolean; message: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        plan: 'No Plan',
        projectsLimit: 0,
        projectsViewed: 0,
        subscriptionExpiry: undefined
      });
      
      console.log(`Builder subscription cancelled for ${user.email}`);
      
      return {
        success: true,
        message: 'Builder subscription cancelled successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to cancel subscription'
      };
    }
  }

  static canAccessPremiumFeatures(user: User | null): boolean {
    if (!user || !user.plan) return false;
    if (user.plan === 'No Plan') return false;
    
    // Check if subscription has expired
    if (user.subscriptionExpiry) {
      const expiryDate = new Date(user.subscriptionExpiry);
      const now = new Date();
      if (now > expiryDate) {
        return false;
      }
    }
    
    return true;
  }

  static canViewMoreProjects(user: User | null): boolean {
    if (!user || !user.plan) return false;
    if (!this.canAccessPremiumFeatures(user)) return false;
    
    if (user.plan === 'Builder') return true;
    const viewed = user.projectsViewed || 0;
    const limit = user.projectsLimit || 0;
    return viewed < limit;
  }

  static incrementProjectView(user: User, updateUser: (updates: Partial<User>) => void): void {
    if (user.plan === 'Builder') return;
    if (!this.canAccessPremiumFeatures(user)) return;
    
    const newViewed = (user.projectsViewed || 0) + 1;
    updateUser({ projectsViewed: newViewed });
  }

  static getSubscriptionStatus(user: User | null): { isActive: boolean; daysRemaining: number; expiryDate: string | null } {
    if (!user || !user.subscriptionExpiry) {
      return { isActive: false, daysRemaining: 0, expiryDate: null };
    }
    
    const expiryDate = new Date(user.subscriptionExpiry);
    const now = new Date();
    const timeDiff = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return {
      isActive: daysRemaining > 0,
      daysRemaining: Math.max(0, daysRemaining),
      expiryDate: expiryDate.toDateString()
    };
  }
}
