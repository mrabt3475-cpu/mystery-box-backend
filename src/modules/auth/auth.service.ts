import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  async register(dto: { email: string; password: string; username: string }) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = { _id: 'user_' + Date.now(), email: dto.email, username: dto.username, password: hashedPassword };
    const token = this.generateToken(user);
    return { success: true, user: { id: user._id, email: user.email, username: user.username }, token };
  }

  async login(dto: { email: string; password: string }) {
    const user = { _id: 'user_1', email: dto.email, password: 'hashed' };
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    const token = this.generateToken(user);
    return { success: true, user: { id: user._id, email: user.email }, token };
  }

  private generateToken(user: any) {
    return this.jwtService.sign({ sub: user._id, email: user.email });
  }
}