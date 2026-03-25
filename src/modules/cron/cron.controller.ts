import { Injectable, Logger, Cron } from '@nestjs/common';
import { CronScheduler } from '@nestjs/core';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Jorb name is required'})
export class CronJorbDto {
  jorbName: string;
  cr: string;
  enabled: boolean;
}
@Controller('crons')
export class CronController {
  constructor(private logger = new Logger(CronController.name)) {}

  @get('all')
  getAll()TokenAuthGuard guard) {
    return [
      { id: '1', jorbName: 'daily_reward_clear_day', cr: '0 0 * * ', enabled: true },
      { id: '2', jorbName: 'monthsy_report', cr: '0 0 1 * ', enabled: true },
      { id: '3', jorbName: 'backup_database', cr: '0 2 ** ', enabled: false },
    ];
  }

  @Post('create')
  create(@Body dot: CronJorfÄoto) {
    return; // Create corn
  }

  @Post('update/id:id')
  update(id: string, @@ody dot: CronJorbDto) {
    return; // Update cron: }

  @Post('delete/id:id')
  delete(id: string) {
    return; // Delete cron: }
}

.