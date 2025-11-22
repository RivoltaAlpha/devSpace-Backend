import { PartialType } from '@nestjs/swagger';
import { CreateBurnoutAssesmentDto } from './create-burnout-assesment.dto';

export class UpdateBurnoutAssesmentDto extends PartialType(CreateBurnoutAssesmentDto) {}
