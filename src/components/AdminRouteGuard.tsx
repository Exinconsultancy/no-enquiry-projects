
import { ReactNode } from "react";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield } from "lucide-react";

interface AdminRouteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const AdminRouteGuard = ({ children, fallback }: AdminRouteGuardProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useSecureAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <Alert className="m-4">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to access this area.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return fallback || (
      <Alert className="m-4" variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this admin area.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
