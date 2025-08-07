// API Configuration for different environments
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  doctors: `${API_BASE_URL}/doctors`,
  appointments: `${API_BASE_URL}/appointments`,
  slots: `${API_BASE_URL}/slots`,
  patients: `${API_BASE_URL}/patients`,
  prescriptions: `${API_BASE_URL}/prescriptions`,
} as const;

// Fallback configuration
export const FALLBACK_CONFIG = {
  useLocalStorageOnly: false,
  enableOfflineMode: true,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Check API health
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
};

// Fetch with retry logic
export const fetchWithRetry = async (
  url: string, 
  options: RequestInit = {}, 
  retries: number = FALLBACK_CONFIG.retryAttempts
): Promise<Response> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      if (response.ok) {
        return response;
      }
      
      // If not the last attempt, wait before retrying
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, FALLBACK_CONFIG.retryDelay));
      }
    } catch (error) {
      console.warn(`Fetch attempt ${attempt} failed:`, error);
      
      // If not the last attempt, wait before retrying
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, FALLBACK_CONFIG.retryDelay));
      }
    }
  }
  
  // If all retries failed, throw an error
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}; 