# 🚀 Deployment Guide - Wolf Edu Store Dashboard

## 📋 Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account
- [NeonDB](https://neon.tech) database (already set up!)
- WordPress site with WooCommerce

## 🗄️ Database Setup

Your NeonDB is already configured with:
- **Connection String**: `postgresql://neondb_owner:npg_ephIixRcv56a@ep-jolly-sound-abj98uws-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Database**: `neondb`
- **Region**: `eu-west-2`

## 🚀 Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Wolf Edu Store Dashboard"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project settings:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `webapp` (if your repo has multiple folders)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Add Environment Variables

In your Vercel project settings, add these environment variables:

```env
# Database
NEON_DATABASE_URL=postgresql://neondb_owner:npg_ephIixRcv56a@ep-jolly-sound-abj98uws-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret (generate a strong one!)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# WordPress
WORDPRESS_URL=https://wolfedustore.com
WORDPRESS_CONSUMER_KEY=ck_9c455553baa4710e58fd2c7477665566c1f8b9f5
WORDPRESS_CONSUMER_SECRET=cs_26ffa4ef90ed32da39b41b10e35616621f5160c3

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### 4. Deploy!

Click **"Deploy"** and wait for the build to complete.

## 🔧 Post-Deployment Setup

### 1. Initialize Database

After deployment, visit your app and the database will be automatically initialized on first run.

### 2. Test the Dashboard

- Visit your deployed URL
- Login with: `admin` / `admin123`
- Test WordPress sync functionality

### 3. Update Desktop App

Update your Electron app's `renderer.js` to use the new web API:

```javascript
// Replace the local authentication with:
async authenticateUser(username, password) {
  try {
    const response = await fetch('https://your-app.vercel.app/api/auth/login', {
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

## 🌐 Custom Domain (Optional)

1. **In Vercel**: Go to your project → Settings → Domains
2. **Add your domain**: `dashboard.wolfedustore.com`
3. **Update DNS**: Add the CNAME record provided by Vercel
4. **Update environment variables** with your custom domain

## 📊 Monitoring & Analytics

### Vercel Analytics
- Built-in performance monitoring
- Real-time analytics
- Error tracking

### Database Monitoring
- NeonDB provides built-in monitoring
- Check connection pool usage
- Monitor query performance

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Environment variables are set in Vercel
- [ ] Database connection uses SSL
- [ ] API endpoints are protected
- [ ] CORS is configured (if needed)

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check build logs in Vercel

2. **Database Connection Error**
   - Verify NEON_DATABASE_URL is correct
   - Check if database is accessible
   - Verify SSL settings

3. **WordPress Sync Fails**
   - Check consumer key/secret
   - Verify WordPress REST API access
   - Check CORS settings

### Getting Help

- **Vercel Logs**: Check deployment and function logs
- **Database Logs**: Check NeonDB console
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Verify API calls

## 🚀 Next Steps

After successful deployment:

1. **Test all functionality**
2. **Set up monitoring**
3. **Configure backups** (NeonDB has automatic backups)
4. **Set up CI/CD** for automatic deployments
5. **Add custom domain**
6. **Implement advanced features**

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **NeonDB Docs**: [neon.tech/docs](https://neon.tech/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

🎉 **Congratulations!** Your Wolf Edu Store Dashboard is now live and ready to manage users and subscriptions!
