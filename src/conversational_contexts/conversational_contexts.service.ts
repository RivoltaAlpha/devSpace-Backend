import { Injectable } from '@nestjs/common';
import { CreateConversationalContextDto } from './dto/create-conversational_context.dto';
import { UpdateConversationalContextDto } from './dto/update-conversational_context.dto';

@Injectable()
export class ConversationalContextsService {
  create(createConversationalContextDto: CreateConversationalContextDto) {
    return 'This action adds a new conversationalContext';
  }

  findAll() {
    return `This action returns all conversationalContexts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversationalContext`;
  }

  update(id: number, updateConversationalContextDto: UpdateConversationalContextDto) {
    return `This action updates a #${id} conversationalContext`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversationalContext`;
  }
}
