const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.NEON_DATABASE_URL);

async function initDatabase() {
  try {
    console.log('🚀 Initializing Wolf Edu Store Database...');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        subscription_status VARCHAR(20) DEFAULT 'active',
        subscription_expires TIMESTAMP,
        wordpress_user_id INTEGER,
        api_key VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created');

    // Create user_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ User sessions table created');

    // Create user_analytics table
    await sql`
      CREATE TABLE IF NOT EXISTS user_analytics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ User analytics table created');

                // Create subscriptions table
            await sql`
              CREATE TABLE IF NOT EXISTS subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                plan_name VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'active',
                start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                end_date TIMESTAMP,
                price DECIMAL(10,2),
                features JSONB
              )
            `;
            console.log('✅ Subscriptions table created');

            // Create user_cookies table
            await sql`
              CREATE TABLE IF NOT EXISTS user_cookies (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                cookie_name VARCHAR(255) NOT NULL,
                cookie_value TEXT NOT NULL,
                domain VARCHAR(255) NOT NULL,
                path VARCHAR(255) DEFAULT '/',
                expires TIMESTAMP,
                secure BOOLEAN DEFAULT false,
                http_only BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )
            `;
            console.log('✅ User cookies table created');

    // Create admin user
    const adminUsers = await sql`
      SELECT id FROM users WHERE username = 'admin'
    `;

    if (adminUsers.length === 0) {
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('admin123', 12);
      const apiKey = 'wolf_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      await sql`
        INSERT INTO users (username, email, password_hash, api_key, subscription_status)
        VALUES ('admin', 'admin@wolfedustore.com', ${passwordHash}, ${apiKey}, 'active')
      `;
      console.log('✅ Admin user created (admin / admin123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Create .env.local file with your environment variables');
    console.log('2. Run: npm run dev');
    console.log('3. Visit: http://localhost:3000');
    console.log('4. Login with: admin / admin123');

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

initDatabase();
