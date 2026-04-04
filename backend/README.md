# 🚀 PuzzleChain - Mystery Box Backend

## 📋 Quick Start

```bash
# Clone
git clone https://github.com/mrabt3475-cpu/mystery-box-backend.git
cd mystery-box-backend

# Install
npm install

# Setup environment
cp backend/.env.example backend/.env
# Edit .env with your values

# IMPORTANT: Set JWT_SECRET (min 32 chars) for production

# Run
npm run dev
```

## 🏗️ Architecture

```
backend/
├── config/          # Centralized configuration
├── middleware/      # Express middleware
├── models/          # Mongoose models (14)
├── routes/          # API routes (11)
├── services/        # Business logic (4)
├── utils/           # Helpers
└── server.js        # Entry point
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/boxes | List boxes |
| POST | /api/boxes/:id/open | Open box |
| GET | /api/points | Get balance |
| POST | /api/gifts/send | Send gift |

## 🛡️ Security

- JWT Authentication
- Rate Limiting (100 req/15min)
- Input Validation
- MongoDB Transactions
- Helmet + CORS

## 📝 Environment Variables

```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
MONGODB_URI=mongodb://localhost:27017/puzzlechain
NODE_ENV=development
PORT=3000
```

## 📄 License

MIT
