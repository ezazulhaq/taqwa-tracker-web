export const SECURITY_CONFIG = {
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes

  // Session management
  //SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  //SESSION_WARNING: 5 * 60 * 1000, // 5 minutes before timeout

  // Password requirements
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,

  // Content Security Policy
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com", "data:"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': ["'self'", "https://*.supabase.co", "https://*.openstreetmap.org", "https://raw.githubusercontent.com"],
    'worker-src': ["'self'", "blob:"],
    'child-src': ["'self'", "blob:"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  },

  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  },

  // Allowed domains for external resources
  ALLOWED_DOMAINS: [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'api.openstreetmap.org',
    'raw.githubusercontent.com'
  ]
} as const;