// API configuration for external backend
export const API_CONFIG = {
  // Use your deployed backend URL
  BACKEND_URL: 'https://your-backend.railway.app', // Replace with your actual backend URL
  
  // API endpoints
  ENDPOINTS: {
    CHAT: '/api/chat',
    GENERATE_RESPONSE: '/api/generate-response',
    VOICE_PROCESS: '/api/voice/process',
    // Add more endpoints as needed
  }
} as const;

// Helper function to make authenticated requests to your backend
export const makeBackendRequest = async (
  endpoint: string, 
  options: RequestInit = {},
  session: any
) => {
  const url = `${API_CONFIG.BACKEND_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.statusText}`);
  }
  
  return response.json();
};