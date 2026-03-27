import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Developer, DeveloperDocument } from './developer.schema';
import * as crypto from 'crypto';

@Injectable()
export class DeveloperService {
  constructor(
    @InjectModel(Developer.name) private developerModel: Model<DeveloperDocument>,
  ) {}

  async create(userId: string, data: {
    email: string;
    name: string;
    company?: string;
    website?: string;
  }): Promise<Developer> {
    const existing = await this.developerModel.findOne({ userId });
    if (existing) {
      throw new BadRequestException('حساب المطور موجود بالفعل');
    }

    const developer = new this.developerModel({
      userId,
      email: data.email,
      name: data.name,
      company: data.company,
      website: data.website,
      status: 'active',
      apiKeys: [],
      settings: {
        notifications: true,
        webhookRetries: 3,
      },
    });

    return developer.save();
  }

  async findByUserId(userId: string): Promise<Developer> {
    const developer = await this.developerModel.findOne({ userId });
    if (!developer) {
      throw new NotFoundException('لم يتم العثور على حساب المطور');
    }
    return developer;
  }

  async findById(id: string): Promise<Developer> {
    const developer = await this.developerModel.findById(id);
    if (!developer) {
      throw new NotFoundException('لم يتم العثور على حساب المطور');
    }
    return developer;
  }

  async update(id: string, data: Partial<Developer>): Promise<Developer> {
    const developer = await this.developerModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!developer) {
      throw new NotFoundException('لم يتم العثور على حساب المطور');
    }
    return developer;
  }

  async addApiKey(developerId: string, keyId: string): Promise<void> {
    await this.developerModel.findByIdAndUpdate(developerId, {
      $push: { apiKeys: keyId },
    });
  }

  async removeApiKey(developerId: string, keyId: string): Promise<void> {
    await this.developerModel.findByIdAndUpdate(developerId, {
      $pull: { apiKeys: keyId },
    });
  }

  async incrementRequests(developerId: string): Promise<void> {
    await this.developerModel.findByIdAndUpdate(developerId, {
      $inc: { totalRequests: 1, monthlyRequests: 1 },
      $set: { lastRequestAt: new Date() },
    });
  }

  async getAllDevelopers(limit = 20, offset = 0): Promise<Developer[]> {
    return this.developerModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }
}
