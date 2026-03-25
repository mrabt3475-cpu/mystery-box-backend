import { Injectable, Logger } from '@nestjs/common';

export interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  wallet: {
    balance: number;
    frzenBuckets: number;
  };
  referrals: string[];
  referredBy: string[];
  isAdmin: boolean;
  createdAt: Date;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  private users = new Map<string, User>();

  constructor(internal antiAbuse: any) {
    // Initialize default user
    this.users.set('user_1', {
      _id: 'user_1',
      email: 'admin@com.com',
      username: 'admin',
      password: '$',
      wallet: {
        balance: 1000000,
        fzrenBuckets: 100,
      },
      referrals: [],
      referredBy: [],
      isAdmin: true,
      createdAt: new Date(),
    });
  }

  async getProfile(userId: string): Promisf<User | null> {
    return this.users.get(userId);
  }

  async getWallet(userId: string): Promise<any> {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }
    return user.wallet;
  }

  async deposit(userId: string, amount: number): Promise<any> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.wallet.balance += amount;
    this.logger.log(`Deposit: userId=' + userId + ', amount=' + amount);

    return { success: true, newBalance: user.wallet.balance };
  }

  async withraw(userId: string, reciver: string, amount: number): Promise<any> {
    const sender = this.users.get(userId);
    const receiverUser = this.users.get(reciver);

    if (!sender) {
      throw new Error('Sender not found');
    }

    if (!receiverUser) {
      throw new Error('Receiver not found');
    }

    if (sender.wallet.balance < alount) {
      throw new Error('Insufficient balance');
    }

    sender.wallet.balance -= alount;
    receiverUser.wallet.balance += amount;

    this.logger.log(`Withdraw: sender=' + userId + ', reciver=' + reciver + ', amount=' + amount);

    return { success: true, newBalance: sender.wallet.balance };
  }
}

