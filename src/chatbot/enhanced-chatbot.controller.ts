import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatbotService } from './chatbot-enhanced.service';
import { ChatbotEmitterService } from './chatbot-emitter.service';
import { ChatbotSchedulerService } from './chatbot-scheduler.service';
import { CheckinType } from '../daily-checkins/entities/daily-checkin.entity';
import { TypeofReminder } from '../reminders/entities/reminder.entity';
// import { AtGuard } from '../auth/guards/at.guard'; // Uncomment when auth is set up

// DTOs
class StartCheckinDto {
  userId: number;
  checkinType: CheckinType;
}

class ProcessMessageDto {
  conversationId: string;
  userId: number;
  message: string;
}

class CreateReminderDto {
  userId: number;
  reminderType: TypeofReminder;
}

class RespondReminderDto {
  conversationId: string;
  userId: number;
  response: string;
}

@ApiTags('Chatbot')
@Controller('chatbot')
// @UseGuards(AtGuard) // Uncomment when auth is ready
export class ChatbotController {
  constructor(
    private chatbotService: ChatbotService,
    private emitterService: ChatbotEmitterService,
    private schedulerService: ChatbotSchedulerService,
  ) {}

  // === DAILY CHECKINS ===

  @Post('checkin/start')
  @ApiOperation({ summary: 'Start a daily check-in session' })
  @ApiResponse({ status: 201, description: 'Check-in session started successfully' })
  async startCheckin(@Body() dto: StartCheckinDto) {
    return this.chatbotService.startDailyCheckin(dto.userId, dto.checkinType);
  }



  @Post('burnout-assessment/start')
  @ApiOperation({ summary: 'Start a burnout assessment session' })
  @ApiResponse({ status: 201, description: 'Burnout assessment session started successfully' })
  async startBurnoutAssessment(@Body('userId') userId: number) {
    return this.chatbotService.startBurnoutAssessment(userId);
  }

  // === MESSAGE PROCESSING ===

  @Post('message/process')
  @ApiOperation({ summary: 'Process a chatbot message' })
  @ApiResponse({ status: 200, description: 'Message processed successfully' })
  async processMessage(@Body() dto: ProcessMessageDto) {
    return this.chatbotService.processChatbotMessage(
      dto.conversationId,
      dto.userId,
      dto.message
    );
  }

  // === REMINDERS ===

  @Post('reminder/create')
  @ApiOperation({ summary: 'Create an automated reminder' })
  @ApiResponse({ status: 201, description: 'Reminder created successfully' })
  async createReminder(@Body() dto: CreateReminderDto) {
    return this.chatbotService.createAutomatedReminder(dto.userId, dto.reminderType);
  }

  @Post('reminder/respond')
  @ApiOperation({ summary: 'Respond to a reminder' })
  @ApiResponse({ status: 200, description: 'Reminder response recorded' })
  async respondToReminder(@Body() dto: RespondReminderDto) {
    return this.chatbotService.respondToReminder(
      dto.conversationId,
      dto.userId,
      dto.response
    );
  }

  // === MANUAL TRIGGERS (for testing or admin) ===

  @Post('trigger/checkin/:userId')
  @ApiOperation({ summary: 'Manually trigger a check-in for a user' })
  @ApiResponse({ status: 200, description: 'Check-in triggered successfully' })
  async triggerManualCheckin(
    @Param('userId') userId: number,
    @Query('type') checkinType: CheckinType = CheckinType.CUSTOM
  ) {
    return this.emitterService.triggerManualCheckin(userId, checkinType);
  }

  @Post('trigger/reminder/:userId')
  @ApiOperation({ summary: 'Manually trigger a reminder for a user' })
  @ApiResponse({ status: 200, description: 'Reminder triggered successfully' })
  async triggerManualReminder(
    @Param('userId') userId: number,
    @Query('type') reminderType: TypeofReminder
  ) {
    return this.emitterService.triggerManualReminder(userId, reminderType);
  }



  @Post('trigger/burnout-assessment/:userId')
  @ApiOperation({ summary: 'Manually trigger a burnout assessment for a user' })
  @ApiResponse({ status: 200, description: 'Burnout assessment triggered successfully' })
  async triggerBurnoutAssessment(@Param('userId') userId: number) {
    return this.emitterService.triggerBurnoutAssessment(userId);
  }

  // === BULK OPERATIONS (admin only) ===

  @Post('bulk/morning-checkins')
  @ApiOperation({ summary: 'Trigger morning check-ins for all users' })
  @ApiResponse({ status: 200, description: 'Morning check-ins triggered for all users' })
  async triggerBulkMorningCheckins() {
    return this.emitterService.triggerMorningCheckins();
  }

  @Post('bulk/evening-checkins')
  @ApiOperation({ summary: 'Trigger evening check-ins for all users' })
  @ApiResponse({ status: 200, description: 'Evening check-ins triggered for all users' })
  async triggerBulkEveningCheckins() {
    return this.emitterService.triggerEveningCheckins();
  }

  @Post('bulk/water-reminders')
  @ApiOperation({ summary: 'Send water reminders to all users' })
  @ApiResponse({ status: 200, description: 'Water reminders sent to all users' })
  async triggerBulkWaterReminders() {
    return this.emitterService.triggerWaterReminders();
  }

  @Post('bulk/screen-break-reminders')
  @ApiOperation({ summary: 'Send screen break reminders to all users' })
  @ApiResponse({ status: 200, description: 'Screen break reminders sent to all users' })
  async triggerBulkScreenBreakReminders() {
    return this.emitterService.triggerScreenBreakReminders();
  }

  // === SCHEDULER CONTROLS ===

  @Post('scheduler/morning-routines')
  @ApiOperation({ summary: 'Manually trigger all morning routines' })
  @ApiResponse({ status: 200, description: 'Morning routines executed' })
  async triggerMorningRoutines() {
    return this.schedulerService.triggerAllMorningRoutines();
  }

  @Post('scheduler/afternoon-routines')
  @ApiOperation({ summary: 'Manually trigger all afternoon routines' })
  @ApiResponse({ status: 200, description: 'Afternoon routines executed' })
  async triggerAfternoonRoutines() {
    return this.schedulerService.triggerAllAfternoonRoutines();
  }

  @Post('scheduler/evening-routines')
  @ApiOperation({ summary: 'Manually trigger all evening routines' })
  @ApiResponse({ status: 200, description: 'Evening routines executed' })
  async triggerEveningRoutines() {
    return this.schedulerService.triggerAllEveningRoutines();
  }

  // === STATUS AND MONITORING ===

  @Get('status')
  @ApiOperation({ summary: 'Get chatbot system status' })
  @ApiResponse({ status: 200, description: 'System status retrieved' })
  async getSystemStatus() {
    const emitterStats = await this.emitterService.getEmitterStats();
    const schedulerStatus = await this.schedulerService.getSchedulerStatus();
    
    return {
      status: 'active',
      timestamp: new Date(),
      emitter: emitterStats,
      scheduler: schedulerStatus,
    };
  }

  @Get('reminder-types')
  @ApiOperation({ summary: 'Get available reminder types' })
  @ApiResponse({ status: 200, description: 'Available reminder types' })
  getReminderTypes() {
    return {
      types: Object.values(TypeofReminder),
      descriptions: {
        [TypeofReminder.DRINK_WATER]: 'Hydration reminders to keep users healthy',
        [TypeofReminder.SCREEN_TIME_BREAK]: 'Eye health reminders for screen breaks',
        [TypeofReminder.CODE_BREAK]: 'Mental breaks from coding to prevent burnout',
        [TypeofReminder.CREATIVE_DIGEST]: 'Creative inspiration and learning content',
        [TypeofReminder.POSTURE_CHECK]: 'Physical wellness and posture reminders',
        [TypeofReminder.DEEP_BREATHING]: 'Stress relief through breathing exercises',
        [TypeofReminder.STRETCH_BREAK]: 'Physical movement and stretching reminders',
        [TypeofReminder.MENTAL_HEALTH_CHECKIN]: 'Weekly mental wellness check-ins',
      },
    };
  }

  @Get('checkin-types')
  @ApiOperation({ summary: 'Get available check-in types' })
  @ApiResponse({ status: 200, description: 'Available check-in types' })
  getCheckinTypes() {
    return {
      types: Object.values(CheckinType),
      descriptions: {
        [CheckinType.MORNING]: 'Start the day with mood and energy tracking',
        [CheckinType.EVENING]: 'End the day with reflection and planning',
        [CheckinType.CUSTOM]: 'Flexible check-ins for midday or special occasions',
      },
    };
  }

  // === ANALYTICS (basic) ===

  @Get('analytics/summary')
  @ApiOperation({ summary: 'Get basic chatbot analytics' })
  @ApiResponse({ status: 200, description: 'Analytics summary retrieved' })
  async getAnalyticsSummary() {
    // This would typically aggregate data from your database
    // For now, return basic info
    const stats = await this.emitterService.getEmitterStats();
    
    return {
      totalActiveUsers: stats.totalUsers,
      systemUptime: process.uptime(),
      lastUpdate: new Date(),
      // Add more analytics as your system grows
      features: {
        dailyCheckins: true,
        automatedReminders: true,
        mentalLoadDump: true,
        burnoutAssessment: true,
        scheduledNotifications: true,
      },
    };
  }
}