import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building, Users, Shield, Star, ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-real-estate.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface HomePageProps {
  user?: { name: string; plan?: string } | null;
  onLogin: () => void;
}

const HomePage = ({ user, onLogin }: HomePageProps) => {
  const [playingVideo, setPlayingVideo] = useState(false);

  const stats = [
    { label: "Active Properties", value: "2,500+", icon: Building },
    { label: "Happy Customers", value: "10,000+", icon: Users },
    { label: "Builder Partners", value: "500+", icon: Star },
    { label: "Secure Transactions", value: "100%", icon: Shield },
  ];

  const featuredProperties = [
    {
      id: "1",
      title: "Luxury Residences at Marina Bay",
      location: "Mumbai, Maharashtra",
      price: "₹2.5 Cr onwards",
      image: property1,
      type: "Apartment",
      badge: "New Launch"
    },
    {
      id: "2",
      title: "Premium Villas in Green Valley",
      location: "Bangalore, Karnataka",
      price: "₹1.8 Cr onwards",
      image: property2,
      type: "Villa",
      badge: "Ready to Move"
    },
    {
      id: "3",
      title: "Commercial Spaces Tech Park",
      location: "Gurgaon, Haryana",
      price: "₹3.2 Cr onwards",
      image: property3,
      type: "Commercial",
      badge: "Premium"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(var(--gradient-hero)), url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-foreground/20" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-secondary to-primary-glow bg-clip-text text-transparent">
              Dream Property
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            Direct access to premium properties and builder contacts. No broker fees, just results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link to="/properties">
                <Button size="lg" variant="hero" className="text-lg px-8 py-6">
                  Explore Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" variant="hero" className="text-lg px-8 py-6" onClick={onLogin}>
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              onClick={() => setPlayingVideo(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover handpicked premium properties from trusted builders across India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                    {property.badge}
                  </Badge>
                  <Badge variant="outline" className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm">
                    {property.type}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-muted-foreground mb-3">{property.location}</p>
                  <div className="text-2xl font-bold text-primary">{property.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/properties">
              <Button size="lg" variant="premium">
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How NoNo Broker Works</h2>
            <p className="text-xl text-muted-foreground">
              Simple, transparent, and direct access to properties
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-none shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Choose Your Plan</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  Select from our affordable subscription plans based on your property viewing needs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-none shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Browse Properties</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  Access verified property listings with detailed information and high-quality images
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-none shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Connect Directly</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  Get direct contact details of builder sourcing teams. No middleman, no extra fees
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-glow">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of satisfied customers who found their dream homes through NoNo Broker
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/pricing">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Upgrade Your Plan
                </Button>
              </Link>
            ) : (
              <>
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={onLogin}>
                  Get Started Today
                </Button>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                    View Pricing
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;