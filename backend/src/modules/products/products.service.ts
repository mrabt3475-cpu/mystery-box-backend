import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find({ isActive: true }).sort({ price: 1 }).exec();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new BadRequestException('المنتج غير موجود');
    }
    return product;
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = new this.productModel(data);
    return product.save();
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!product) {
      throw new BadRequestException('المنتج غير موجود');
    }
    return product;
  }

  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new BadRequestException('المنتج غير موجود');
    }
  }

  async getByCategory(category: string): Promise<Product[]> {
    return this.productModel
      .find({ category, isActive: true })
      .sort({ price: 1 })
      .exec();
  }

  async getCategories(): Promise<string[]> {
    return this.productModel.distinct('category').exec();
  }
}
