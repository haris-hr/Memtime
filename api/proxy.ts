import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Proxy Function
 * 
 * This function acts as a secure proxy between the frontend and the Memtime API.
 * The API key is stored server-side in Vercel environment variables, keeping it
 * hidden from client-side JavaScript bundles.
 * 
 * How it works:
 * 1. Frontend makes requests to /api/proxy?path=/clients (or any endpoint)
 * 2. This function forwards the request to the actual API with the Bearer token
 * 3. Response is returned to the frontend
 * 
 * Security benefits:
 * - API key never exposed to browsers
 * - Can add rate limiting, logging, or request validation here
 * - Can revoke/rotate keys without redeploying frontend
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the target path from query parameter
  const targetPath = req.query.path as string;
  
  if (!targetPath) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // Server-side environment variables (no VITE_ prefix)
  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!apiBaseUrl || !apiKey) {
    console.error('Missing API_BASE_URL or API_KEY environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Build the full URL by concatenating base URL and target path
  // Remove trailing slash from base and leading slash from path to avoid double slashes
  const baseUrl = apiBaseUrl.replace(/\/$/, '');
  const path = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  const fullUrl = `${baseUrl}${path}`;
  
  const url = new URL(fullUrl);
  
  // Forward any additional query parameters
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== 'path' && typeof value === 'string') {
      url.searchParams.append(key, value);
    }
  });

  console.log(`[Proxy] ${req.method} ${url.toString()}`);

  try {
    const response = await fetch(url.toString(), {
      method: req.method || 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Only include body for methods that support it
      ...(req.method !== 'GET' && req.method !== 'HEAD' && req.body
        ? { body: JSON.stringify(req.body) }
        : {}),
    });

    // Handle rate limiting with a friendly message
    if (response.status === 429) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait a moment and try again.' 
      });
    }

    // Handle empty responses (e.g., 204 No Content from DELETE)
    const text = await response.text();
    
    // Try to parse as JSON, fall back to returning the raw error
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // Response isn't JSON - could be an error page or plain text
        console.error('Non-JSON response:', text.substring(0, 200));
        return res.status(response.status).json({ 
          error: response.ok ? 'Unexpected response format' : (text.substring(0, 100) || 'Server error')
        });
      }
    }
    
    // Forward the status code and response
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(502).json({ 
      error: 'Unable to connect to the server. Please try again.' 
    });
  }
}
