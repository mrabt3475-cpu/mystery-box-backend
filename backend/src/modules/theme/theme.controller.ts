import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('theme')
@UseGuards(JwtAuthGuard)
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  async getTheme(@Request() req) {
    return this.themeService.getUserTheme(req.user.id);
  }

  @Get('config')
  async getFullConfig(@Request() req) {
    return this.themeService.getFullThemeConfig(req.user.id);
  }

  @Get('available')
  async getAvailableThemes() {
    return {
      themes: this.themeService.getAvailableThemes(),
      animations: this.themeService.getAnimations(),
    };
  }

  @Put()
  async updateTheme(@Request() req, @Body() themeData: {
    name?: string;
    animation?: string;
    soundEnabled?: boolean;
    hapticsEnabled?: boolean;
    particlesEnabled?: boolean;
  }) {
    return this.themeService.updateTheme(req.user.id, themeData);
  }
}
