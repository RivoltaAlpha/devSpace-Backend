import { Module } from '@nestjs/common';
import { ConversationalContextsService } from './conversational_contexts.service';
import { ConversationalContextsController } from './conversational_contexts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ConversationalContext } from './entities/conversational_context.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ConversationalContext])],
  controllers: [ConversationalContextsController],
  providers: [ConversationalContextsService],
  exports: [ConversationalContextsService],
})
export class ConversationalContextsModule {}
