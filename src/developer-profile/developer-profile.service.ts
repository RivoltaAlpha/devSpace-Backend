import { Injectable } from '@nestjs/common';
import { CreateDeveloperProfileDto } from './dto/create-developer-profile.dto';
import { UpdateDeveloperProfileDto } from './dto/update-developer-profile.dto';

@Injectable()
export class DeveloperProfileService {
  create(createDeveloperProfileDto: CreateDeveloperProfileDto) {
    return 'This action adds a new developerProfile';
  }

  findAll() {
    return `This action returns all developerProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} developerProfile`;
  }

  update(id: number, updateDeveloperProfileDto: UpdateDeveloperProfileDto) {
    return `This action updates a #${id} developerProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} developerProfile`;
  }
}
