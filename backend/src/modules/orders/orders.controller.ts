import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Request() req, @Body() body: { items: any[]; shippingAddress: string }) {
    return this.ordersService.create(req.user.userId, body.items, body.shippingAddress);
  }

  @Get()
  async findByUser(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Get('admin/all')
  async getAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.ordersService.getAllOrders(
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
    );
  }

  @Post(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
