import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckinType } from '../../daily-checkins/entities/daily-checkin.entity';
import { TypeofReminder } from '../../reminders/entities/reminder.entity';

// === REQUEST DTOs ===

export class StartCheckinDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ enum: CheckinType, example: CheckinType.MORNING })
  @IsEnum(CheckinType)
  checkinType: CheckinType;
}

export class ProcessMessageDto {
  @ApiProperty({ example: 'conv-123-456', description: 'Conversation ID' })
  @IsString()
  conversationId: string;

  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '7', description: 'User message/response' })
  @IsString()
  message: string;
}

export class CreateReminderDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ enum: TypeofReminder, example: TypeofReminder.DRINK_WATER })
  @IsEnum(TypeofReminder)
  reminderType: TypeofReminder;
}

export class RespondReminderDto {
  @ApiProperty({ example: 'conv-123-456', description: 'Conversation ID' })
  @IsString()
  conversationId: string;

  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'Done!', description: 'User response to reminder' })
  @IsString()
  response: string;
}

export class StartBurnoutAssessmentDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  userId: number;
}

// === RESPONSE DTOs ===

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'], example: 'assistant' })
  role: 'user' | 'assistant';

  @ApiProperty({ example: 'How are you feeling today?', description: 'Message content' })
  content: string;

  @ApiProperty({ example: '2024-11-27T10:30:00Z', description: 'Message timestamp' })
  timestamp: Date;
}

export class ConversationResponseDto {
  @ApiProperty({ example: 'conv-123-456', description: 'Conversation ID' })
  conversationId: string;

  @ApiProperty({ type: [ChatMessageDto], description: 'Conversation messages' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages?: ChatMessageDto[];

  @ApiProperty({ example: false, description: 'Whether conversation is completed' })
  @IsOptional()
  isCompleted?: boolean;
}

export class ReminderResponseDto {
  @ApiProperty({ example: 1, description: 'Reminder ID' })
  reminderId: number;

  @ApiProperty({ example: 'conv-123-456', description: 'Conversation ID' })
  conversationId: string;

  @ApiProperty({ example: '💧 Time to hydrate! Have you had water in the last 2 hours?', description: 'Reminder message' })
  message: string;
}

export class BulkOperationResponseDto {
  @ApiProperty({ example: 25, description: 'Number of successful operations' })
  successful: number;

  @ApiProperty({ example: 2, description: 'Number of failed operations' })
  failed: number;

  @ApiProperty({ example: 27, description: 'Total operations attempted' })
  total: number;

  @ApiProperty({ example: ['User 3 not found', 'User 7 inactive'], description: 'Error details if any' })
  @IsOptional()
  errors?: string[];
}

export class SystemStatusDto {
  @ApiProperty({ example: 'active', description: 'System status' })
  status: string;

  @ApiProperty({ example: '2024-11-27T10:30:00Z', description: 'Status timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Emitter service statistics' })
  emitter: {
    totalUsers: number;
    lastTriggered: Date;
  };

  @ApiProperty({ description: 'Scheduler service status' })
  scheduler: {
    schedulerActive: boolean;
    lastHealthCheck: Date;
    userStats: any;
    upcomingSchedules: any[];
  };
}

export class ReminderTypesResponseDto {
  @ApiProperty({ enum: TypeofReminder, isArray: true })
  types: TypeofReminder[];

  @ApiProperty({ 
    example: {
      'DRINK_WATER': 'Hydration reminders to keep users healthy',
      'SCREEN_TIME_BREAK': 'Eye health reminders for screen breaks'
    },
    description: 'Descriptions for each reminder type' 
  })
  descriptions: Record<string, string>;
}

export class CheckinTypesResponseDto {
  @ApiProperty({ enum: CheckinType, isArray: true })
  types: CheckinType[];

  @ApiProperty({ 
    example: {
      'MORNING': 'Start the day with mood and energy tracking',
      'EVENING': 'End the day with reflection and planning'
    },
    description: 'Descriptions for each checkin type' 
  })
  descriptions: Record<string, string>;
}

export class AnalyticsSummaryDto {
  @ApiProperty({ example: 127, description: 'Total active users' })
  totalActiveUsers: number;

  @ApiProperty({ example: 3600, description: 'System uptime in seconds' })
  systemUptime: number;

  @ApiProperty({ example: '2024-11-27T10:30:00Z', description: 'Last update timestamp' })
  lastUpdate: Date;

  @ApiProperty({
    example: {
      dailyCheckins: true,
      automatedReminders: true,
      burnoutAssessment: true
    },
    description: 'Available system features'
  })
  features: Record<string, boolean>;
}