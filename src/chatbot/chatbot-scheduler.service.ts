import { Injectable, Logger } from '@nestjs/common';
import { ChatbotEmitterService } from './chatbot-emitter.service';
import { Cron } from '@nestjs/schedule';

// Import the EmitterResult interface from the emitter service to avoid type conflicts
export interface EmitterResult {
  userId: number;
  success: boolean;
  conversationId?: string;
  reminderId?: string | number;
  error?: string;
}

interface ScheduleItem {
  type: string;
  next: Date;
}

@Injectable()
export class ChatbotSchedulerService {
  private readonly logger = new Logger(ChatbotSchedulerService.name);

  constructor(private emitterService: ChatbotEmitterService) {}

  // === DAILY CHECKINS SCHEDULE ===
  
  //  8:00 AM daily
  @Cron('0 8 * * *')
  async scheduleMorningCheckins() {
    this.logger.log('Scheduled morning checkins starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerMorningCheckins();
      this.logger.log(`Morning checkins completed: ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed`);
    } catch (error) {
      this.logger.error('Failed to schedule morning checkins:', error);
    }
  }

  @Cron('0 13 * * 1-5') 
  // 1:00 PM weekdays only
  async scheduleMiddayCheckins() {
    this.logger.log('Scheduled midday checkins starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerMiddayCheckins();
      this.logger.log(`Midday checkins completed: ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed`);
    } catch (error) {
      this.logger.error('Failed to schedule midday checkins:', error);
    }
  }

  @Cron('0 19 * * *') 
  // 7:00 PM daily
  async scheduleEveningCheckins() {
    this.logger.log('Scheduled evening checkins starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerEveningCheckins();
      this.logger.log(`Evening checkins completed: ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed`);
    } catch (error) {
      this.logger.error('Failed to schedule evening checkins:', error);
    }
  }

  // === WELLNESS REMINDERS SCHEDULE ===

  @Cron('0 9,11,13,15,17 * * 1-5') // Every 2 hours during work hours, weekdays
  async scheduleWaterReminders() {
    this.logger.log('Scheduled water reminders starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerWaterReminders();
      this.logger.log(`Water reminders sent: ${results.filter(r => r.success).length} successful`);
    } catch (error) {
      this.logger.error('Failed to schedule water reminders:', error);
    }
  }

  @Cron('0 10,11,12,13,14,15,16,17 * * 1-5') 
  // Every hour during work hours, weekdays  
  async scheduleScreenBreakReminders() {
    this.logger.log('Scheduled screen break reminders starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerScreenBreakReminders();
      this.logger.log(`Screen break reminders sent: ${results.filter(r => r.success).length} successful`);
    } catch (error) {
      this.logger.error('Failed to schedule screen break reminders:', error);
    }
  }

  @Cron('30 9,11,13,15,17 * * 1-5')
  // Every 90 minutes during work hours, weekdays
  async scheduleCodeBreakReminders() {
    this.logger.log('Scheduled code break reminders starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerCodeBreakReminders();
      this.logger.log(`Code break reminders sent: ${results.filter(r => r.success).length} successful`);
    } catch (error) {
      this.logger.error('Failed to schedule code break reminders:', error);
    }
  }

  @Cron('0 15 * * 1-5') // 3:00 PM weekdays
  async scheduleCreativeDigestReminders() {
    this.logger.log('Scheduled creative digest reminders starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerCreativeDigestReminders();
      this.logger.log(`Creative digest reminders sent: ${results.filter(r => r.success).length} successful`);
    } catch (error) {
      this.logger.error('Failed to schedule creative digest reminders:', error);
    }
  }

  @Cron('15 9,10,11,12,13,14,15,16,17 * * 1-5') // Every 45 minutes during work hours
  async schedulePostureCheckReminders() {
    this.logger.log('Scheduled posture check reminders starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerPostureCheckReminders();
      this.logger.log(`Posture check reminders sent: ${results.filter(r => r.success).length} successful`);
    } catch (error) {
      this.logger.error('Failed to schedule posture check reminders:', error);
    }
  }

  @Cron('0 11,16 * * 1-5') // 11:00 AM and 4:00 PM weekdays
  async scheduleDeepBreathingReminders() {
    this.logger.log('Scheduled deep breathing reminders starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerDeepBreathingReminders();
      this.logger.log(`Deep breathing reminders sent: ${results.filter(r => r.success).length} successful`);
    } catch (error) {
      this.logger.error('Failed to schedule deep breathing reminders:', error);
    }
  }

  @Cron('0 10,12,14,16 * * 1-5') // Every 2 hours starting at 10 AM, weekdays
  async scheduleStretchBreakReminders() {
    this.logger.log('Scheduled stretch break reminders starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerStretchBreakReminders();
      this.logger.log(`Stretch break reminders sent: ${results.filter(r => r.success).length} successful`);
    } catch (error) {
      this.logger.error('Failed to schedule stretch break reminders:', error);
    }
  }

  @Cron('0 16 * * 5') // 4:00 PM every Friday
  async scheduleMentalHealthCheckins() {
    this.logger.log('Scheduled weekly mental health checkins starting...');
    try {
      const results: EmitterResult[] = await this.emitterService.triggerMentalHealthCheckins();
      this.logger.log(`Mental health checkins sent: ${results.filter(r => r.success).length} successful`);
    } catch (error) {
      this.logger.error('Failed to schedule mental health checkins:', error);
    }
  }

  // === MANUAL TRIGGER METHODS (for testing or admin use) ===

  async triggerAllMorningRoutines() {
    this.logger.log('Manually triggering all morning routines...');
    await this.scheduleMorningCheckins();
    await this.scheduleWaterReminders();
    await this.schedulePostureCheckReminders();
  }

  async triggerAllAfternoonRoutines() {
    this.logger.log('Manually triggering all afternoon routines...');
    await this.scheduleMiddayCheckins();
    await this.scheduleCreativeDigestReminders();
    await this.scheduleDeepBreathingReminders();
  }

  async triggerAllEveningRoutines() {
    this.logger.log('Manually triggering all evening routines...');
    await this.scheduleEveningCheckins();
  }

  // === HEALTH CHECK AND MONITORING ===

  async getSchedulerStatus() {
    const stats = await this.emitterService.getEmitterStats();
    return {
      schedulerActive: true,
      lastHealthCheck: new Date(),
      userStats: stats,
      upcomingSchedules: this.getUpcomingSchedules(),
    };
  }

  private getUpcomingSchedules() {
    const now = new Date();
    const schedules: ScheduleItem[] = [];
    
    // Calculate next morning checkin (8 AM next day)
    const nextMorning = new Date(now);
    nextMorning.setDate(now.getDate() + 1);
    nextMorning.setHours(8, 0, 0, 0);
    schedules.push({ type: 'morning_checkin', next: nextMorning });

    // Calculate next water reminder (next even hour)
    const nextWater = new Date(now);
    if (nextWater.getHours() < 9) {
      nextWater.setHours(9, 0, 0, 0);
    } else if (nextWater.getHours() >= 17) {
      nextWater.setDate(now.getDate() + 1);
      nextWater.setHours(9, 0, 0, 0);
    } else {
      const nextHour = Math.ceil((nextWater.getHours() + 1) / 2) * 2;
      nextWater.setHours(nextHour, 0, 0, 0);
    }
    schedules.push({ type: 'water_reminder', next: nextWater });

    return schedules;
  }
}