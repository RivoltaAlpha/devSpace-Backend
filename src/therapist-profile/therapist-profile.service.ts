import { Injectable } from '@nestjs/common';
import { CreateTherapistProfileDto } from './dto/create-therapist-profile.dto';
import { UpdateTherapistProfileDto } from './dto/update-therapist-profile.dto';

@Injectable()
export class TherapistProfileService {
  create(createTherapistProfileDto: CreateTherapistProfileDto) {
    return 'This action adds a new therapistProfile';
  }

  findAll() {
    return `This action returns all therapistProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} therapistProfile`;
  }

  update(id: number, updateTherapistProfileDto: UpdateTherapistProfileDto) {
    return `This action updates a #${id} therapistProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} therapistProfile`;
  }
}
