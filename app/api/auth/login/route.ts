import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateJWT } from '@/lib/auth';
import { sql } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await authenticateUser(username, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateJWT(user.id);

    // Create session
    await sql`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (${user.id}, ${token}, NOW() + INTERVAL '24 hours')
    `;

    // Log analytics
    await sql`
      INSERT INTO user_analytics (user_id, action, details, ip_address)
      VALUES (${user.id}, 'login', '{"method": "api"}', ${request.ip || 'unknown'})
    `;

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        subscription_status: user.subscription_status,
        subscription_expires: user.subscription_expires,
        api_key: user.api_key
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
