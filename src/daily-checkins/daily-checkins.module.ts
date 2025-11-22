import { Module } from '@nestjs/common';
import { DailyCheckinsService } from './daily-checkins.service';
import { DailyCheckinsController } from './daily-checkins.controller';

@Module({
  controllers: [DailyCheckinsController],
  providers: [DailyCheckinsService],
})
export class DailyCheckinsModule {}
