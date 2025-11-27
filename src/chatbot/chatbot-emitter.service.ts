import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ChatbotService } from './chatbot.service';
import { TypeofReminder } from '../reminders/entities/reminder.entity';
import { CheckinType } from '../daily-checkins/entities/daily-checkin.entity';
import { EmitterResult } from './chatbot-scheduler.service';

interface EmitterEvent {
  type: 'checkin' | 'reminder';
  userId: number;
  data: any;
}


@Injectable()
export class ChatbotEmitterService {
  private readonly logger = new Logger(ChatbotEmitterService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private chatbotService: ChatbotService,
  ) {}

  // === SCHEDULED CHECKINS ===
  
  // Morning checkins - 8 AM daily
  async triggerMorningCheckins(): Promise<EmitterResult[]> {
    this.logger.log('Triggering morning checkins for all active users');
    
    const activeUsers = await this.userRepo.find({
      where: { is_active: true },
    });

    const results: EmitterResult[] = [];
    for (const user of activeUsers) {
      try {
        const result = await this.chatbotService.startDailyCheckin(
          user.user_id,
          CheckinType.MORNING
        );
        results.push({ userId: user.user_id, success: true, conversationId: result.conversationId });
        
        // Emit event for real-time notifications
        this.emitCheckinEvent(user.user_id, 'morning', result.conversationId);
      } catch (error) {
        this.logger.error(`Failed to start morning checkin for user ${user.user_id}:`, error);
        results.push({ userId: user.user_id, success: false, error: error.message });
      }
    }

    return results;
  }

  // Midday checkins - 1 PM daily
  async triggerMiddayCheckins(): Promise<EmitterResult[]> {
    this.logger.log('Triggering midday checkins for all active users');
    
    const activeUsers = await this.userRepo.find({
      where: { is_active: true },
    });

    const results: EmitterResult[] = [];
    for (const user of activeUsers) {
      try {
        const result = await this.chatbotService.startDailyCheckin(
          user.user_id,
          CheckinType.CUSTOM // Using CUSTOM for midday
        );
        results.push({ userId: user.user_id, success: true, conversationId: result.conversationId });
        
        // Emit event for real-time notifications
        this.emitCheckinEvent(user.user_id, 'midday', result.conversationId);
      } catch (error) {
        this.logger.error(`Failed to start midday checkin for user ${user.user_id}:`, error);
        results.push({ userId: user.user_id, success: false, error: error.message });
      }
    }

    return results;
  }

  // Evening checkins - 7 PM daily
  async triggerEveningCheckins(): Promise<EmitterResult[]> {
    this.logger.log('Triggering evening checkins for all active users');
    
    const activeUsers = await this.userRepo.find({
      where: { is_active: true },
    });

    const results: EmitterResult[] = [];
    for (const user of activeUsers) {
      try {
        const result = await this.chatbotService.startDailyCheckin(
          user.user_id,
          CheckinType.EVENING
        );
        results.push({ userId: user.user_id, success: true, conversationId: result.conversationId });
        
        // Emit event for real-time notifications
        this.emitCheckinEvent(user.user_id, 'evening', result.conversationId);
      } catch (error) {
        this.logger.error(`Failed to start evening checkin for user ${user.user_id}:`, error);
        results.push({ userId: user.user_id, success: false, error: error.message });
      }
    }

    return results;
  }

  // === SCHEDULED REMINDERS ===
  
  // Water reminders - Every 2 hours during work hours (9 AM - 6 PM)
  async triggerWaterReminders(): Promise<EmitterResult[]> {
    this.logger.log('Triggering water reminders');
    return this.triggerReminderForAllUsers(TypeofReminder.DRINK_WATER);
  }

  // Screen break reminders - Every hour during work hours
  async triggerScreenBreakReminders(): Promise<EmitterResult[]> {
    this.logger.log('Triggering screen break reminders');
    return this.triggerReminderForAllUsers(TypeofReminder.SCREEN_TIME_BREAK);
  }

  // Code break reminders - Every 90 minutes during work hours
  async triggerCodeBreakReminders(): Promise<EmitterResult[]> {
    this.logger.log('Triggering code break reminders');
    return this.triggerReminderForAllUsers(TypeofReminder.CODE_BREAK);
  }

  // Creative digest - Once daily at 3 PM
  async triggerCreativeDigestReminders(): Promise<EmitterResult[]> {
    this.logger.log('Triggering creative digest reminders');
    return this.triggerReminderForAllUsers(TypeofReminder.CREATIVE_DIGEST);
  }

  // Posture check - Every 45 minutes during work hours
  async triggerPostureCheckReminders(): Promise<EmitterResult[]> {
    this.logger.log('Triggering posture check reminders');
    return this.triggerReminderForAllUsers(TypeofReminder.POSTURE_CHECK);
  }

  // Deep breathing - Twice daily (11 AM, 4 PM)
  async triggerDeepBreathingReminders(): Promise<EmitterResult[]> {
    this.logger.log('Triggering deep breathing reminders');
    return this.triggerReminderForAllUsers(TypeofReminder.DEEP_BREATHING);
  }

  // Stretch break - Every 2 hours during work hours
  async triggerStretchBreakReminders(): Promise<EmitterResult[]> {
    this.logger.log('Triggering stretch break reminders');
    return this.triggerReminderForAllUsers(TypeofReminder.STRETCH_BREAK);
  }

  // Mental health checkin - Once weekly (Friday 4 PM)
  async triggerMentalHealthCheckins(): Promise<EmitterResult[]> {
    this.logger.log('Triggering weekly mental health checkins');
    return this.triggerReminderForAllUsers(TypeofReminder.MENTAL_HEALTH_CHECKIN);
  }

  // === HELPER METHODS ===
  
  private async triggerReminderForAllUsers(reminderType: TypeofReminder): Promise<EmitterResult[]> {
    const activeUsers = await this.userRepo.find({
      where: { is_active: true },
    });

    const results: EmitterResult[] = [];
    for (const user of activeUsers) {
      try {
        const result = await this.chatbotService.createAutomatedReminder(
          user.user_id,
          reminderType
        );
        results.push({ 
          userId: user.user_id, 
          success: true, 
          reminderId: result.reminderId,
          conversationId: result.conversationId 
        });
        
        // Emit event for real-time notifications
        this.emitReminderEvent(user.user_id, reminderType, result.conversationId, result.message);
      } catch (error) {
        this.logger.error(`Failed to create ${reminderType} reminder for user ${user.user_id}:`, error);
        results.push({ userId: user.user_id, success: false, error: error.message });
      }
    }

    return results;
  }

  // === MANUAL TRIGGERS ===
  
  async triggerManualCheckin(userId: number, checkinType: CheckinType): Promise<any> {
    this.logger.log(`Manual checkin triggered for user ${userId}: ${checkinType}`);
    
    try {
      const result = await this.chatbotService.startDailyCheckin(userId, checkinType);
      this.emitCheckinEvent(userId, checkinType, result.conversationId);
      return { success: true, ...result };
    } catch (error) {
      this.logger.error(`Failed manual checkin for user ${userId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async triggerManualReminder(userId: number, reminderType: TypeofReminder): Promise<any> {
    this.logger.log(`Manual reminder triggered for user ${userId}: ${reminderType}`);
    
    try {
      const result = await this.chatbotService.createAutomatedReminder(userId, reminderType);
      this.emitReminderEvent(userId, reminderType, result.conversationId, result.message);
      return { success: true, ...result };
    } catch (error) {
      this.logger.error(`Failed manual reminder for user ${userId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async triggerBurnoutAssessment(userId: number): Promise<any> {
    this.logger.log(`Burnout assessment triggered for user ${userId}`);
    
    try {
      const result = await this.chatbotService.startBurnoutAssessment(userId);
      this.emitMentalHealthEvent(userId, 'burnout_assessment', result.conversationId);
      return { success: true, ...result };
    } catch (error) {
      this.logger.error(`Failed burnout assessment for user ${userId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // === EVENT EMITTERS ===
  
  private emitCheckinEvent(userId: number, checkinType: string, conversationId: string) {
    const event: EmitterEvent = {
      type: 'checkin',
      userId,
      data: {
        checkinType,
        conversationId,
        timestamp: new Date(),
        message: `Time for your ${checkinType} check-in!`,
      },
    };
    
    // In a real app, you'd emit to EventEmitter2 or WebSocket
    this.logger.log(`Emitting checkin event for user ${userId}: ${checkinType}`);
    // eventEmitter.emit('chatbot.checkin', event);
  }

  private emitReminderEvent(userId: number, reminderType: TypeofReminder, conversationId: string, message: string) {
    const event: EmitterEvent = {
      type: 'reminder',
      userId,
      data: {
        reminderType,
        conversationId,
        message,
        timestamp: new Date(),
      },
    };
    
    // In a real app, you'd emit to EventEmitter2 or WebSocket
    this.logger.log(`Emitting reminder event for user ${userId}: ${reminderType}`);
    // eventEmitter.emit('chatbot.reminder', event);
  }

  private emitMentalHealthEvent(userId: number, type: string, conversationId: string) {
    const event: EmitterEvent = {
      type: 'checkin', // mental health events are a type of checkin
      userId,
      data: {
        type,
        conversationId,
        timestamp: new Date(),
        message: 'Time for a burnout check - let\'s see how you\'re doing.',
      },
    };
    
    this.logger.log(`Emitting mental health event for user ${userId}: ${type}`);
    // eventEmitter.emit('chatbot.mental_health', event);
  }

  // === STATUS AND ANALYTICS ===
  
  async getEmitterStats() {
    // This could return statistics about reminder effectiveness, user engagement, etc.
    return {
      totalUsers: await this.userRepo.count({ where: { is_active: true } }),
      lastTriggered: new Date(),
      // Add more stats as needed
    };
  }
}