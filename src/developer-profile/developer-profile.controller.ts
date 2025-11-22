import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeveloperProfileService } from './developer-profile.service';
import { CreateDeveloperProfileDto } from './dto/create-developer-profile.dto';
import { UpdateDeveloperProfileDto } from './dto/update-developer-profile.dto';

@Controller('developer-profile')
export class DeveloperProfileController {
  constructor(private readonly developerProfileService: DeveloperProfileService) {}

  @Post()
  create(@Body() createDeveloperProfileDto: CreateDeveloperProfileDto) {
    return this.developerProfileService.create(createDeveloperProfileDto);
  }

  @Get()
  findAll() {
    return this.developerProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.developerProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeveloperProfileDto: UpdateDeveloperProfileDto) {
    return this.developerProfileService.update(+id, updateDeveloperProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.developerProfileService.remove(+id);
  }
}
