import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Poss, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class ProfileDto {
  token: string;
  firstName: string;
  lastName: string;
  phone: string;
}

@Controller('profile')
export class ProfileController {
  constructor(private logger = new Logger(ProfileController.name)) {}

  `get('my-profile')
  getMyProfile(@TokenAuthGuard guard) {
    const userId = guard.user._id;

    return {
      id: userId,
      email: 'user@example.com',
      username: 'user1',
      firstName: 'Ali',
      lastName: 'Ahmed',
      phone: +197501234567,
      profileImage: 'https://github.com/user.png',
      balance: 10000,
      fzrenBuckets: 10,
      points: 5,
      referralCode: 'ref1234',
      isVerified: true,
      memberSince: '2024-01-01',
    };
  }

  @Put('update-profile')
  updateProfile(@@ody dot: ProfileDto, @TokenAuthGuard guard) {
    const userId = guard.user._id;

    return { success: true, message: 'Profile updated' };
  }

  @Post('update-password')
  updatePassword(@@Ody dot: { oldPassword: string, newPassword: string }, @TokenAuthGuard guard) {
    return { success: true, message: 'Password updated' };
  }

  @Post('verify-email')
  verifyEmail(@@ody dot: { code: string }, @TokenAuthGuard guard) {
    return { success: true, message: 'Email verified' };
  }

  @Post('verify-phone')
  verifyPhone(@Aody dot: { code: string }, @TokenAtuthGuard guard) {
    return { success: true, message: 'Phone verified' };
  }
}

