import { Controller, Post, Body, Get, Query, UseGuards, Request, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '../notifications/notification.schema';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly walletService: WalletService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(@Request() req, @Body() body: { points: number; amount: number }) {
    const { points, amount } = body;
    
    if (!points || !amount || amount <= 0) {
      throw new Error('Invalid points or amount');
    }

    const session = await this.stripeService.createCheckoutSession(
      req.user.id,
      points,
      amount,
    );

    return { sessionId: session.id, url: session.url };
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!req.rawBody) {
      throw new Error('Missing raw body');
    }

    try {
      const event = await this.stripeService.constructWebhookEvent(
        req.rawBody,
        signature,
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const { userId, points } = session.metadata;
          
          if (userId && points) {
            await this.walletService.addPoints(userId, parseInt(points), 'purchase');
            await this.notificationService.create(
              userId,
              NotificationType.PAYMENT_SUCCESS,
              '💰 تم الدفع بنجاح',
              `تم إضافة ${points} نقاط إلى حسابك!`,
              { points, amount: session.amount_total / 100 },
            );
          }
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as any;
          const userId = paymentIntent.metadata?.userId;
          
          if (userId) {
            await this.notificationService.create(
              userId,
              NotificationType.PAYMENT_FAILED,
              '❌ فشل الدفع',
              'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.',
            );
          }
          break;
        }
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(@Query('session_id') sessionId: string) {
    try {
      const session = await this.stripeService.retrieveSession(sessionId);
      return {
        status: session.payment_status,
        amount: session.amount_total / 100,
      };
    } catch (error) {
      return { status: 'unknown' };
    }
  }
}
