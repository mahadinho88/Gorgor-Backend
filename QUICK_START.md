# ⚡ QUICK START - Get Backend Running in 5 Minutes

## Option 1: MongoDB Atlas (Easiest - No Installation)

### Step 1: Create Free MongoDB Database
1. Visit: **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"**
3. Sign up with Google/Email
4. Choose **FREE** M0 cluster
5. Select **AWS** → **US East** region
6. Click **"Create Cluster"**

### Step 2: Configure Database Access
1. Click **"Database Access"** (left menu)
2. Click **"Add New Database User"**
3. Username: `gorgor_admin`
4. Password: Click **"Autogenerate Secure Password"** → **SAVE THIS!**
5. Click **"Add User"**

### Step 3: Configure Network Access
1. Click **"Network Access"** (left menu)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** → `0.0.0.0/0`
4. Click **"Confirm"**

### Step 4: Get Connection String
1. Click **"Database"** (left menu)
2. Click **"Connect"** button
3. Choose **"Connect your application"**
4. **Driver**: Node.js, **Version**: 5.5 or later
5. **Copy the connection string**

It will look like:
```
mongodb+srv://gorgor_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 5: Update Backend .env File
```bash
cd /Users/abdifatahosmanmohamed/Gorgor/backend
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://gorgor_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/gorgor?retryWrites=true&w=majority
JWT_SECRET=gorgor-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:19006,http://localhost:8081,http://localhost:3000
```

**IMPORTANT**: Replace `YOUR_PASSWORD_HERE` with the password you saved!

### Step 6: Start Backend Server
```bash
cd /Users/abdifatahosmanmohamed/Gorgor/backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 GAD AMA GADO Backend Server Running!
📡 Port: 5000
```

### Step 7: Update Frontend API URL
```bash
cd /Users/abdifatahosmanmohamed/Gorgor
```

Edit `src/services/api.js`:
```javascript
const USE_MOCK_API = false;
const API_BASE_URL = 'http://localhost:5000/api/v1';
```

### Step 8: Test It!
Open your app and try:
1. **Register** a new account
2. **Login** with that account
3. **Post an ad**

**DONE! 🎉**

---

## Option 2: Local MongoDB (If You Want Local Database)

### Step 1: Install MongoDB
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community@7.0
```

### Step 2: Start MongoDB
```bash
brew services start mongodb-community@7.0
```

### Step 3: Verify Installation
```bash
mongosh
```

If it connects, MongoDB is running!

### Step 4: Start Backend
```bash
cd /Users/abdifatahosmanmohamed/Gorgor/backend
npm run dev
```

---

## 🔥 If Backend Won't Start

### Problem: "Cannot find module 'express'"
**Solution:**
```bash
cd /Users/abdifatahosmanmohamed/Gorgor/backend
npm install
```

### Problem: "MongoDB connection error"
**Solution:**
- Check your MongoDB Atlas connection string
- Make sure password has no special characters (or URL encode them)
- Verify IP whitelist includes `0.0.0.0/0`

### Problem: "Port 5000 already in use"
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

Or change port in `.env`:
```env
PORT=5001
```

---

## 🧪 Test the API

### Using curl:
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phoneNumber": "+252612345678",
    "password": "test123",
    "region": "Banaadir",
    "district": "Mogadishu"
  }'
```

---

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Connection string copied
- [ ] `.env` file updated
- [ ] Backend running (`npm run dev`)
- [ ] Frontend API URL updated
- [ ] Successfully registered/logged in

**All checked? You're ready to rock! 🚀**
