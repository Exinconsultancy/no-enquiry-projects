
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Shield, Users, TrendingUp, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeaturedProperties from "@/components/FeaturedProperties";

interface HomePageProps {
  onLogin: () => void;
}

const HomePage = ({ onLogin }: HomePageProps) => {
  const navigate = useNavigate();

  const stats = [
    { label: "Properties Listed", value: "4,500+", icon: MapPin },
    { label: "Happy Clients", value: "2,800+", icon: Users },
    { label: "Deals Closed", value: "1,200+", icon: Shield },
    { label: "Monthly Visitors", value: "15,000+", icon: TrendingUp },
  ];

  const features = [
    {
      title: "Extensive Property Listings",
      description: "Browse through thousands of verified property listings across India.",
      icon: Search,
    },
    {
      title: "Direct Builder Contacts",
      description: "Connect directly with builders and sourcing teams for exclusive deals.",
      icon: Users,
    },
    {
      title: "Secure Transactions",
      description: "Ensure safe and secure property transactions with our verified process.",
      icon: Shield,
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "I found my dream home through NoBroker! The direct builder contacts made the process so much easier.",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      text: "The extensive listings and secure transaction process gave me the confidence to invest in a new property.",
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/src/assets/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm z-10" />
        </div>

        <div className="container relative z-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Find Your Perfect Property
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Browse verified listings, connect with builders directly, and secure your dream property with confidence.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate('/properties')}>
              <Search className="h-5 w-5 mr-2" />
              Explore Properties
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/pricing')}>
              View Subscription Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <FeaturedProperties />

      {/* Stats Section */}
      <section className="py-16 bg-accent/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground text-lg">
              Explore the features that make NoBroker the best platform for your property needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardContent className="p-6">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-accent/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground text-lg">
              Read testimonials from satisfied clients who found their dream properties with us
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-3">"{testimonial.text}"</p>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Join thousands of satisfied clients and start your property search today.
          </p>
          <Button size="lg" onClick={() => navigate('/properties')}>
            Explore Properties Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
