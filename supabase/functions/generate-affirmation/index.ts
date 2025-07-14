import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get today's date to use as seed for consistency
    const today = new Date().toDateString();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate therapy assistant. Generate a single, meaningful daily affirmation for someone working on their mental health journey. The affirmation should be:
            - Supportive and encouraging
            - Focused on self-compassion, growth, or healing
            - Personal and relatable
            - Not overly complex or abstract
            - Suitable for someone dealing with anxiety, depression, or general mental health challenges
            
            Return only the affirmation text, without quotes or extra formatting. Make it feel personal and genuine.
            
            Use this date as inspiration but keep it timeless: ${today}`
          },
          {
            role: 'user',
            content: 'Generate a daily affirmation for someone on their mental health journey.'
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate affirmation');
    }

    const data = await response.json();
    const affirmation = data.choices[0].message.content.trim();

    console.log('Generated affirmation:', affirmation);

    return new Response(JSON.stringify({ 
      affirmation,
      date: today 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-affirmation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});