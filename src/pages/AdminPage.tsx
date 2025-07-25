import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Download,
  Upload,
  Shield
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  plan?: string;
  projectsViewed: number;
  joinDate: string;
  status: "active" | "inactive";
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  builder: string;
  status: "active" | "pending" | "sold";
  createdDate: string;
}

interface Builder {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subscription: "active" | "expired";
  projects: number;
  paymentDate: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    price: "",
    type: "",
    builder: "",
    description: ""
  });

  // Sample data
  useEffect(() => {
    const sampleUsers: User[] = [
      {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh@email.com",
        plan: "Professional",
        projectsViewed: 7,
        joinDate: "2024-01-15",
        status: "active"
      },
      {
        id: "2",
        name: "Priya Sharma",
        email: "priya@email.com",
        plan: "Premium",
        projectsViewed: 12,
        joinDate: "2024-02-20",
        status: "active"
      },
      {
        id: "3",
        name: "Amit Patel",
        email: "amit@email.com",
        plan: "Starter",
        projectsViewed: 3,
        joinDate: "2024-03-10",
        status: "inactive"
      }
    ];

    const sampleProperties: Property[] = [
      {
        id: "1",
        title: "Luxury Residences at Marina Bay",
        location: "Mumbai, Maharashtra",
        price: "₹2.5 Cr",
        type: "Apartment",
        builder: "Luxury Builders Ltd",
        status: "active",
        createdDate: "2024-01-10"
      },
      {
        id: "2",
        title: "Premium Villas in Green Valley",
        location: "Bangalore, Karnataka",
        price: "₹1.8 Cr",
        type: "Villa",
        builder: "Green Valley Developers",
        status: "active",
        createdDate: "2024-02-05"
      }
    ];

    const sampleBuilders: Builder[] = [
      {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh@luxurybuilders.com",
        phone: "+91 98765 43210",
        company: "Luxury Builders Ltd",
        subscription: "active",
        projects: 5,
        paymentDate: "2024-03-01"
      },
      {
        id: "2",
        name: "Priya Sharma",
        email: "priya@greenvalley.com",
        phone: "+91 87654 32109",
        company: "Green Valley Developers",
        subscription: "active",
        projects: 3,
        paymentDate: "2024-03-15"
      }
    ];

    setUsers(sampleUsers);
    setProperties(sampleProperties);
    setBuilders(sampleBuilders);
  }, []);

  const handleAddProperty = () => {
    if (!newProperty.title || !newProperty.location || !newProperty.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const property: Property = {
      id: Date.now().toString(),
      title: newProperty.title,
      location: newProperty.location,
      price: newProperty.price,
      type: newProperty.type,
      builder: newProperty.builder,
      status: "pending",
      createdDate: new Date().toISOString().split('T')[0]
    };

    setProperties([...properties, property]);
    setNewProperty({ title: "", location: "", price: "", type: "", builder: "", description: "" });
    
    toast({
      title: "Success",
      description: "Property added successfully!",
    });
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    toast({
      title: "Success",
      description: "Property deleted successfully!",
    });
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
    toast({
      title: "Success",
      description: "User status updated successfully!",
    });
  };

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Properties",
      value: properties.filter(p => p.status === "active").length.toString(),
      icon: Building,
      color: "text-green-600"
    },
    {
      title: "Builder Subscriptions",
      value: builders.filter(b => b.subscription === "active").length.toString(),
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Monthly Revenue",
      value: "₹" + (builders.filter(b => b.subscription === "active").length * 100000).toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="h-8 w-8 text-primary mr-3" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage users, properties, and builder subscriptions</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Admin Access
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="builders">Builders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Plan</th>
                        <th className="text-left py-2">Projects Viewed</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-3">{user.name}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">
                            <Badge variant={user.plan ? "default" : "secondary"}>
                              {user.plan || "No Plan"}
                            </Badge>
                          </td>
                          <td className="py-3">{user.projectsViewed}</td>
                          <td className="py-3">
                            <Badge variant={user.status === "active" ? "default" : "destructive"}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.status === "active" ? "Deactivate" : "Activate"}
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <div className="space-y-6">
              {/* Add Property Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Property</CardTitle>
                  <CardDescription>Add a new property listing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Property Title</Label>
                      <Input
                        placeholder="Enter property title"
                        value={newProperty.title}
                        onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="Enter location"
                        value={newProperty.location}
                        onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        placeholder="Enter price"
                        value={newProperty.price}
                        onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={newProperty.type} onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Builder</Label>
                    <Input
                      placeholder="Enter builder name"
                      value={newProperty.builder}
                      onChange={(e) => setNewProperty({ ...newProperty, builder: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Enter property description"
                      value={newProperty.description}
                      onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddProperty}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </CardContent>
              </Card>

              {/* Properties List */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Management</CardTitle>
                  <CardDescription>Manage all property listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Title</th>
                          <th className="text-left py-2">Location</th>
                          <th className="text-left py-2">Price</th>
                          <th className="text-left py-2">Type</th>
                          <th className="text-left py-2">Builder</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((property) => (
                          <tr key={property.id} className="border-b">
                            <td className="py-3">{property.title}</td>
                            <td className="py-3">{property.location}</td>
                            <td className="py-3">{property.price}</td>
                            <td className="py-3">{property.type}</td>
                            <td className="py-3">{property.builder}</td>
                            <td className="py-3">
                              <Badge variant={property.status === "active" ? "default" : "secondary"}>
                                {property.status}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteProperty(property.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Builders Tab */}
          <TabsContent value="builders">
            <Card>
              <CardHeader>
                <CardTitle>Builder Management</CardTitle>
                <CardDescription>Manage builder subscriptions and accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Company</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Phone</th>
                        <th className="text-left py-2">Projects</th>
                        <th className="text-left py-2">Subscription</th>
                        <th className="text-left py-2">Payment Date</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {builders.map((builder) => (
                        <tr key={builder.id} className="border-b">
                          <td className="py-3">{builder.name}</td>
                          <td className="py-3">{builder.company}</td>
                          <td className="py-3">{builder.email}</td>
                          <td className="py-3">{builder.phone}</td>
                          <td className="py-3">{builder.projects}</td>
                          <td className="py-3">
                            <Badge variant={builder.subscription === "active" ? "default" : "destructive"}>
                              {builder.subscription}
                            </Badge>
                          </td>
                          <td className="py-3">{builder.paymentDate}</td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure platform-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Site Title</Label>
                    <Input defaultValue="NoNo Broker" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input defaultValue="support@nonobroker.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Builder Subscription Price (Monthly)</Label>
                    <Input defaultValue="₹1,00,000" />
                  </div>
                  <Button>Update Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Export and import platform data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export User Data
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Property Data
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Properties
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;