import { Module } from '@nestjs/common';
import { MessagingService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagingGateway } from './messages.gateway';
import { User } from 'src/users/entities/user.entity';
import { Message } from './entities/message.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, User]),
  ],
  controllers: [MessagesController],
  providers: [MessagingService, MessagingGateway],
  exports: [MessagingService],
})
export class MessagesModule {}
