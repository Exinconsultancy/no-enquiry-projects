import { createContext, useContext, useState, ReactNode } from "react";
import { useSecureAuth } from "./SecureAuthContext";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  builder: string;
  status: "active" | "pending" | "sold";
  createdDate: string;
  image?: string;
  description?: string;
  category: "property" | "rental" | "hostel";
}

interface AdminContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdDate'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getPropertiesByCategory: (category: Property['category']) => Property[];
  getPropertyById: (id: string) => Property | undefined;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const { isAdmin } = useSecureAuth();
  
  const [properties, setProperties] = useState<Property[]>([
    // Properties
    {
      id: "1",
      title: "Luxury Residences at Marina Bay",
      location: "Mumbai, Maharashtra",
      price: "₹2.5 Cr",
      type: "Apartment",
      builder: "Luxury Builders Ltd",
      status: "active",
      createdDate: "2024-01-10",
      category: "property"
    },
    {
      id: "2",
      title: "Premium Villas in Green Valley",
      location: "Bangalore, Karnataka",
      price: "₹1.8 Cr",
      type: "Villa",
      builder: "Green Valley Developers",
      status: "active",
      createdDate: "2024-02-05",
      category: "property"
    },
    {
      id: "3",
      title: "Modern Apartments in Tech Park",
      location: "Hyderabad, Telangana",
      price: "₹95 Lakh",
      type: "Apartment",
      builder: "Tech Park Developers",
      status: "active",
      createdDate: "2024-03-12",
      category: "property"
    },
    {
      id: "4",
      title: "Spacious Flats in City Center",
      location: "Pune, Maharashtra",
      price: "₹1.2 Cr",
      type: "Apartment",
      builder: "City Center Constructions",
      status: "active",
      createdDate: "2024-03-15",
      category: "property"
    },
    // Rentals
    {
      id: "5",
      title: "Furnished 2BHK Apartment",
      location: "Bandra, Mumbai",
      price: "₹45,000/month",
      type: "Apartment",
      builder: "Premium Rentals",
      status: "active",
      createdDate: "2024-01-20",
      category: "rental"
    },
    {
      id: "6",
      title: "Cozy 1BHK in IT Hub",
      location: "Whitefield, Bangalore",
      price: "₹25,000/month",
      type: "Apartment",
      builder: "IT Hub Rentals",
      status: "active",
      createdDate: "2024-02-01",
      category: "rental"
    },
    {
      id: "7",
      title: "Spacious 3BHK Villa",
      location: "Gachibowli, Hyderabad",
      price: "₹35,000/month",
      type: "Villa",
      builder: "Villa Rentals Co",
      status: "active",
      createdDate: "2024-02-10",
      category: "rental"
    },
    // Hostels
    {
      id: "8",
      title: "Student Hostel - Boys",
      location: "Kothrud, Pune",
      price: "₹8,000/month",
      type: "Hostel",
      builder: "Student Stay Solutions",
      status: "active",
      createdDate: "2024-01-15",
      category: "hostel"
    },
    {
      id: "9",
      title: "Working Professional PG",
      location: "HSR Layout, Bangalore",
      price: "₹12,000/month",
      type: "PG",
      builder: "Professional Stay",
      status: "active",
      createdDate: "2024-02-20",
      category: "hostel"
    },
    {
      id: "10",
      title: "Girls Hostel - AC Rooms",
      location: "Andheri, Mumbai",
      price: "₹15,000/month",
      type: "Hostel",
      builder: "Safe Stay Hostels",
      status: "active",
      createdDate: "2024-03-01",
      category: "hostel"
    }
  ]);

  const addProperty = (property: Omit<Property, 'id' | 'createdDate'>) => {
    if (!isAdmin) {
      throw new Error("Only admins can add properties");
    }
    
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setProperties(prev => [...prev, newProperty]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    if (!isAdmin) {
      throw new Error("Only admins can update properties");
    }
    
    setProperties(prev => 
      prev.map(property => 
        property.id === id ? { ...property, ...updates } : property
      )
    );
  };

  const deleteProperty = (id: string) => {
    if (!isAdmin) {
      throw new Error("Only admins can delete properties");
    }
    
    setProperties(prev => prev.filter(property => property.id !== id));
  };

  const getPropertiesByCategory = (category: Property['category']) => {
    return properties.filter(property => property.category === category);
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const value = {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    getPropertiesByCategory,
    getPropertyById
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
