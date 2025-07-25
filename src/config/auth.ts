
// Note: In production, these should be environment variables
export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: "your-google-client-id.apps.googleusercontent.com", // Replace with your actual Google Client ID
  JWT_SECRET: "your-jwt-secret-key", // Replace with a secure secret
  TOKEN_EXPIRY: "1h",
  REFRESH_TOKEN_EXPIRY: "7d"
};

export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true
};
