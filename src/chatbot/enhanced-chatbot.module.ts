import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { ChatbotService } from './chatbot-enhanced.service';
import { ChatbotEmitterService } from './chatbot-emitter.service';
import { ChatbotSchedulerService } from './chatbot-scheduler.service';

// Controller
import { ChatbotController } from './enhanced-chatbot.controller';

// Entities
import { ChatbotConversation } from './entities/chatbot-conversation.entity';

// External entities
import { DailyCheckin } from '../daily-checkins/entities/daily-checkin.entity';
import { BurnoutAssessment } from '../burnout-assesment/entities/burnout-assesment.entity';
import { Reminder } from '../reminders/entities/reminder.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Chatbot entities
      ChatbotConversation,
      
      // External entities
      DailyCheckin,
      BurnoutAssessment,
      Reminder,
      User,
    ]),
  ],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    ChatbotEmitterService,
    ChatbotSchedulerService,
  ],
  exports: [
    ChatbotService,
    ChatbotEmitterService,
    ChatbotSchedulerService,
  ],
})
export class ChatbotModule {}