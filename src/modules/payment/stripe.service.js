import Stripe from 'stripe';
import Order from '../orders/order.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  
  if (!order || order.user.toString() !== userId) {
    throw new Error('Order not found');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Order ${order.orderNumber}`
          },
          unit_amount: Math.round(order.total * 100)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/orders/${order._id}?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/orders/${order._id}?cancelled=true`,
    metadata: {
      orderId: order._id.toString()
    }
  });

  return session;
};

export const handleWebhook = async (payload, signature) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'completed',
      status: 'processing'
    });
  }

  return event;
};
