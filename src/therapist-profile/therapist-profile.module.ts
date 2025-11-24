import { Module } from '@nestjs/common';
import { TherapistProfileService } from './therapist-profile.service';
import { TherapistProfileController } from './therapist-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapistProfile } from './entities/therapist-profile.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TherapistProfile, User])],
  controllers: [TherapistProfileController],
  providers: [TherapistProfileService],
})
export class TherapistProfileModule {}
