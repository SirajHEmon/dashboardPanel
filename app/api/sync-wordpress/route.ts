import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { sql } from '@/lib/database';
import { getWordPressUsers, getWooCommerceOrders } from '@/lib/wordpress';

export async function POST(request: NextRequest) {
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

    // Get WordPress users
    const wpUsers = await getWordPressUsers();
    let syncedCount = 0;

    for (const wpUser of wpUsers) {
      try {
        // Check if user already exists
        const existingUsers = await sql`
          SELECT id FROM users WHERE wordpress_user_id = ${wpUser.id}
        `;

        if (existingUsers.length === 0) {
          // Create new user from WordPress
          const newUsers = await sql`
            INSERT INTO users (username, email, password_hash, wordpress_user_id, subscription_status)
            VALUES (
              ${wpUser.username}, 
              ${wpUser.email}, 
              crypt('temp_password_123', gen_salt('bf')), 
              ${wpUser.id}, 
              'active'
            )
            RETURNING id
          `;

          if (newUsers.length > 0) {
            syncedCount++;
            
            // Log the sync action
            await sql`
              INSERT INTO user_analytics (user_id, action, details, ip_address)
              VALUES (${newUsers[0].id}, 'wordpress_sync', '{"source": "wordpress", "wp_user_id": ${wpUser.id}}', ${request.ip || 'unknown'})
            `;
          }
        }
      } catch (error) {
        console.error(`Error syncing user ${wpUser.username}:`, error);
        // Continue with other users
      }
    }

    // Get WooCommerce orders for subscription data
    try {
      const orders = await getWooCommerceOrders();
      
      for (const order of orders) {
        if (order.status === 'completed') {
          // Update user subscription based on order
          await sql`
            UPDATE users 
            SET subscription_status = 'active', 
                subscription_expires = NOW() + INTERVAL '1 year',
                updated_at = CURRENT_TIMESTAMP
            WHERE wordpress_user_id = ${order.customer_id}
          `;
        }
      }
    } catch (error) {
      console.error('Error syncing WooCommerce orders:', error);
    }

    return NextResponse.json({
      success: true,
      count: syncedCount,
      message: `Successfully synced ${syncedCount} users from WordPress`
    });

  } catch (error) {
    console.error('WordPress sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
