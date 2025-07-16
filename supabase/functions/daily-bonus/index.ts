import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing daily bonus for user:', user.id)

    // Get current user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('last_login_date, calm_points')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const lastLoginDate = profile?.last_login_date
    
    console.log('Today:', today, 'Last login:', lastLoginDate)

    let pointsAwarded = 0
    
    // Check if it's a new day
    if (!lastLoginDate || lastLoginDate !== today) {
      // Award points and update date
      const newPoints = (profile?.calm_points || 0) + 10
      pointsAwarded = 10
      
      const { error: updateError } = await supabaseClient
        .from('user_profiles')
        .update({
          last_login_date: today,
          calm_points: newPoints
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update profile' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Daily bonus awarded:', pointsAwarded, 'points. New total:', newPoints)
    } else {
      console.log('User already received daily bonus today')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        pointsAwarded,
        isNewDay: pointsAwarded > 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})