import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserCheck, UserX, Shield, Users } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  role: string;
  created_at: string;
}

const AdminUserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });

      // Refresh the profiles list
      fetchProfiles();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading users...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>User Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{profile.display_name}</h3>
                <p className="text-sm text-muted-foreground">
                  User ID: {profile.user_id.slice(0, 8)}...
                </p>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge 
                  variant={profile.role === 'admin' ? 'default' : 'secondary'}
                  className="flex items-center space-x-1"
                >
                  {profile.role === 'admin' && <Shield className="h-3 w-3" />}
                  <span>{profile.role}</span>
                </Badge>
                
                <div className="flex space-x-2">
                  {profile.role !== 'admin' ? (
                    <Button
                      size="sm"
                      onClick={() => updateUserRole(profile.user_id, 'admin')}
                      className="flex items-center space-x-1"
                    >
                      <UserCheck className="h-3 w-3" />
                      <span>Make Admin</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateUserRole(profile.user_id, 'user')}
                      className="flex items-center space-x-1"
                    >
                      <UserX className="h-3 w-3" />
                      <span>Remove Admin</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {profiles.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;