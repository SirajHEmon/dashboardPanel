import axios from 'axios';

const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://wolfedustore.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

export interface WordPressUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
  date_created: string;
}

export interface WordPressOrder {
  id: number;
  customer_id: number;
  status: string;
  total: string;
  date_created: string;
  line_items: any[];
}

export async function getWordPressUsers(): Promise<WordPressUser[]> {
  try {
    const response = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/users`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 100
      }
    });
    
    return response.data.map((user: any) => ({
      id: user.id,
      username: user.slug,
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      roles: user.roles || [],
      date_created: user.date
    }));
  } catch (error) {
    console.error('Error fetching WordPress users:', error);
    return [];
  }
}

export async function getWordPressUserById(userId: number): Promise<WordPressUser | null> {
  try {
    const response = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/users/${userId}`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET
      }
    });
    
    return {
      id: response.data.id,
      username: response.data.slug,
      email: response.data.email || '',
      first_name: response.data.first_name || '',
      last_name: response.data.last_name || '',
      roles: response.data.roles || [],
      date_created: response.data.date
    };
  } catch (error) {
    console.error('Error fetching WordPress user:', error);
    return null;
  }
}

export async function getWooCommerceOrders(): Promise<WordPressOrder[]> {
  try {
    const response = await axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/orders`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 100,
        status: 'completed'
      }
    });
    
    return response.data.map((order: any) => ({
      id: order.id,
      customer_id: order.customer_id,
      status: order.status,
      total: order.total,
      date_created: order.date_created,
      line_items: order.line_items || []
    }));
  } catch (error) {
    console.error('Error fetching WooCommerce orders:', error);
    return [];
  }
}

export async function syncWordPressUsers(): Promise<{ success: boolean; count: number }> {
  try {
    const wpUsers = await getWordPressUsers();
    let syncedCount = 0;
    
    for (const wpUser of wpUsers) {
      // Check if user exists in our database
      const existingUser = await getUserByWordPressId(wpUser.id);
      
      if (!existingUser) {
        // Create new user
        const success = await createUserFromWordPress(wpUser);
        if (success) syncedCount++;
      }
    }
    
    return { success: true, count: syncedCount };
  } catch (error) {
    console.error('Error syncing WordPress users:', error);
    return { success: false, count: 0 };
  }
}

async function getUserByWordPressId(wpUserId: number) {
  // This would be implemented in your database layer
  // For now, returning null
  return null;
}

async function createUserFromWordPress(wpUser: WordPressUser) {
  // This would be implemented in your database layer
  // For now, returning true
  return true;
}
