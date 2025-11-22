import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BurnoutAssesmentService } from './burnout-assesment.service';
import { CreateBurnoutAssesmentDto } from './dto/create-burnout-assesment.dto';
import { UpdateBurnoutAssesmentDto } from './dto/update-burnout-assesment.dto';

@Controller('burnout-assesment')
export class BurnoutAssesmentController {
  constructor(private readonly burnoutAssesmentService: BurnoutAssesmentService) {}

  @Post()
  create(@Body() createBurnoutAssesmentDto: CreateBurnoutAssesmentDto) {
    return this.burnoutAssesmentService.create(createBurnoutAssesmentDto);
  }

  @Get()
  findAll() {
    return this.burnoutAssesmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.burnoutAssesmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBurnoutAssesmentDto: UpdateBurnoutAssesmentDto) {
    return this.burnoutAssesmentService.update(+id, updateBurnoutAssesmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.burnoutAssesmentService.remove(+id);
  }
}
