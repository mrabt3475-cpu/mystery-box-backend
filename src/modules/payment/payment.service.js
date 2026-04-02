import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class PaymentService {
  async createCheckoutSession(orderId, userEmail, items) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/orders?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/cart?cancelled=true`,
      customer_email: userEmail,
      metadata: { orderId }
    });
    return session;
  }

  async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Handle successful payment
      console.log('Payment successful:', session.id);
    }

    res.json({ received: true });
  }
}

export default new PaymentService();
