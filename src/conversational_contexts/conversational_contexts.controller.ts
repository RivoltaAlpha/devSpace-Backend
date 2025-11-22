import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversationalContextsService } from './conversational_contexts.service';
import { CreateConversationalContextDto } from './dto/create-conversational_context.dto';
import { UpdateConversationalContextDto } from './dto/update-conversational_context.dto';

@Controller('conversational-contexts')
export class ConversationalContextsController {
  constructor(private readonly conversationalContextsService: ConversationalContextsService) {}

  @Post()
  create(@Body() createConversationalContextDto: CreateConversationalContextDto) {
    return this.conversationalContextsService.create(createConversationalContextDto);
  }

  @Get()
  findAll() {
    return this.conversationalContextsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationalContextsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationalContextDto: UpdateConversationalContextDto) {
    return this.conversationalContextsService.update(+id, updateConversationalContextDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationalContextsService.remove(+id);
  }
}
