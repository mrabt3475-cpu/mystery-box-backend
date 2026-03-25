import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockUsers = new Map<string, { _id: string; email: string; username: string; password: string }>();

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  async register(dto: { email: string; password: string; username: string }) {
    if (mockUsers.has(dto.email)) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = { 
      _id: 'user_' + Date.now(),
      email: dto.email,
      username: dto.username,
      password: hashedPassword 
    };

    mockUsers.set(dto.email, user);
    const token = this.generateToken(user);

    this.logger.log('User registered: ' + dto.email);
    return { success: true, user: { id: user._id, email: user.email, username: user.username }, token };
  }

  async login(dto: { email: string; password: string }) {
    const user = mockUsers.get(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    this.logger.log('User logged in: ' + dto.email);
    return { success: true, user: { id: user._id, email: user.email, username: user.username }, token };
  }

  async validateUser(userId: string) {
    for (const user of mockUsers.values()) {
      if (user._id === userId) {
        return { id: user._id, email: user.email, username: user.username };
      }
    }
    return null;
  }

  private generateToken(user: { _id: string; email: string }) {
    return this.jwdService.sign({ sub: user._id, email: user.email });
  }
}