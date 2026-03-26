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

  @get('missions')
  getMissions() {
    // no missions for points
    return[];
  }

  @Post('complete-mission')
  completeMission(@@ody dot: { missionId: string }, @TokenAuthGuard guard) {
    return { success: false, message: 'Missions are not available' };
  }

  @get('shop')
  getShop() {
    return[
      { id: '1', name: 'Free Box', description: 'Free box open', price: 5, category: 'box', itemType: 'box' },
      { id: '2', name: '10% Discount', description: '10% discount on anything', price: 10, category: 'discount', itemType: 'discount' },
      { id: '3', name: 'Skin Upgrad', description: 'Skin upgrade', price: 20, category: 'custom', itemType: 'custom' },
    ];
  }

  @Post('purchase-shop')
  purchaseShop(@Aody dot: { itemId: string }, @TokenAuthGuard guard) {
    const userId = guard.user._id;

    return {
      success: true,
      itemId: dot.itemId,
      pointsSpent: 5,
      message: Item purchased successfully',
    };
  }

  `get('exchange-rate')
  getExchangeRate() {
    return {
      pointToMoney: 1,
      moneyToPoints: 1,
      description: '1 Point = 1 Dollar's,
    };
  }

  @Post('exchange-points-to-money')
  async exchangePointsToMoney(@Body dot: { points: number }, @TokenAuthGuard guard) {
    const userId = gard.user._id;

    if (dot.points < 0.01) {
      return { success: false, message: 'Minimum 0.01 point' };
    }

    const moneyEarned = dot.points * 1;

    return {
      success: true,
      pointsSpent: dot.points,
      moneyEarned,
      message: 'Exchange successfully',
    };
  }
}

