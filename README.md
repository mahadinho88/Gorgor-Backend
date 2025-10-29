# 🚀 GAD AMA GADO Backend API

Professional REST API for the GAD AMA GADO marketplace platform.

## ✅ Setup Complete!

All backend files have been created successfully. Here's what we have:

### 📁 Project Structure
```
backend/
├── server.js          # Main server file
├── models/
│   ├── User.js       # User model
│   └── Ad.js         # Ad model
├── routes/
│   ├── auth.js       # Authentication routes
│   ├── users.js      # User routes
│   └── ads.js        # Ad routes
├── middleware/
│   └── auth.js       # JWT authentication middleware
├── .env              # Environment variables
└── package.json      # Dependencies
```

## 🗄️ Database Options

### Option 1: MongoDB Atlas (Recommended - FREE Cloud Database)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign up** for free account
3. **Create a new cluster** (Free tier - M0)
4. **Create database user** (username + password)
5. **Whitelist IP**: Add `0.0.0.0/0` for development
6. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

7. **Update `.env` file**:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gorgor?retryWrites=true&w=majority
```

### Option 2: Local MongoDB

Install MongoDB locally (if you prefer):
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

Keep the default `.env` setting:
```env
MONGODB_URI=mongodb://localhost:27017/gorgor-marketplace
```

## 🚀 Running the Backend

### Start Development Server:
```bash
cd backend
npm run dev
```

### Start Production Server:
```bash
cd backend
npm start
```

The server will run on: **http://localhost:5000**

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Ads
- `GET /api/v1/ads` - Get all ads
- `GET /api/v1/ads/featured` - Get featured ads
- `GET /api/v1/ads/:id` - Get single ad
- `POST /api/v1/ads` - Create new ad (requires auth)
- `PUT /api/v1/ads/:id` - Update ad (requires auth)
- `DELETE /api/v1/ads/:id` - Delete ad (requires auth)
- `GET /api/v1/ads/my-ads` - Get user's ads (requires auth)
- `PATCH /api/v1/ads/:id/sold` - Mark as sold (requires auth)

### Users
- `GET /api/v1/users/profile` - Get user profile (requires auth)
- `PUT /api/v1/users/profile` - Update profile (requires auth)
- `GET /api/v1/users/favorites` - Get favorites (requires auth)
- `POST /api/v1/users/favorites` - Add favorite (requires auth)
- `DELETE /api/v1/users/favorites/:adId` - Remove favorite (requires auth)
- `GET /api/v1/users/recently-viewed` - Get recently viewed (requires auth)
- `POST /api/v1/users/recently-viewed` - Add recently viewed (requires auth)

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:19006,http://localhost:8081
```

## ✅ Next Steps

1. **Set up MongoDB Atlas** (or install MongoDB locally)
2. **Update `.env` with MongoDB connection string**
3. **Run the backend**: `npm run dev`
4. **Update frontend API URL** in `src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api/v1';
   const USE_MOCK_API = false;
   ```
5. **Test the app!**

## 🌐 Deployment Ready

This backend is ready to deploy to:
- **Render** (recommended for free tier)
- **Heroku**
- **Railway**
- **DigitalOcean**
- **AWS**

---

## 🎉 You're All Set!

Your backend is production-ready with:
- ✅ User authentication (JWT)
- ✅ Ad management
- ✅ User profiles
- ✅ Favorites & recently viewed
- ✅ MongoDB integration
- ✅ Error handling
- ✅ Security middleware
- ✅ CORS configured

**Ready to launch! 🚀**
