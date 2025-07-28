import { createContext, useContext, useState, ReactNode } from "react";
import { useAdmin } from "./AdminContext";
import { useToast } from "@/hooks/use-toast";

interface BuilderProject {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  type: string;
  amenities: string;
  images: string[];
  brochure?: string;
  status: "draft" | "published";
  createdDate: string;
  builderEmail: string;
}

interface BuilderContextType {
  projects: BuilderProject[];
  addProject: (project: Omit<BuilderProject, 'id' | 'createdDate' | 'status'>) => void;
  updateProject: (id: string, updates: Partial<BuilderProject>) => void;
  deleteProject: (id: string) => void;
  publishProject: (id: string) => void;
  getUserProjects: (builderEmail: string) => BuilderProject[];
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};

interface BuilderProviderProps {
  children: ReactNode;
}

export const BuilderProvider = ({ children }: BuilderProviderProps) => {
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const { addProperty } = useAdmin();
  const { toast } = useToast();

  const addProject = (project: Omit<BuilderProject, 'id' | 'createdDate' | 'status'>) => {
    const newProject: BuilderProject = {
      ...project,
      id: crypto.randomUUID(),
      status: "draft",
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setProjects(prev => [...prev, newProject]);
    
    toast({
      title: "Project Created",
      description: "Your project has been created as a draft.",
    });
  };

  const updateProject = (id: string, updates: Partial<BuilderProject>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    
    toast({
      title: "Project Deleted",
      description: "Project has been removed from your dashboard.",
    });
  };

  const publishProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    // Add to main properties through AdminContext
    addProperty({
      title: project.title,
      location: project.location,
      price: project.price,
      type: project.type,
      builder: project.builderEmail,
      status: "active",
      category: "property",
      description: project.description,
      image: project.images[0] || undefined
    });

    // Remove from builder projects (it's now published)
    setProjects(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Project Published",
      description: "Your project is now live on the properties page!",
    });
  };

  const getUserProjects = (builderEmail: string) => {
    return projects.filter(project => project.builderEmail === builderEmail);
  };

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    publishProject,
    getUserProjects
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};