// Configuration for external backend API
export const BACKEND_CONFIG = {
  // Replace with your deployed backend URL
  BASE_URL: 'https://your-backend.railway.app',
  
  // API endpoints
  ENDPOINTS: {
    CHAT: '/api/chat',
    VOICE_PROCESS: '/api/voice/process',
    AI_GENERATE: '/api/ai/generate',
  } as const
} as const;

// Helper to make authenticated requests to your backend
export const callBackendAPI = async (
  endpoint: string, 
  data: any,
  accessToken: string
) => {
  const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Backend API error: ${response.statusText}`);
  }
  
  return response.json();
};