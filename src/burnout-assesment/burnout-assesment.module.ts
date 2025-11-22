import { Module } from '@nestjs/common';
import { BurnoutAssesmentService } from './burnout-assesment.service';
import { BurnoutAssesmentController } from './burnout-assesment.controller';

@Module({
  controllers: [BurnoutAssesmentController],
  providers: [BurnoutAssesmentService],
})
export class BurnoutAssesmentModule {}
