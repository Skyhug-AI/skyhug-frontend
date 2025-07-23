// Configuration for external backend API
export const BACKEND_CONFIG = {
  // Local development backend URL
  BASE_URL: 'http://127.0.0.1:8000',
  
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