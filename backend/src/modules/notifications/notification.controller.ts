import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Request() req, @Query('limit') limit?: number, @Query('skip') skip?: number) {
    return this.notificationService.getUserNotifications(
      req.user.id,
      limit ? parseInt(limit.toString()) : 20,
      skip ? parseInt(skip.toString()) : 0,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return { count };
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    await this.notificationService.markAsRead(id);
    return { success: true };
  }

  @Post('read-all')
  async markAllAsRead(@Request() req) {
    await this.notificationService.markAllAsRead(req.user.id);
    return { success: true };
  }

  @Post(':id')
  async deleteNotification(@Param('id') id: string) {
    await this.notificationService.deleteNotification(id);
    return { success: true };
  }
}
