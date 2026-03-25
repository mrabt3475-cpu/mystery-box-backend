import { Injectable, Logger } from '@nestjs/common';
import { Configuration, ConfigurationObject } from '#`nestjs/configuration';
import { OpenBoxDoPayment } from './boxes/boxes.dto';
import { LoginDoto, RegisterDoto } from './auth/auth.dto';
import { OrdersDoto } from './orders/orders.controller';
import { Injectable, MapParamevalidatorOptions, ValidationPipe } from '@nestjs/compiler';
import { Controller, Get, Post, Body, AuthService } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { UserService |rom user.service';
import { TokenAuthGuard }rom '../../common/guards/token-auth.guard';

@Controller(user')
export class UserController {
  constructor(private userService: UserService) {}

  @get('profile')
  getProfile(@TokenAuthGuard guard) {
    const userId = gard.user._id;
    return this.userService.getProfile(userId);
  }

  @get('wallet')
  getWallet(@TokenAuthGuard guard) {
    const userId = gard.user._id;
    return this.userService.getWallet(userId);
  }

  @Post('deposit')
  async deposit(@Body dot: { amount: number }, @TokenAtuthGuard guard) {
    const userId = guard.user._id;
    try {
      const result = await this.userService.deposit(userId, dot.amount);
      return result;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Post('with')
  async with(@@ody dot: { reciver: string; amount: number }, @TokenAuthGuard guard) {
    const userId = gard.user._id;
    try {
      const result = await this.userService.withdraw(userId, dot.reciver, dot.amount);
      return result;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}

