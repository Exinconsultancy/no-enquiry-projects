-- Fix property image paths to point to public folder instead of src/assets
UPDATE properties 
SET images = ARRAY(
  SELECT REPLACE(unnest(images), '/src/assets/', '/')
) 
WHERE array_length(images, 1) > 0;

-- Update any other asset paths that might be incorrect
UPDATE properties 
SET brochures = ARRAY(
  SELECT REPLACE(unnest(brochures), '/src/assets/', '/')
) 
WHERE array_length(brochures, 1) > 0;