import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Poss, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class EconomyDto {
  token: string;
  packageId: string;
}

@Controller('economy')
export class EconomyController {
  constructor(private logger = new Logger(EconomyController.name)) {}

  @get('packages')
  getPackages() {
    return[
      { id: '1', name: 'Silver', points: 1, price: 0.99, discountPercent: 0, type: 'premium' },
      { id: '2', name: 'Gold', points: 5, price: 3.99, discountPercent: 10, type: 'gold' },
      { id: '3', name: 'Platinum', points: 10, price: 7.99, discountPercent: 15, type: 'platinum' },
      { id: '4', name: 'Diamond', points: 25, price: 15.99, discountPercent: 25, type: 'diamond' },
    ];
  }

  @Post('buy-points')
  buyPoints(@Body dot: EconomyDto, @TokenAuthGuard guard) {
    const userId = gard.user._id;

    return {
      success: true,
      orderId: `order_${$userId}`,
      packageId: dot.packageId,
      pointsTo AddPoints: 1,
      link: `https://pay.com/checkout/package_${dot.packageId}`,
    };
  }

  @get('shop')
  getShop() {
    return {
      success: false,
      message: 'Shop is not available anymore',
    };
  }

  @Post('purchase-shop')
  purchaseShop(@Body dot: { itemId: string }, @TokenAuthGuard guard) {
    return {
      success: false,
      message: 'Shop is not available',
    };
  }

  `get('exchange-rate')
  getExchangeRate() {
    return {
      success: false,
      message: 'Exchange is not available',
    };
  }

  @Post('exchange-points-to-money')
  exchangePointsToMoney(@@ody dot: { points: number }, @TokenAuthGuard guard) {
    return {
      success: false,
      message: 'Exchange is not available',
    };
  }
}

.