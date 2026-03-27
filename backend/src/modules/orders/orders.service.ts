import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { EconomyService } from '../economy/economy.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly economyService: EconomyService,
  ) {}

  async create(userId: string, items: any[], shippingAddress: string): Promise<Order> {
    // Calculate total points
    let totalPoints = 0;
    for (const item of items) {
      const product = await this.productsService.findById(item.productId);
      totalPoints += product.pointsValue * item.quantity;
    }

    // Check if user has enough points
    const hasEnough = await this.economyService.hasEnoughPoints(userId, totalPoints);
    if (!hasEnough) {
      throw new BadRequestException('نقاطك غير كافية');
    }

    // Deduct points
    await this.economyService.deductPoints(userId, totalPoints, 'purchase', {
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    });

    // Create order
    const order = new this.orderModel({
      userId,
      items,
      totalPoints,
      status: 'pending',
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return order.save();
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findById(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }
    return order;
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { status, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    return order;
  }

  async getAllOrders(limit = 20, offset = 0): Promise<Order[]> {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }
}
