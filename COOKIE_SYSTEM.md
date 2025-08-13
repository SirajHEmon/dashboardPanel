# 🍪 **Cookie Management System**

## **Overview**
Instead of fetching cookies from GitHub, you can now store and manage cookies directly in your dashboard database. This provides better security and easier management.

## **Features**
- ✅ **Store cookies per email/domain**
- ✅ **Secure database storage**
- ✅ **Easy JSON file upload via dashboard**
- ✅ **Drag & drop file support**
- ✅ **JSON preview and validation**
- ✅ **No more GitHub dependency**
- ✅ **Manage cookies for multiple users**

## **How to Use**

### **1. Upload Cookies via Dashboard**
1. Login to your dashboard
2. Click **"🍪 Cookie Management"** section
3. Click **"Upload Cookies"** button
4. Fill in:
   - **Email**: The user's email address
   - **Domain**: Target website (default: gale.udemy.com)
   - **Cookie JSON File**: Upload your JSON file (drag & drop or click to browse)

### **2. API Endpoints**
- **POST** `/api/cookies` - Upload cookies
- **GET** `/api/cookies?email=user@example.com` - Get cookies
- **DELETE** `/api/cookies?email=user@example.com` - Delete cookies

### **3. Cookie Format**
```json
[
  {
    "name": "cookie_name",
    "value": "cookie_value",
    "domain": "gale.udemy.com",
    "path": "/",
    "expires": 1234567890,
    "secure": false,
    "httpOnly": false
  }
]
```

## **Benefits Over GitHub System**
- 🔒 **More Secure** - No external API calls
- ⚡ **Faster** - Direct database access
- 🎯 **User-specific** - Cookies tied to specific emails
- 📊 **Trackable** - See who has what cookies
- 🚫 **No Rate Limits** - Unlimited cookie storage

## **Database Schema**
```sql
CREATE TABLE user_cookies (
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
);
```

## **Next Steps**
1. **Update your desktop app** to use the new cookie API
2. **Test cookie upload** via the dashboard
3. **Verify cookies are stored** correctly
4. **Use stored cookies** for auto-login

---

**🎉 Your cookie system is now fully integrated into the dashboard!**
