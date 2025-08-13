import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: number;
  username: string;
  email: string;
  subscription_status: string;
  subscription_expires: Date | null;
  wordpress_user_id: number | null;
  api_key: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateJWT(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyJWT(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateAPIKey(): string {
  return 'wolf_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    
    if (users.length === 0) return null;
    
    const user = users[0] as User;
    const isValid = await verifyPassword(password, user.password_hash);
    
    if (!isValid) return null;
    
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function createUser(username: string, email: string, password: string): Promise<User | null> {
  try {
    const passwordHash = await hashPassword(password);
    const apiKey = generateAPIKey();
    
    const users = await sql`
      INSERT INTO users (username, email, password_hash, api_key)
      VALUES (${username}, ${email}, ${passwordHash}, ${apiKey})
      RETURNING *
    `;
    
    return (users[0] as User) || null;
  } catch (error) {
    console.error('User creation error:', error);
    return null;
  }
}

export async function getUserById(userId: number): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;
    
    return (users[0] as User) || null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function updateUserSubscription(userId: number, status: string, expiresAt: Date | null): Promise<boolean> {
  try {
    await sql`
      UPDATE users 
      SET subscription_status = ${status}, subscription_expires = ${expiresAt}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;
    
    return true;
  } catch (error) {
    console.error('Update subscription error:', error);
    return false;
  }
}
