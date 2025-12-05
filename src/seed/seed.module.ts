import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

// Entity imports
import { User } from '../users/entities/user.entity';
import { DeveloperProfile } from '../developer-profile/entities/developer-profile.entity';
import { TherapistProfile } from '../therapist-profile/entities/therapist-profile.entity';
import { Resource } from '../resources/entities/resource.entity';
import { BurnoutAssessment } from '../burnout-assesment/entities/burnout-assesment.entity';
import { DailyCheckin } from '../daily-checkins/entities/daily-checkin.entity';
import { Reminder } from '../reminders/entities/reminder.entity';
import { ConversationalContext } from '../conversational_contexts/entities/conversational_context.entity';
import { ChatbotConversation } from '../chatbot/entities/chatbot-conversation.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { Message } from '../messages/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DeveloperProfile,
      TherapistProfile,
      Resource,
      BurnoutAssessment,
      DailyCheckin,
      Reminder,
      ConversationalContext,
      ChatbotConversation,
      Appointment,
      Conversation,
      Message,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
