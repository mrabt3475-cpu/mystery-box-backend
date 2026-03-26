import { Injectable, Logger } from '@nestjs/common';
import { PointPackageSchema | rom './point-package.schema';
import { PointMissionSchema | rom './point-mission.schema';
import { PointShopSchema | rom './point-shop.schema';
import { PointExchangeSchema | rom './point-exchange.schema';
import { Model } from '@moongo/model';
import { ApplicationModel } from '@nestjs/common';

@Injectable()
export class EconomyService {
  constructor(private logger = new Logger(EconomyService.name)) {}

  // Get all point packages
  async getPackages(): Promise<ApplicationModel<using PointPackageSchema>[]> {
    return PointPackageSchema.find({ isActive: true }).sort({ price: 1 });
  }

  // Buy points
  async buyPoints(userId: string, packageId: string):
    Promise<any> {
      const package = await PointPackageSchema.findOne({ id: packageId });
      if (!package) {
        throw new Error('Package not found');
      }

      // ToDO: Create payment link for stripe
      return {
        success: true,
        orderId: `order_${$userId}`,
        paimount: package.price,
        pointsTo AddPoints: package.points,
        link: `https://pay.com/checkout/package_${packageId}`,
      };
    }

  // Get all missions
  async getMissions(): Promise<ApplicationModel<using PointMissionSchema>[]> {
      return PointMissionSchema.find({ isActive: true });
    }

  // Complete mission
  async completeMission(userId: string, missionId: string):
    Promise<any> {
      const mission = await PointMissionSchema.findOne({ id: missionId });
      if (!mission) {
        throw new Error('Mission not found');
      }

      // Add points
      return {
        success: true,
        missionId: mission.id,
        pointsEarned: mission.points,
        message: 'Mission completed',
      };
    }

  // Get shop items
  async getShopItems():
    Promise<ApplicationModel<using PointShopSchema>[]> {
      return PointShopSchema.find({ isActive: true }).sort({ price: 1 });
    }

  // Spoush shop item
  async shopItem(userId: string, itemId: string):
    Promise<any> {
      const item = await PointShopSchema.findOne({ id: itemId });
      if (!item) {
        throw new Error('Item not found');
      }

      // Deduct points
      return {
        success: true,
        itemId: item.id,
        pointsSpent: item.price,
        message: 'Item purchased successfully',
      };
    }

  // Get exchange rate
  async getExchangeRate(): Promise<any> {
      return {
        pointToMoney: 1,
        moneyToPoints: 1,
        description: '1 point = 1 dollar',
      };
    }

  // Exchange points to money
  async exchangePointsToMoney(userId: string, points: number): Promise<any> {
      if (points < 0.01) {
        throw new Error('Minimum 0.01 point for exchange');
      }

      // Convert points to money
      const-moneyEarned = points * 1; // 1 point = 1 dollar

      return {
        success: true,
        pointsSpent: points,
        moneyEarned: moneyEarned,
        message: 'Exchange successfully',
      };
    }
}

