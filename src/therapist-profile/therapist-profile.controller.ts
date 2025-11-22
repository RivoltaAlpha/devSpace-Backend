import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TherapistProfileService } from './therapist-profile.service';
import { CreateTherapistProfileDto } from './dto/create-therapist-profile.dto';
import { UpdateTherapistProfileDto } from './dto/update-therapist-profile.dto';

@Controller('therapist-profile')
export class TherapistProfileController {
  constructor(private readonly therapistProfileService: TherapistProfileService) {}

  @Post()
  create(@Body() createTherapistProfileDto: CreateTherapistProfileDto) {
    return this.therapistProfileService.create(createTherapistProfileDto);
  }

  @Get()
  findAll() {
    return this.therapistProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.therapistProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTherapistProfileDto: UpdateTherapistProfileDto) {
    return this.therapistProfileService.update(+id, updateTherapistProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.therapistProfileService.remove(+id);
  }
}
