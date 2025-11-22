import { Module } from '@nestjs/common';
import { TherapistProfileService } from './therapist-profile.service';
import { TherapistProfileController } from './therapist-profile.controller';

@Module({
  controllers: [TherapistProfileController],
  providers: [TherapistProfileService],
})
export class TherapistProfileModule {}
