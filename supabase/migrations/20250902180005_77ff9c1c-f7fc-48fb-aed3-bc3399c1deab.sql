-- Update all properties to Pune-based locations
UPDATE properties SET 
  location = CASE 
    WHEN id = '959b74a1-a69a-49e9-8808-03a17a61b694' THEN 'Koregaon Park, Pune'
    WHEN id = '35fb3645-066f-4e82-8e64-c2a93e802d9c' THEN 'Viman Nagar, Pune'
    WHEN id = '997c99c4-4e69-4f3e-a665-c75e0f57c119' THEN 'Baner, Pune'
    WHEN id = '786164e6-ba6f-4889-a515-19b7b2a8e59b' THEN 'Hinjewadi, Pune'
    WHEN id = '33713ca2-7a52-49a7-948d-ad688b20c6c2' THEN 'Pune Hills, Pune'
    WHEN id = '5b4b2a58-7df7-4a3b-9c60-feccd0d7ba6f' THEN 'Katraj, Pune'
    WHEN id = 'd0c4b5fb-31b5-4295-9209-5c28402b726a' THEN 'Shivaji Nagar, Pune'
    WHEN id = 'fd29700b-8893-48b7-8fea-f0263c74f7d8' THEN 'Wakad, Pune'
    WHEN id = '893040d6-3312-45e9-ac10-049a03e9786c' THEN 'Magarpatta, Pune'
    WHEN id = '0e5a3cab-81e4-4d93-b84d-a574795fbd3b' THEN 'Hadapsar, Pune'
    ELSE location
  END;

-- Add more Pune-specific properties
INSERT INTO properties (title, location, price, type, builder, status, category, amenities, images, brochures, bedrooms, bathrooms, area, description) VALUES
('Luxury Apartment in Koregaon Park', 'Koregaon Park, Pune', '₹2.5 Cr', 'Apartment', 'Godrej Properties', 'active', 'property', ARRAY['Swimming Pool', 'Gym', 'Security', 'Garden', 'Club House'], ARRAY['/property-1.jpg'], ARRAY[]::text[], '3 BHK', '3 Bath', '1800 sq ft', 'Premium apartment in the heart of Koregaon Park with modern amenities'),

('Villa in Baner Hills', 'Baner, Pune', '₹4.2 Cr', 'Villa', 'Mahindra Lifespace', 'active', 'property', ARRAY['Private Pool', 'Garden', 'Security', 'Parking', 'Club House'], ARRAY['/property-2.jpg'], ARRAY[]::text[], '4 BHK', '4 Bath', '3200 sq ft', 'Independent villa with scenic hill views and private amenities'),

('Commercial Space Hinjewadi', 'Hinjewadi, Pune', '₹1.8 Cr', 'Commercial', 'Tata Realty', 'active', 'property', ARRAY['AC', 'Elevator', 'Security', 'Parking', 'Conference Room'], ARRAY['/property-3.jpg'], ARRAY[]::text[], 'Office', '2 Bath', '2500 sq ft', 'Premium office space in IT hub with all modern facilities'),

('Penthouse Viman Nagar', 'Viman Nagar, Pune', '₹3.8 Cr', 'Penthouse', 'Lodha Group', 'active', 'property', ARRAY['Terrace', 'Swimming Pool', 'Gym', 'Security', 'Valet Parking'], ARRAY['/property-1.jpg'], ARRAY[]::text[], '4 BHK', '4 Bath', '2800 sq ft', 'Luxurious penthouse with terrace garden and premium amenities'),

('Plot in Wagholi', 'Wagholi, Pune', '₹85 L', 'Plot', 'Individual', 'active', 'property', ARRAY['Gated Community', 'Security', 'Water Supply', 'Electricity'], ARRAY['/property-2.jpg'], ARRAY[]::text[], 'Plot', 'NA', '2400 sq ft', 'Ready to construct plot in developing area with good connectivity'),

('Duplex in Magarpatta', 'Magarpatta, Pune', '₹3.2 Cr', 'Duplex', 'Magarpatta City', 'active', 'property', ARRAY['Club House', 'Swimming Pool', 'Garden', 'Security', 'Gym'], ARRAY['/property-3.jpg'], ARRAY[]::text[], '3 BHK', '3 Bath', '2200 sq ft', 'Modern duplex in planned township with excellent infrastructure');

-- Add rental properties in Pune
INSERT INTO properties (title, location, price, type, builder, status, category, amenities, images, brochures, bedrooms, bathrooms, area, description) VALUES
('Furnished Flat Koregaon Park', 'Koregaon Park, Pune', '₹55,000/month', 'Apartment', 'Prime Rentals', 'active', 'rental', ARRAY['Furnished', 'WiFi', 'AC', 'Parking'], ARRAY['/property-1.jpg'], ARRAY[]::text[], '2 BHK', '2 Bath', '1200 sq ft', 'Fully furnished apartment in prime location'),

('Studio in Viman Nagar', 'Viman Nagar, Pune', '₹35,000/month', 'Studio', 'Urban Living', 'active', 'rental', ARRAY['Furnished', 'Security', 'Gym'], ARRAY['/property-2.jpg'], ARRAY[]::text[], '1 BHK', '1 Bath', '600 sq ft', 'Modern studio for professionals'),

('Office Space Baner', 'Baner, Pune', '₹1,20,000/month', 'Commercial', 'Corporate Spaces', 'active', 'rental', ARRAY['AC', 'Conference Room', 'Parking', 'Security'], ARRAY['/property-3.jpg'], ARRAY[]::text[], 'Office', '2 Bath', '1800 sq ft', 'Premium office space in IT corridor');

-- Add hostel properties in Pune  
INSERT INTO properties (title, location, price, type, builder, status, category, amenities, images, brochures, bedrooms, bathrooms, area, description) VALUES
('Student Hostel Katraj', 'Katraj, Pune', '₹15,000/month', 'Hostel', 'Student Housing', 'active', 'hostel', ARRAY['WiFi', 'Mess', 'Security', 'Laundry'], ARRAY['/property-1.jpg'], ARRAY[]::text[], 'Shared', 'Common', '120 sq ft', 'Comfortable hostel near engineering colleges'),

('PG for Working Women Shivaji Nagar', 'Shivaji Nagar, Pune', '₹22,000/month', 'PG', 'Safe Stay', 'active', 'hostel', ARRAY['WiFi', 'Mess', 'Security', 'AC'], ARRAY['/property-2.jpg'], ARRAY[]::text[], 'Single/Double', 'Common', '150 sq ft', 'Secure accommodation for working women'),

('Boys Hostel Wakad', 'Wakad, Pune', '₹12,000/month', 'Hostel', 'Youth Living', 'active', 'hostel', ARRAY['WiFi', 'Mess', 'Common Room', 'Security'], ARRAY['/property-3.jpg'], ARRAY[]::text[], 'Shared', 'Common', '100 sq ft', 'Affordable hostel for students and professionals');