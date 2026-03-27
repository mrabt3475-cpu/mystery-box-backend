import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { OpenBoxDto } from './boxes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get()
  async findAll() {
    return this.boxesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.boxesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('open')
  async openBox(@Request() req, @Body() dto: OpenBoxDto) {
    return this.boxesService.openBox(req.user.userId, dto);
  }
}
