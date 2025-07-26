
// Note: In production, these should be environment variables
export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: "1050975767842-ldi4qkv8blf1qv2p2vf8qdthrf8h4s5m.apps.googleusercontent.com", // Updated with a working test client ID
  JWT_SECRET: "your-jwt-secret-key-change-in-production", // Replace with a secure secret
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
