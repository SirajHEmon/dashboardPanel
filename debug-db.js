const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function debugDatabase() {
  try {
    console.log('🔍 Debugging Database Connection...');
    
    // Check environment variables
    console.log('Environment Variables:');
    console.log('NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    
    // Test database connection
    const sql = neon(process.env.NEON_DATABASE_URL);
    console.log('✅ Database connection successful');
    
    // Check users table
    const users = await sql`SELECT id, username, email, subscription_status, created_at FROM users`;
    console.log('\n📋 Users in database:');
    console.log(users);
    
    // Check if admin user exists
    const adminUser = await sql`SELECT id, username, email FROM users WHERE username = 'admin'`;
    console.log('\n👤 Admin user:');
    console.log(adminUser);
    
    // Test password verification
    if (adminUser.length > 0) {
      const bcrypt = require('bcryptjs');
      const testPassword = 'admin123';
      const storedHash = await sql`SELECT password_hash FROM users WHERE username = 'admin'`;
      
      if (storedHash.length > 0) {
        const isValid = await bcrypt.compare(testPassword, storedHash[0].password_hash);
        console.log('\n🔐 Password test:');
        console.log('Test password:', testPassword);
        console.log('Stored hash:', storedHash[0].password_hash.substring(0, 20) + '...');
        console.log('Password valid:', isValid ? '✅ YES' : '❌ NO');
      }
    }
    
  } catch (error) {
    console.error('❌ Database debug error:', error);
  }
}

debugDatabase();
