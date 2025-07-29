import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaintenancePageProps {
  pageName: string;
  customMessage?: string;
}

const MaintenancePage = ({ pageName, customMessage }: MaintenancePageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Wrench className="h-16 w-16 text-primary animate-pulse" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Under Maintenance</h1>
          
          <p className="text-muted-foreground mb-6">
            {customMessage || `The ${pageName} section is currently undergoing maintenance. We'll be back soon with improvements!`}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home Page
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Thank you for your patience while we improve your experience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;