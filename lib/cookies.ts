import { sql } from './database';

export interface CookieData {
  id?: number;
  email: string;
  cookie_name: string;
  cookie_value: string;
  domain: string;
  path: string;
  expires?: Date;
  secure: boolean;
  http_only: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export async function storeCookies(email: string, cookies: any[], domain: string = 'gale.udemy.com') {
  try {
    // First, delete existing cookies for this email
    await sql`
      DELETE FROM user_cookies WHERE email = ${email}
    `;

    // Insert new cookies
    for (const cookie of cookies) {
      await sql`
        INSERT INTO user_cookies (
          email, cookie_name, cookie_value, domain, path, 
          expires, secure, http_only, created_at
        ) VALUES (
          ${email}, ${cookie.name}, ${cookie.value}, ${domain}, ${cookie.path || '/'},
          ${cookie.expires ? new Date(cookie.expires * 1000) : null}, 
          ${cookie.secure || false}, ${cookie.httpOnly || false}, NOW()
        )
      `;
    }

    return { success: true, count: cookies.length };
  } catch (error) {
    console.error('Error storing cookies:', error);
    throw error;
  }
}

export async function getCookies(email: string, domain: string = 'gale.udemy.com') {
  try {
    const cookies = await sql`
      SELECT cookie_name, cookie_value, domain, path, expires, secure, http_only
      FROM user_cookies 
      WHERE email = ${email} AND domain = ${domain}
      ORDER BY created_at DESC
    `;

    return cookies.map(cookie => ({
      name: cookie.cookie_name,
      value: cookie.cookie_value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expires,
      secure: cookie.secure,
      httpOnly: cookie.http_only
    }));
  } catch (error) {
    console.error('Error retrieving cookies:', error);
    throw error;
  }
}

export async function deleteCookies(email: string, domain?: string) {
  try {
    if (domain) {
      await sql`
        DELETE FROM user_cookies WHERE email = ${email} AND domain = ${domain}
      `;
    } else {
      await sql`
        DELETE FROM user_cookies WHERE email = ${email}
      `;
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting cookies:', error);
    throw error;
  }
}
