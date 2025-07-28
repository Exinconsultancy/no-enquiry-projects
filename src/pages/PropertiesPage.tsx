
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import AdminFAB from "@/components/AdminFAB";
import { useAdmin } from "@/contexts/AdminContext";

const PropertiesPage = () => {
  const { getPropertiesByCategory } = useAdmin();
  const [filteredProperties, setFilteredProperties] = useState(getPropertiesByCategory("property"));

  const stats = [
    { title: "Total Properties", value: filteredProperties.length },
    { title: "Active Listings", value: filteredProperties.filter(p => p.status === "active").length },
    { title: "Cities Covered", value: new Set(filteredProperties.map(p => p.location.split(",")[1]?.trim())).size },
    { title: "Builders", value: new Set(filteredProperties.map(p => p.builder)).size }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Premium Properties
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your dream home from our exclusive collection of premium properties
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters
            properties={getPropertiesByCategory("property")}
            onFilterChange={setFilteredProperties}
          />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.price}
              type={property.type}
              image={property.image || "/placeholder.svg"}
              builder={property.builder}
              isNew={new Date(property.createdDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No properties found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more properties
            </p>
          </div>
        )}

        {/* Admin FAB */}
        <AdminFAB category="property" />
      </div>
    </div>
  );
};

export default PropertiesPage;
