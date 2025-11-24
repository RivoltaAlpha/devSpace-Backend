import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeveloperProfile } from 'src/developer-profile/entities/developer-profile.entity';
import { TherapistProfile } from 'src/therapist-profile/entities/therapist-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DeveloperProfile, TherapistProfile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
