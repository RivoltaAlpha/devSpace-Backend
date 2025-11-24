import { Module } from '@nestjs/common';
import { DeveloperProfileService } from './developer-profile.service';
import { DeveloperProfileController } from './developer-profile.controller';
import { DeveloperProfile } from './entities/developer-profile.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeveloperProfile, User])],
  controllers: [DeveloperProfileController],
  providers: [DeveloperProfileService],
  exports: [DeveloperProfileService],
})
export class DeveloperProfileModule {}
