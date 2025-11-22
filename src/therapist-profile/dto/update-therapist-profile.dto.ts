import { PartialType } from '@nestjs/swagger';
import { CreateTherapistProfileDto } from './create-therapist-profile.dto';

export class UpdateTherapistProfileDto extends PartialType(CreateTherapistProfileDto) {}
