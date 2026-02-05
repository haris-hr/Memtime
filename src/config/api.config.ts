// API Configuration
// Base URL and endpoints for the Memtime API
// Values are loaded from .env file (VITE_ prefix required for Vite)

/**
 * Environment Modes:
 * 
 * 1. PROXY MODE (Production/Vercel):
 *    - Set VITE_USE_PROXY=true
 *    - API_BASE_URL and API_KEY are set in Vercel (no VITE_ prefix)
 *    - Client-side only needs VITE_USE_PROXY
 * 
 * 2. DIRECT MODE (Development):
 *    - Set VITE_USE_PROXY=false or omit
 *    - Requires VITE_API_BASE_URL and VITE_API_KEY in .env
 *    - API key is bundled into client (not secure for production)
 */

// Check if using proxy mode
const useProxy = import.meta.env.VITE_USE_PROXY === 'true';

/**
 * Validates and returns API configuration.
 * Only validates in direct mode - proxy mode doesn't need client-side env vars.
 * Lazy validation - only throws when config is actually accessed.
 */
function getApiConfig() {
  // In proxy mode, these values aren't needed client-side
  if (useProxy) {
    return { baseUrl: '', apiKey: '' } as const;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const apiKey = import.meta.env.VITE_API_KEY as string;
  
  // Validate on first access (direct mode only)
  if (!baseUrl || !apiKey) {
    const missing: string[] = [];
    if (!baseUrl) missing.push('VITE_API_BASE_URL');
    if (!apiKey) missing.push('VITE_API_KEY');
    
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
      'Please create a .env file with these values. See README.md for details.'
    );
  }
  
  return { baseUrl, apiKey } as const;
}

// Cached config - lazily initialized on first access
let _cachedConfig: ReturnType<typeof getApiConfig> | null = null;

export const API_CONFIG = {
  get baseUrl(): string {
    if (!_cachedConfig) _cachedConfig = getApiConfig();
    return _cachedConfig.baseUrl;
  },
  get apiKey(): string {
    if (!_cachedConfig) _cachedConfig = getApiConfig();
    return _cachedConfig.apiKey;
  },
} as const;

// API Endpoints
export const ENDPOINTS = {
  clients: '/clients',
  projects: '/projects',
  tasks: '/tasks',
  timeEntries: '/time-entries',
} as const;
