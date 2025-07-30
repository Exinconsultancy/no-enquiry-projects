import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  builder: string;
  status: 'active' | 'pending' | 'sold';
  category: 'property' | 'rental' | 'hostel';
  amenities: string[];
  images: string[];
  brochures: string[];
  bedrooms: string;
  bathrooms: string;
  area: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties((data || []) as Property[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('Properties updated:', payload);
          fetchProperties(); // Refetch all properties when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getPropertiesByCategory = (category: Property['category']) => {
    return properties.filter(property => property.category === category);
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  return {
    properties,
    loading,
    error,
    getPropertiesByCategory,
    getPropertyById,
    refetch: fetchProperties
  };
};