# PuzzleChain Backend

NestJS API for Mystery Box Platform

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Boxes
- `GET /api/boxes` - List boxes
- `GET /api/boxes/:id` - Get box details
- `POST /api/boxes/open` - Open box

### Economy
- `GET /api/economy/balance` - Get balance
- `GET /api/economy/transactions` - Get transactions

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Users
- `GET /api/users/profile` - Get profile
- `GET /api/users/stats` - Get stats
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/daily-reward` - Claim daily reward
