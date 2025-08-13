import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get all users with analytics
    const users = await sql`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.subscription_status,
        u.subscription_expires,
        u.wordpress_user_id,
        u.created_at,
        u.updated_at,
        COUNT(ua.id) as login_count,
        MAX(ua.created_at) as last_login
      FROM users u
      LEFT JOIN user_analytics ua ON u.id = ua.user_id AND ua.action = 'login'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        subscription_expires: user.subscription_expires ? new Date(user.subscription_expires).toISOString() : null,
        created_at: new Date(user.created_at).toISOString(),
        updated_at: new Date(user.updated_at).toISOString(),
        last_login: user.last_login ? new Date(user.last_login).toISOString() : null
      }))
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, subscription_status, subscription_expires } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE username = ${username} OR email = ${email}
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUsers = await sql`
      INSERT INTO users (username, email, password_hash, subscription_status, subscription_expires)
      VALUES (
        ${username}, 
        ${email}, 
        crypt(${password}, gen_salt('bf')), 
        ${subscription_status || 'active'}, 
        ${subscription_expires ? new Date(subscription_expires) : null}
      )
      RETURNING *
    `;

    if (newUsers.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const newUser = newUsers[0];

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        subscription_status: newUser.subscription_status,
        subscription_expires: newUser.subscription_expires ? new Date(newUser.subscription_expires).toISOString() : null,
        created_at: new Date(newUser.created_at).toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
