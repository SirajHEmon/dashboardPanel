# 🐺 Wolf Edu Store Dashboard

A modern web application for managing users, subscriptions, and analytics with WordPress integration and NeonDB.

## 🚀 Features

- **User Management**: Create, view, edit, and delete users
- **Subscription Tracking**: Monitor subscription status and expiration dates
- **WordPress Integration**: Sync users from your WordPress site
- **Desktop App Authentication**: API-based login for your Electron app
- **Analytics Dashboard**: Track user activity and login statistics
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Database**: NeonDB (PostgreSQL)
- **Authentication**: JWT + API Keys
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- NeonDB account
- WordPress site with WooCommerce
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd webapp
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
# Database
NEON_DATABASE_URL=postgresql://username:password@host/database

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# WordPress
WORDPRESS_URL=https://your-site.com
WORDPRESS_CONSUMER_KEY=ck_your_consumer_key
WORDPRESS_CONSUMER_SECRET=cs_your_consumer_secret
```

### 3. Initialize Database

```bash
npm run db:init
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### 1. Create NeonDB Database

1. Go to [neon.tech](https://neon.tech)
2. Create account and new project
3. Copy connection string

### 2. Run Database Initialization

The app will automatically create tables on first run:

- `users` - User accounts and subscriptions
- `user_sessions` - Authentication sessions
- `user_analytics` - User activity tracking
- `subscriptions` - Subscription plans and history

## 🔐 Authentication

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`

### API Authentication
Desktop app uses API keys for authentication:

```javascript
// Example desktop app login
const response = await fetch('https://your-dashboard.vercel.app/api/desktop-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ api_key: 'wolf_abc123...' })
});
```

## 🌐 WordPress Integration

### 1. WooCommerce Setup
Ensure your WordPress site has:
- WooCommerce plugin
- REST API enabled
- Consumer key/secret generated

### 2. Sync Users
Click "Sync WordPress" button to:
- Import WordPress users
- Sync subscription data
- Update user analytics

## 📱 Desktop App Integration

### 1. Update Desktop App
Modify your Electron app to use the web API:

```javascript
// In renderer.js, replace local authentication with:
async authenticateUser(username, password) {
  try {
    const response = await fetch('https://your-dashboard.vercel.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    if (data.success) {
      // Store API key for future requests
      localStorage.setItem('wolfEduApiKey', data.user.api_key);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}
```

### 2. API Key Usage
Use the stored API key for authenticated requests:

```javascript
const apiKey = localStorage.getItem('wolfEduApiKey');
const response = await fetch('https://your-dashboard.vercel.app/api/desktop-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ api_key: apiKey })
});
```

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables
4. Deploy!

### 3. Environment Variables in Vercel
Add these in your Vercel project settings:
- `NEON_DATABASE_URL`
- `JWT_SECRET`
- `WORDPRESS_URL`
- `WORDPRESS_CONSUMER_KEY`
- `WORDPRESS_CONSUMER_SECRET`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/desktop-auth` - Desktop app authentication

### Users
- `GET /api/users` - Get all users (requires JWT)
- `POST /api/users` - Create new user (requires JWT)

### WordPress Sync
- `POST /api/sync-wordpress` - Sync WordPress users (requires JWT)

## 🔧 Development

### Project Structure
```
webapp/
├── app/                    # Next.js app directory
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── lib/             # Utilities and database
│   └── globals.css      # Global styles
├── components/           # Shared components
├── lib/                 # Database and auth utilities
└── package.json         # Dependencies
```

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme colors
- Update `globals.css` for custom styles
- Use Tailwind utility classes throughout

### Components
- Edit components in `components/` directory
- Add new pages in `app/` directory
- Create new API routes in `app/api/`

## 🔒 Security Features

- JWT token authentication
- API key validation
- Password hashing with bcrypt
- Session management
- Rate limiting (can be added)
- CORS protection

## 📈 Analytics Features

- User login tracking
- Subscription status monitoring
- Activity logging
- WordPress sync statistics
- Real-time dashboard updates

## 🆘 Support

### Common Issues

1. **Database Connection Error**
   - Check `NEON_DATABASE_URL` format
   - Ensure database is accessible

2. **WordPress Sync Fails**
   - Verify consumer key/secret
   - Check WordPress REST API access
   - Ensure WooCommerce is active

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

### Getting Help
- Check browser console for errors
- Verify environment variables
- Test API endpoints with Postman
- Check Vercel deployment logs

## 🚀 Future Enhancements

- [ ] User roles and permissions
- [ ] Advanced analytics charts
- [ ] Email notifications
- [ ] Payment integration
- [ ] Multi-tenant support
- [ ] Mobile app
- [ ] Webhook support
- [ ] Advanced reporting

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ for Wolf Edu Store
