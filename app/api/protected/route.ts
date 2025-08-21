import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { apiKey } = body;

    // Validate input
    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Trim whitespace
    const trimmedApiKey = apiKey.trim();

    // Basic format validation (should start with 'rot-')
    if (!trimmedApiKey.startsWith('rot-')) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 401 }
      );
    }

    // Query Supabase to validate the API key
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, is_active, usage, monthly_limit')
      .eq('key', trimmedApiKey)
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // If no rows found, the API key doesn't exist
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      
      // Other database errors
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    // Check if the API key is active
    if (!data.is_active) {
      return NextResponse.json(
        { error: 'API key is disabled' },
        { status: 401 }
      );
    }

    // Check if usage limit is exceeded
    if (data.usage >= data.monthly_limit) {
      return NextResponse.json(
        { error: 'API key usage limit exceeded' },
        { status: 429 }
      );
    }

    // API key is valid - return success response
    return NextResponse.json(
      {
        message: 'API key is valid',
        data: {
          keyId: data.id,
          keyName: data.name,
          usage: data.usage,
          monthlyLimit: data.monthly_limit,
          remainingRequests: data.monthly_limit - data.usage
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json(
    { message: 'Protected endpoint - POST an API key to validate access' },
    { status: 200 }
  );
}