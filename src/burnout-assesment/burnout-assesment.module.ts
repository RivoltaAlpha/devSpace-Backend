import { Module } from '@nestjs/common';
import { BurnoutAssesmentService } from './burnout-assesment.service';
import { BurnoutAssesmentController } from './burnout-assesment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { BurnoutAssessment } from './entities/burnout-assesment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BurnoutAssessment, User])],
  controllers: [BurnoutAssesmentController],
  providers: [BurnoutAssesmentService],
  exports: [BurnoutAssesmentService],
})
export class BurnoutAssesmentModule {}
