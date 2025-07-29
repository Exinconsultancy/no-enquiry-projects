import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface MaintenanceMode {
  properties: boolean;
  rentals: boolean;
  hostels: boolean;
  globalMessage?: string;
}

interface MaintenanceContextType {
  maintenanceMode: MaintenanceMode;
  setMaintenanceMode: (mode: Partial<MaintenanceMode>) => void;
  isPageInMaintenance: (page: keyof MaintenanceMode) => boolean;
  canManageMaintenance: boolean;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
};

interface MaintenanceProviderProps {
  children: ReactNode;
}

export const MaintenanceProvider = ({ children }: MaintenanceProviderProps) => {
  const [maintenanceMode, setMaintenanceModeState] = useState<MaintenanceMode>({
    properties: false,
    rentals: false,
    hostels: false,
    globalMessage: ""
  });

  // Get auth context safely
  let isAdmin = false;
  try {
    const { profile } = useAuth();
    isAdmin = profile?.role === 'admin';
  } catch (error) {
    // Auth not available yet, default to false
    isAdmin = false;
  }

  // Load maintenance settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('maintenanceMode');
    if (savedSettings) {
      try {
        setMaintenanceModeState(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load maintenance settings:', error);
      }
    }
  }, []);

  const setMaintenanceMode = (mode: Partial<MaintenanceMode>) => {
    const newMode = { ...maintenanceMode, ...mode };
    setMaintenanceModeState(newMode);
    
    // Save to localStorage
    localStorage.setItem('maintenanceMode', JSON.stringify(newMode));
  };

  const isPageInMaintenance = (page: keyof MaintenanceMode) => {
    if (page === 'globalMessage') return false;
    return maintenanceMode[page] === true;
  };

  const value = {
    maintenanceMode,
    setMaintenanceMode,
    isPageInMaintenance,
    canManageMaintenance: isAdmin
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};