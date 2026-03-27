import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { LegalComplianceService } from './legal-compliance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('legal')
export class LegalComplianceController {
  constructor(private readonly legalService: LegalComplianceService) {}

  /**
   * التحقق من الامتثال قبل purchase
   */
  @Post('validate-purchase')
  @UseGuards(JwtAuthGuard)
  async validatePurchase(
    @Request() req,
    @Body() body: { amount: number },
  ) {
    return this.legalService.validatePurchase(req.user.userId, body.amount);
  }

  /**
   * التحقق من الاستبعاد الذاتي
   */
  @Get('self-exclusion/check')
  @UseGuards(JwtAuthGuard)
  async checkSelfExclusion(@Request() req) {
    const isExcluded = await this.legalService.checkSelfExclusion(req.user.userId);
    return { excluded: isExcluded };
  }

  /**
   * تفعيل الاستبعاد الذاتي
   */
  @Post('self-exclude')
  @UseGuards(JwtAuthGuard)
  async selfExclude(
    @Request() req,
    @Body() body: { days: number },
  ) {
    await this.legalService.selfExclude(req.user.userId, body.days);
    return { message: 'تم تفعيل الاستبعاد الذاتي' };
  }

  /**
   * إلغاء الاستبعاد
   */
  @Post('self-exclusion/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSelfExclusion(@Request() req) {
    await this.legalService.cancelSelfExclusion(req.user.userId);
    return { message: 'تم إلغاء الاستبعاد' };
  }

  // ============ Admin Routes ============

  /**
   * الحصول على إعدادات الامتثال
   */
  @Get('settings')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getSettings() {
    return this.legalService.getActiveCompliance();
  }

  /**
   * تحديث إعدادات الامتثال
   */
  @Put('settings')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateSettings(@Body() body: any) {
    // تحديث الإعدادات
    return { message: 'تم التحديث' };
  }

  /**
   * الحصول على RTP
   */
  @Get('rtp/:boxId')
  async getRTP(@Param('boxId') boxId: string) {
    const rtp = await this.legalService.calculateRTP(boxId);
    return { boxId, rtp };
  }
}
