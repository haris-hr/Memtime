import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { ERROR_MESSAGES, STATUS_ERROR_MAP } from '../config/error-messages';
import { ApiError } from './errors';

/**
 * API Client Configuration
 * 
 * This client supports two modes:
 * 
 * 1. PROXY MODE (Production/Vercel) - Recommended
 *    - Requests go to /api/proxy which forwards to the real API
 *    - API key is stored server-side, never exposed to browsers
 *    - Set VITE_USE_PROXY=true in .env
 * 
 * 2. DIRECT MODE (Development)
 *    - Requests go directly to the API with Bearer token in headers
 *    - API key is bundled into client JS (not secure for production)
 *    - Set VITE_USE_PROXY=false or omit it
 * 
 * CSRF Protection: Bearer tokens aren't auto-sent by browsers (inherently safe).
 * If switching to cookie-based auth, implement CSRF tokens.
 */

// Check if we should use the proxy (production) or direct API (development)
const useProxy = import.meta.env.VITE_USE_PROXY === 'true';

export const apiClient = axios.create({
  baseURL: useProxy ? '/api/proxy' : API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    // Only include Authorization header in direct mode
    ...(useProxy ? {} : { 'Authorization': `Bearer ${API_CONFIG.apiKey}` }),
  },
});

// Request interceptor: transform requests for proxy mode
if (useProxy) {
  apiClient.interceptors.request.use((config) => {
    // Move the endpoint path to a query parameter for the proxy
    // e.g., GET /clients becomes GET /api/proxy?path=/clients
    const originalPath = config.url || '';
    config.params = {
      ...config.params,
      path: originalPath,
    };
    config.url = '';
    return config;
  });
}

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = STATUS_ERROR_MAP[status] 
        || error.response.data?.error 
        || ERROR_MESSAGES.generic;
      
      return Promise.reject(ApiError.fromResponse(status, message));
    }
    
    // Network error
    return Promise.reject(ApiError.networkError(ERROR_MESSAGES.networkError));
  }
);

export default apiClient;
