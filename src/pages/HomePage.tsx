import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Shield, Users, TrendingUp, Star, CheckCircle, Home, Building, UserCheck, Phone, Mail, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import FeaturedProperties from "@/components/FeaturedProperties";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSecureAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const stats = [
    { label: "Properties Listed", value: "4,500+", icon: MapPin, color: "text-blue-500" },
    { label: "Happy Clients", value: "2,800+", icon: Users, color: "text-green-500" },
    { label: "Deals Closed", value: "1,200+", icon: Shield, color: "text-purple-500" },
    { label: "Monthly Visitors", value: "15,000+", icon: TrendingUp, color: "text-orange-500" },
  ];

  const features = [
    {
      title: "Extensive Property Listings",
      description: "Browse through thousands of verified property listings across India with detailed information and high-quality images.",
      icon: Search,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Direct Builder Contacts",
      description: "Connect directly with builders and sourcing teams for exclusive deals and negotiated prices.",
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Secure Transactions",
      description: "Ensure safe and secure property transactions with our verified process and legal documentation support.",
      icon: Shield,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "24/7 Support",
      description: "Get round-the-clock assistance from our expert team for all your property-related queries.",
      icon: Phone,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Verified Listings",
      description: "All properties are thoroughly verified and authenticated before being listed on our platform.",
      icon: CheckCircle,
      color: "bg-teal-50 text-teal-600",
    },
    {
      title: "Quick Processing",
      description: "Fast-track your property search with our streamlined process and instant notifications.",
      icon: Clock,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "I found my dream home through NoNo Broker! The direct builder contacts made the process so much easier and saved me thousands.",
      rating: 5,
      location: "Mumbai",
    },
    {
      name: "Rahul Verma",
      text: "The extensive listings and secure transaction process gave me the confidence to invest in a new property. Highly recommended!",
      rating: 5,
      location: "Delhi",
    },
    {
      name: "Anita Patel",
      text: "Excellent service and support throughout the entire process. The team was very professional and responsive.",
      rating: 4,
      location: "Bangalore",
    },
  ];

  const services = [
    {
      title: "Buy Properties",
      description: "Find your perfect home from thousands of verified listings",
      icon: Home,
      link: "/properties",
    },
    {
      title: "Rent Properties",
      description: "Discover rental properties that match your lifestyle",
      icon: Building,
      link: "/rentals",
    },
    {
      title: "Hostels & PG",
      description: "Comfortable accommodations for students and professionals",
      icon: UserCheck,
      link: "/hostels",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container relative z-20 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge variant="outline" className="mb-6 text-sm px-4 py-2">
                🏠 India's Most Trusted Property Platform
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-8 leading-tight">
                Find Your Perfect Property
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Browse verified listings, connect with builders directly, and secure your dream property with confidence. No hidden fees, no broker commissions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/properties')}>
                  <Search className="h-5 w-5 mr-2" />
                  Explore Properties
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/pricing')}>
                  View Subscription Plans
                </Button>
              </div>

              {/* Service Cards */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {services.map((service, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20" onClick={() => navigate(service.link)}>
                    <CardContent className="p-6 text-center">
                      <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <service.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <FeaturedProperties />

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Success Story</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their dream properties through our platform
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors`}>
                        <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose NoNo Broker?</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Discover the features that make us the preferred choice for property seekers across India
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardContent className="p-8">
                    <div className={`inline-flex p-4 rounded-full ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-xl mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-r from-accent/5 to-primary/5">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Read testimonials from satisfied clients who found their dream properties with us
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-10 opacity-90">
              Join thousands of satisfied clients and start your property search today. No hidden fees, no commissions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => navigate('/properties')}>
                Explore Properties Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={handleLogin}>
                Get Started Free
              </Button>
            </div>
          </div>
        </section>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default HomePage;
