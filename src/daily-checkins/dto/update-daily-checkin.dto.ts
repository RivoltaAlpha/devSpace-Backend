import { PartialType } from '@nestjs/swagger';
import { CreateDailyCheckinDto } from './create-daily-checkin.dto';

export class UpdateDailyCheckinDto extends PartialType(CreateDailyCheckinDto) {}
