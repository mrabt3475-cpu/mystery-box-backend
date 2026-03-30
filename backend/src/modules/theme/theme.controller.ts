import { Controller, Get, Put, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  // Anyone can get the current global theme
  @Get()
  async getGlobalTheme() {
    return this.themeService.getGlobalTheme();
  }

  // Get full config (themes + animations)
  @Get('config')
  async getThemeConfig() {
    return this.themeService.getThemeConfig();
  }

  // Get available themes/animations (read-only)
  @Get('available')
  async getAvailable() {
    return {
      themes: this.themeService.getAvailableThemes(),
      animations: this.themeService.getAnimations(),
    };
  }

  // ADMIN ONLY: Set global theme
  @Put('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async setGlobalTheme(
    @Request() req,
    @Body() themeData: {
      themeId?: string;
      animationId?: string;
      soundEnabled?: boolean;
      hapticsEnabled?: boolean;
      particlesEnabled?: boolean;
    },
  ) {
    return this.themeService.setGlobalTheme(req.user.id, themeData);
  }
}
