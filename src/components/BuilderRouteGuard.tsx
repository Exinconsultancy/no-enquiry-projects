import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "./ui/alert";
import { Building2 } from "lucide-react";

interface BuilderRouteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const BuilderRouteGuard = ({ children, fallback }: BuilderRouteGuardProps) => {
  const { user, profile, loading } = useAuth();
  const isAuthenticated = !!user;
  const isBuilder = profile?.role === 'builder';
  const isAdmin = profile?.role === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <Alert className="m-4">
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to access the builder dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isBuilder && !isAdmin) {
    return fallback || (
      <Alert className="m-4" variant="destructive">
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          You need builder or admin access to view this dashboard. Please contact support to upgrade your account.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default BuilderRouteGuard;