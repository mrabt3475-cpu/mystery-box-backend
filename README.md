# 🎮 PuzzleChain - Mystery Box Platform

A full-stack mystery box platform with live streaming support.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Features

### Core Features
- ✅ User Authentication (JWT)
- ✅ Channels & Products Management
- ✅ Shopping Cart & Orders
- ✅ Mystery Boxes with Provably Fair RNG
- ✅ Live Streaming Support
- ✅ Payment Integration (Stripe + TON Wallet)
- ✅ Admin Dashboard
- ✅ Analytics & Reporting
- ✅ Referral System
- ✅ Subscription Plans
- ✅ Notifications

---

## 💻 Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** NestJS
- **Database:** MongoDB 6+
- **Cache:** Redis
- **Authentication:** JWT
- **Payment:** Stripe, TON Wallet

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State:** Zustand


---

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mrabt3475-cpu/mystery-box-backend.git
cd mystery-box-backend

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration

# Frontend setup
cd ../frontend
npm install
```

### Running

```bash
# Backend
cd backend
npm run start

# Frontend
cd frontend
npm run dev
```

---

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 📁 Project Structure

```
puzzlechain/
├── backend/
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── main.ts          # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Channels
- `GET /api/channels` - List channels
- `POST /api/channels` - Create channel
- `GET /api/channels/:id` - Get channel details

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

### Payment
- `POST /api/payment/stripe/checkout` - Stripe checkout
- `POST /api/payment/ton/deposit` - TON deposit

### Mystery Boxes
- `GET /api/boxes` - List boxes
- `POST /api/boxes/open` - Open box

---

## 💰 Revenue

Expected: ~$57,000/month

---

## 📄 License

MIT
