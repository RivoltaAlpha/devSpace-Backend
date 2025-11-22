import { Injectable } from '@nestjs/common';
import { CreateBurnoutAssesmentDto } from './dto/create-burnout-assesment.dto';
import { UpdateBurnoutAssesmentDto } from './dto/update-burnout-assesment.dto';

@Injectable()
export class BurnoutAssesmentService {
  create(createBurnoutAssesmentDto: CreateBurnoutAssesmentDto) {
    return 'This action adds a new burnoutAssesment';
  }

  findAll() {
    return `This action returns all burnoutAssesment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} burnoutAssesment`;
  }

  update(id: number, updateBurnoutAssesmentDto: UpdateBurnoutAssesmentDto) {
    return `This action updates a #${id} burnoutAssesment`;
  }

  remove(id: number) {
    return `This action removes a #${id} burnoutAssesment`;
  }
}
