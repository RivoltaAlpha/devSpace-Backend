import { Injectable } from '@nestjs/common';
import { CreateDailyCheckinDto } from './dto/create-daily-checkin.dto';
import { UpdateDailyCheckinDto } from './dto/update-daily-checkin.dto';

@Injectable()
export class DailyCheckinsService {
  create(createDailyCheckinDto: CreateDailyCheckinDto) {
    return 'This action adds a new dailyCheckin';
  }

  findAll() {
    return `This action returns all dailyCheckins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyCheckin`;
  }

  update(id: number, updateDailyCheckinDto: UpdateDailyCheckinDto) {
    return `This action updates a #${id} dailyCheckin`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyCheckin`;
  }
}
