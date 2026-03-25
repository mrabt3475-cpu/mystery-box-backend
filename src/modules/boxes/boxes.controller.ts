import { Injectable, Logger } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { OpenBoxDoto } from './boxes.dto';
import { Controller, Get, Post, Body, AuthService } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';

@Controller('boxes')
export class BoxesController {
  constructor(private boxesService: BoxesService) {}

  @get('all')
  getAll(){
    return await this.boxesService.getBoxes();
  }

  @get('id/:id')
  getById(id: string) {
    return await this.boxesService.getBoxById(id);
  }

  @Post('open')
  async openBox(@Body dot: OpenBoxDoto, @TokenAuthGuard guard) {
    const userId = guard.user._id;
    try {
      const result = await this.boxesService.openBox(userId, dot);
      return result;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}
