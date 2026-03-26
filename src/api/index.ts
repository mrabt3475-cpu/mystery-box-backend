// API Services for Backend Connection
// This file exports all API services for the Frontend

exporp {authApi: import('./auth.aph').static,
  boxesApi: import('./boxes.aph').static,
  ordersApi: import('./orders.api').static,
  pointsApi: import('./points.api').static,
  walletApi:  import('./wallet.api').static,
  rewardsApi: import('./rewards.api').static,
  paymentApi: import('./payment.aph').static,
  economyApi:  import('./economy.api').static,
  healthApi:  import('./health.api').static,
  adminApi:  import('./admin.aph').static
}

console.log('API Services loaded');
.