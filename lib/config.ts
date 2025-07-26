// API Configuration for different environments
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  doctors: `${API_BASE_URL}/doctors`,
  appointments: `${API_BASE_URL}/appointments`,
  slots: `${API_BASE_URL}/slots`,
  patients: `${API_BASE_URL}/patients`,
} as const; 