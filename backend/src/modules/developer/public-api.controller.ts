import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiKeyService, API_PERMISSIONS } from './api-key.service';

@Controller('api/v1')
export class PublicApiController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  // ============ Public Endpoints (Require API Key) ============
  
  // Products
  @Get('products')
  async getProducts(@Request() req) {
    this.checkPermission(req, 'read:products');
    // Return products - implemented in products service
    return { data: [], message: 'Products endpoint' };
  }

  @Get('products/:id')
  async getProduct(@Request() req, @Param('id') id: string) {
    this.checkPermission(req, 'read:products');
    return { data: null, message: `Product ${id}` };
  }

  // Boxes
  @Get('boxes')
  async getBoxes(@Request() req) {
    this.checkPermission(req, 'read:boxes');
    return { data: [], message: 'Boxes endpoint' };
  }

  @Get('boxes/:id')
  async getBox(@Request() req, @Param('id') id: string) {
    this.checkPermission(req, 'read:boxes');
    return { data: null, message: `Box ${id}` };
  }

  // Open Box (Requires write permission)
  @Post('boxes/:id/open')
  async openBox(@Request() req, @Param('id') id: string, @Body() body: { userId?: string }) {
    this.checkPermission(req, 'write:open-box');
    return {
      success: true,
      prize: null,
      message: 'Box opened via API',
    };
  }

  // User Data
  @Get('user/:id')
  async getUser(@Request() req, @Param('id') id: string) {
    this.checkPermission(req, 'read:user');
    return { data: null, message: `User ${id}` };
  }

  @Get('user/:id/stats')
  async getUserStats(@Request() req, @Param('id') id: string) {
    this.checkPermission(req, 'read:stats');
    return { data: null, message: `User stats ${id}` };
  }

  // Orders
  @Get('orders')
  async getOrders(@Request() req, @Query('userId') userId?: string) {
    this.checkPermission(req, 'read:orders');
    return { data: [], message: 'Orders endpoint' };
  }

  @Post('orders')
  async createOrder(@Request() req, @Body() body: any) {
    this.checkPermission(req, 'write:create-order');
    return { success: true, orderId: null };
  }

  // ============ Permission Check Helper ============
  private checkPermission(req: Request, permission: string): void {
    if (!req.developer) {
      throw new ForbiddenException('مطلوب مفتاح API');
    }

    if (!this.apiKeyService.hasPermission(req.apiKey, permission)) {
      throw new ForbiddenException(`لا تملك صلاحية: ${permission}`);
    }
  }
}
