import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    userId: string,
    points: number,
    amount: number,
  ): Promise<Stripe.Checkout.Session> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${points} Points - PuzzleChain`,
              description: `Purchase ${points} points for ${amount}$`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment/cancel`,
      metadata: {
        userId,
        points: points.toString(),
      },
    });

    return session;
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async constructWebhookEvent(
    payload: Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  async createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });
  }

  async createCustomer(userId: string, email: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      metadata: { userId },
      email,
    });
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    return this.stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>;
  }

  async createSubscription(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }
}
