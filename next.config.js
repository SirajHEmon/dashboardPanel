/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    WORDPRESS_URL: process.env.WORDPRESS_URL,
    WORDPRESS_CONSUMER_KEY: process.env.WORDPRESS_CONSUMER_KEY,
    WORDPRESS_CONSUMER_SECRET: process.env.WORDPRESS_CONSUMER_SECRET,
  },
}

module.exports = nextConfig
