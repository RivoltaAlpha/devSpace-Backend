import { Module } from '@nestjs/common';
import { DailyCheckinsService } from './daily-checkins.service';
import { DailyCheckinsController } from './daily-checkins.controller';
import { User } from 'src/users/entities/user.entity';
import { DailyCheckin } from './entities/daily-checkin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, DailyCheckin])],
  controllers: [DailyCheckinsController],
  providers: [DailyCheckinsService],
  exports: [DailyCheckinsService],
})
export class DailyCheckinsModule {}
