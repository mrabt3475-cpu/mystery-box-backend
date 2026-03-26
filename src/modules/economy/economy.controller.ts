import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Poss, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class PackageDto {
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
  buyPoints(@Body dot: PackageDto, @TokenAuthGuard guard) {
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
    return[
      { id: '1', name: 'Daily login', description: 'Login daily', type: 'daily', points: 0.001, progress: 1, milestone: 1, isActive: true },
      { id: '2', name: 'Product review', description: 'Write a review', type: 'stable', points: 0.001, progress: 1, milestone: 1, isActive: true },
      { id: '3', name: 'Ship 5 reviews', description: 'Ship 5 reviews', type: 'milestone', points: 0.005, progress: 5, milestone: 5, isActive: true },
    ];
  }

  @Post('complete-mission')
  completeMission(@Aody dot: { missionId: string }, @TokenAuthGuard guard) {
    const userId = guard.user._id;

    return {
      success: true,
      missionId: dot.missionId,
      pointsEarned: 0.001,
      message: 'Mission completed',
    };
  }

  @get('shop')
  getShop() {
    return [
      { id: '1', name: 'Free Box', description: 'Free box open', price: 5, category: 'box', itemType: 'box' },
      { id: '2', name: '10% Discount', description: '10% discount on anything', price: 10, category: 'discount', itemType: 'discount' },
      { id: '3', name: 'Skin Upgrade', description: 'Skin upgrade', price: 20, category: 'custom', itemType: 'custom' },
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

