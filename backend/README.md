# 🎁 PuzzleChain - Mystery Box Backend

A secure and scalable mystery box system built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication** - JWT-based auth with registration and login
- **Points System** - Earn 5% points on every purchase
- **Box Opening** - Open mystery boxes using earned points (FREE!)
- **Prize System** - Win real products from boxes
- **Purchase System** - Buy products and earn points back

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Boxes
- `GET /api/box` - Get all boxes
- `POST /api/box/open` - Open a box (uses points)
- `GET /api/box/history` - Get box opening history

### Products
- `GET /api/product` - Get all products
- `POST /api/product` - Create product (admin)

### Points
- `GET /api/points/balance` - Get points balance
- `POST /api/points/add` - Add points (admin)
- `POST /api/points/deduct` - Deduct points

### Purchase
- `POST /api/purchase` - Purchase product (adds points)

## 💰 Economy Flow

```
🛒 Buy Products → 💰 Get 5% back as Points
   ↓
🪙 Use Points → 📦 Open Mystery Boxes (FREE!)
   ↓
🎁 Win Real Products!
```

## 🛠️ Setup

```bash
# Install dependencies
cd backend
npm install

# Start server
npm start
```

## 📝 Environment Variables

```env
MONGO_URL=mongodb://localhost:27017/puzzlechain
PORT=3000
JWT_SECRET=your-secret-key
```

## 📄 License

MIT
