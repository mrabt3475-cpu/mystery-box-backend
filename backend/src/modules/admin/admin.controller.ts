import { Controller, Get, Put, Delete, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== Stats ==========
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  // ========== Users ==========
  @Get('users')
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search = '',
    @Query('filter') filter = '',
  ) {
    return this.adminService.getUsers(parseInt(page), parseInt(limit), search, filter);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: {
      balance?: number;
      points?: number;
      level?: number;
      isActive?: boolean;
      isVip?: boolean;
    },
  ) {
    return this.adminService.updateUser(id, updateData);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ========== Boxes ==========
  @Get('boxes')
  async getBoxes() {
    return this.adminService.getAllBoxes();
  }

  @Post('boxes')
  async createBox(@Body() boxData: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    prizes?: any[];
  }) {
    return this.adminService.createBox(boxData);
  }

  @Put('boxes/:id')
  async updateBox(
    @Param('id') id: string,
    @Body() updateData: {
      name?: string;
      description?: string;
      price?: number;
      image?: string;
      isActive?: boolean;
    },
  ) {
    return this.adminService.updateBox(id, updateData);
  }

  @Delete('boxes/:id')
  async deleteBox(@Param('id') id: string) {
    return this.adminService.deleteBox(id);
  }

  // ========== Broadcast ==========
  @Post('broadcast')
  async broadcast(@Body() data: { message: string; type?: string }) {
    return this.adminService.broadcastNotification(data.message, data.type);
  }

  // ========== Prizes ==========
  @Get('prizes')
  async getPrizes() {
    return this.adminService.getAllPrizes();
  }

  @Post('prizes')
  async createPrize(@Body() prizeData: {
    name: string;
    description?: string;
    image?: string;
    value: number;
    rarity: string;
  }) {
    return this.adminService.createPrize(prizeData);
  }

  @Put('prizes/:id')
  async updatePrize(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.adminService.updatePrize(id, updateData);
  }

  @Delete('prizes/:id')
  async deletePrize(@Param('id') id: string) {
    return this.adminService.deletePrize(id);
  }

  // ========== Transactions ==========
  @Get('transactions')
  async getTransactions(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.adminService.getTransactions(parseInt(page), parseInt(limit));
  }

  // ========== System ==========
  @Get('system/health')
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Post('system/clear-cache')
  async clearCache() {
    return this.adminService.clearCache();
  }
}
