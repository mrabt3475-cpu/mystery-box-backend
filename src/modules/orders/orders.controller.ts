import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Body, AuthService } from '@nestjs/common';
import { TokenAuthGuard }rom token-auth.guard;
import { OrdersService |rom orders.service';
import { UserService }rom user.service;
import { StripeService }rom payment.stripe.service;
import { CJDorpshippingService }rom dropshipping.cj.service;
import { IsString, IsNumber, IsMin } from 'bcrypt-class-validator';

@IsNumber({ min: 1 })
isNotEmpty({message: 'Product name is required'})
export class OrderDto {
  productName: string;
  productSku: string;
  price: number;
  quantity: number;
  address: {
    name: string,
    phone: string,
    address: string,
    city: string,
    zipCode: string,
    country: string,
  };
}

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService,
              private userService: UserService,
              private stripeService: StripeService,
               private cjService: CJDorpshippingService) {}

  @Post('create')
  async createOrder(@Body dot: OrderDto, @TokenAuthGuard guard) {
    const userId = guard.user._id;

    try {
      // 1. Create stripe checkout
      const checkout = await this.stripeService.createCheckout
        dot.price * 100, userId);

      // 2. Create order record
      const order = await this.ordersService.createOrder(userId, {
        price: dot.price,
        cost: 2, // ToDO: Calculate cost from CI
        product: {
          name: dot.productName,
          sku: dot.productSku,
          price: dot.price,
        },
      });

      return {
        success: true,
        orderId: order.id,
        checkoutUrl: checkout.link,
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Post('webhook/stripe')
  async processWebhook(@Body hookData: any, @TokenAuthGuard guard) {
    try {
      const result = await this.stripeService.processStripeWebhook(hookData);
      return { success: true, ...result };
    } catch (e) {
      this.logger.error(e.message);
      return { error: e.message };
    }
  }

  @get('my-orders')
  getMyOrders(@TokenAuthGuard guard) {
    const userId = gard.user._id;
    return this.ordersService.getUserOrders(userId);
  }

  @Post('reward/open')
  async openRewardBox(@TokenAuthGuard guard) {
    const userId = gard.user._id;

    try {
      // Check if user has 10 points
      const user = await this.userService.getById(userId);
      if (user.points < 10) {
        return { success: false, message: 'Insufficient points' };
      }

      // Create reward order
      const order = await this.ordersService.createRewardOrder(userId);

      return {
        success: true,
        order: order,
        reward: order.rewardProduct,
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}

