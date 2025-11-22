import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyCheckinsService } from './daily-checkins.service';
import { CreateDailyCheckinDto } from './dto/create-daily-checkin.dto';
import { UpdateDailyCheckinDto } from './dto/update-daily-checkin.dto';

@Controller('daily-checkins')
export class DailyCheckinsController {
  constructor(private readonly dailyCheckinsService: DailyCheckinsService) {}

  @Post()
  create(@Body() createDailyCheckinDto: CreateDailyCheckinDto) {
    return this.dailyCheckinsService.create(createDailyCheckinDto);
  }

  @Get()
  findAll() {
    return this.dailyCheckinsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyCheckinsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyCheckinDto: UpdateDailyCheckinDto) {
    return this.dailyCheckinsService.update(+id, updateDailyCheckinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyCheckinsService.remove(+id);
  }
}
