import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Save, AlertTriangle } from "lucide-react";
import { useMaintenance } from "@/contexts/MaintenanceContext";

const MaintenanceControls = () => {
  const { maintenanceMode, setMaintenanceMode, canManageMaintenance } = useMaintenance();
  const { toast } = useToast();
  const [tempMessage, setTempMessage] = useState(maintenanceMode.globalMessage || "");

  if (!canManageMaintenance) {
    return null;
  }

  const handleToggle = (page: keyof typeof maintenanceMode, value: boolean) => {
    if (page === 'globalMessage') return;
    
    setMaintenanceMode({ [page]: value });
    
    toast({
      title: value ? "Maintenance Enabled" : "Maintenance Disabled",
      description: `${page.charAt(0).toUpperCase() + page.slice(1)} page is now ${value ? 'under maintenance' : 'available'}.`,
      variant: value ? "destructive" : "default",
    });
  };

  const handleSaveMessage = () => {
    setMaintenanceMode({ globalMessage: tempMessage });
    toast({
      title: "Message Updated",
      description: "Global maintenance message has been saved.",
    });
  };

  const maintenancePages = [
    { key: 'properties' as const, label: 'Properties Page', description: 'Buy/Sell properties section' },
    { key: 'rentals' as const, label: 'Rentals Page', description: 'Rental properties section' },
    { key: 'hostels' as const, label: 'Hostels Page', description: 'Hostel accommodations section' }
  ];

  const activeMaintenanceCount = maintenancePages.filter(page => maintenanceMode[page.key]).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <CardTitle>Maintenance Mode Controls</CardTitle>
          </div>
          {activeMaintenanceCount > 0 && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{activeMaintenanceCount} page{activeMaintenanceCount !== 1 ? 's' : ''} under maintenance</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Page-specific maintenance toggles */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Page Controls
          </h3>
          
          {maintenancePages.map((page) => (
            <div key={page.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={page.key} className="font-medium">
                    {page.label}
                  </Label>
                  {maintenanceMode[page.key] && (
                    <Badge variant="outline" className="text-xs">
                      Under Maintenance
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {page.description}
                </p>
              </div>
              
              <Switch
                id={page.key}
                checked={maintenanceMode[page.key]}
                onCheckedChange={(checked) => handleToggle(page.key, checked)}
              />
            </div>
          ))}
        </div>

        {/* Global maintenance message */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Global Maintenance Message
          </h3>
          
          <div className="space-y-3">
            <Label htmlFor="globalMessage">
              Custom message for maintenance pages (optional)
            </Label>
            <Textarea
              id="globalMessage"
              value={tempMessage}
              onChange={(e) => setTempMessage(e.target.value)}
              placeholder="Enter a custom message to display on maintenance pages..."
              rows={3}
            />
            <Button 
              onClick={handleSaveMessage}
              size="sm"
              className="w-fit"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Message
            </Button>
          </div>
        </div>

        {/* Status Summary */}
        {activeMaintenanceCount > 0 && (
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Active Maintenance Notice
              </span>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {activeMaintenanceCount} page{activeMaintenanceCount !== 1 ? 's are' : ' is'} currently under maintenance. 
              Users will see a maintenance page when trying to access{' '}
              {activeMaintenanceCount === 1 ? 'this section' : 'these sections'}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceControls;