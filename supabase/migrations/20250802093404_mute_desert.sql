/*
  # Remove password_hash column from users table

  1. Changes
    - Remove `password_hash` column from `users` table
    - This column is not needed when using Supabase Auth as passwords are handled by the auth system

  2. Security
    - Passwords are securely managed by Supabase Auth in the `auth.users` table
    - No need to store password hashes in our custom users table
*/

-- Remove the password_hash column as it's not needed with Supabase Auth
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;