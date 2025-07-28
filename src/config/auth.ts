
// Security Notice: This file has been deprecated for security reasons
// Hardcoded secrets and client-side authentication have been removed
// Please use the new SecureAuthService and environment variables for production

export const AUTH_CONFIG = {
  // Note: Google Client ID would need to be configured separately for production
  // This is a placeholder - in production, use proper environment configuration
  GOOGLE_CLIENT_ID: "your-google-client-id", // Remove process.env to fix browser compatibility
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true
};
