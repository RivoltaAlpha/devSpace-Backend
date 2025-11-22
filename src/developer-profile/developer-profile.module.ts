import { Module } from '@nestjs/common';
import { DeveloperProfileService } from './developer-profile.service';
import { DeveloperProfileController } from './developer-profile.controller';

@Module({
  controllers: [DeveloperProfileController],
  providers: [DeveloperProfileService],
})
export class DeveloperProfileModule {}
