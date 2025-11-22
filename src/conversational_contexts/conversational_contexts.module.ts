import { Module } from '@nestjs/common';
import { ConversationalContextsService } from './conversational_contexts.service';
import { ConversationalContextsController } from './conversational_contexts.controller';

@Module({
  controllers: [ConversationalContextsController],
  providers: [ConversationalContextsService],
})
export class ConversationalContextsModule {}
