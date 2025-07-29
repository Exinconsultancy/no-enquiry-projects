-- Update a user to admin role (replace the user_id with the actual user you want to make admin)
-- You can get user IDs from the profiles table query above

-- Example: Making the first user (cec6d976-57b0-46a9-8edc-8766a94d4027) an admin
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = 'cec6d976-57b0-46a9-8edc-8766a94d4027';

-- You can also create additional admin roles if needed
-- UPDATE profiles SET role = 'admin' WHERE display_name = 'Kunal';