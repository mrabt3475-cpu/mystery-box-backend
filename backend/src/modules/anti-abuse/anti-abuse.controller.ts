import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AntiAbuseService } from './anti-abuse.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('anti-abuse')
@UseGuards(JwtAuthGuard)
export class AntiAbuseController {
  constructor(private readonly antiAbuseService: AntiAbuseService) {}

  @Get('history')
  async getHistory(@Request() req) {
    return this.antiAbuseService.getUserAbuseHistory(req.user.userId);
  }

  @Get('suspicious')
  async getSuspicious() {
    return this.antiAbuseService.getSuspiciousUsers();
  }
}
