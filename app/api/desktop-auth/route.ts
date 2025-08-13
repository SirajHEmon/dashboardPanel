import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { api_key } = await request.json();

    if (!api_key) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Find user by API key
    const users = await sql`
      SELECT * FROM users WHERE api_key = ${api_key}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check subscription status
    if (user.subscription_status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription expired or inactive' },
        { status: 403 }
      );
    }

    // Check if subscription has expired
    if (user.subscription_expires && new Date(user.subscription_expires) < new Date()) {
      return NextResponse.json(
        { error: 'Subscription has expired' },
        { status: 403 }
      );
    }

    // Log desktop app access
    await sql`
      INSERT INTO user_analytics (user_id, action, details, ip_address)
      VALUES (${user.id}, 'desktop_app_access', '{"app": "wolf-edu-desktop"}', ${request.ip || 'unknown'})
    `;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        subscription_status: user.subscription_status,
        subscription_expires: user.subscription_expires
      }
    });

  } catch (error) {
    console.error('Desktop auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
