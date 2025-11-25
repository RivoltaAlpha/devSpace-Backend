# Chatbot System Documentation

## Overview

This comprehensive chatbot system provides automated mental health support for developers through:
- **Daily Check-ins** (Morning, Midday, Evening)
- **Automated Reminders** (Water, breaks, posture, etc.)
- **Mental Load Dumps** (Safe space to express thoughts)
- **Burnout Assessments** (Weekly mental health evaluations)
- **Context-Aware Conversations** (Personalized responses)

## Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   ChatbotController │────│  ChatbotService      │────│     Database        │
│   (API Endpoints)   │    │  (Core Logic)        │    │   (Conversations,   │
└─────────────────────┘    └──────────────────────┘    │    Reminders, etc.) │
           │                          │                 └─────────────────────┘
           │                          │
┌─────────────────────┐    ┌──────────────────────┐
│ ChatbotEmitterService│────│ChatbotSchedulerService│
│ (Event Triggers)    │    │  (Cron Jobs)         │
└─────────────────────┘    └──────────────────────┘
```

## Entities

### 1. ChatbotConversation
Stores conversation sessions with context and message history.

```typescript
{
  id: string;
  user: User;
  conversationType: ConversationType;
  messages: ChatMessage[];
  context: any;
  isCompleted: boolean;
  metadata?: any;
}
```

### 2. MentalLoadDump
Stores user thoughts and mental dumps with analysis.

```typescript
{
  id: string;
  user: User;
  content: string;
  mood?: string;
  tags?: string[];
  stress_level?: number;
}
```

### 3. AutomatedReminder
Tracks automated reminder interactions.

```typescript
{
  id: string;
  user: User;
  reminderType: ReminderType;
  message: string;
  isInteracted: boolean;
  userResponse?: string;
}
```

## Services

### ChatbotService (Core)
- `startDailyCheckin()` - Initialize daily check-in flows
- `startMentalLoadDump()` - Begin mental load dump session
- `startBurnoutAssessment()` - Start burnout evaluation
- `processChatbotMessage()` - Handle conversational flow
- `createAutomatedReminder()` - Generate reminders
- `respondToReminder()` - Process reminder responses

### ChatbotEmitterService (Event Management)
- `triggerMorningCheckins()` - Send morning check-ins to all users
- `triggerWaterReminders()` - Send hydration reminders
- `triggerScreenBreakReminders()` - Send screen break alerts
- Manual trigger methods for individual users

### ChatbotSchedulerService (Automation)
- Cron job scheduling for automated triggers
- Health monitoring and status tracking
- Bulk operation management

## API Endpoints

### Daily Check-ins
```http
POST /chatbot/checkin/start
Body: { userId: number, checkinType: 'morning'|'evening'|'custom' }

POST /chatbot/mental-load-dump/start
Body: { userId: number }

POST /chatbot/burnout-assessment/start
Body: { userId: number }
```

### Message Processing
```http
POST /chatbot/message/process
Body: { conversationId: string, userId: number, message: string }
```

### Reminders
```http
POST /chatbot/reminder/create
Body: { userId: number, reminderType: ReminderType }

POST /chatbot/reminder/respond
Body: { conversationId: string, userId: number, response: string }
```

### Manual Triggers
```http
POST /chatbot/trigger/checkin/:userId?type=morning
POST /chatbot/trigger/reminder/:userId?type=drink_water
POST /chatbot/trigger/mental-load-dump/:userId
POST /chatbot/trigger/burnout-assessment/:userId
```

### Bulk Operations (Admin)
```http
POST /chatbot/bulk/morning-checkins
POST /chatbot/bulk/water-reminders
POST /chatbot/bulk/screen-break-reminders
```

### System Status
```http
GET /chatbot/status
GET /chatbot/reminder-types
GET /chatbot/analytics/summary
```

## Reminder Types

| Type | Description | Frequency |
|------|-------------|-----------|
| `DRINK_WATER` | Hydration reminders | Every 2 hours (9AM-6PM) |
| `SCREEN_TIME_BREAK` | Eye rest (20-20-20 rule) | Every hour (work hours) |
| `CODE_BREAK` | Mental coding breaks | Every 90 minutes |
| `CREATIVE_DIGEST` | Inspiration content | Daily at 3PM |
| `POSTURE_CHECK` | Physical wellness | Every 45 minutes |
| `DEEP_BREATHING` | Stress relief | 11AM & 4PM |
| `STRETCH_BREAK` | Physical movement | Every 2 hours |
| `MENTAL_HEALTH_CHECKIN` | Weekly assessment | Fridays at 4PM |

## Check-in Types

| Type | Description | Timing |
|------|-------------|--------|
| `MORNING` | Day starter with mood/energy tracking | 8:00 AM |
| `EVENING` | Day reflection and planning | 7:00 PM |
| `CUSTOM` | Flexible midday check-ins | 1:00 PM |

## Conversation Flows

### Daily Check-in Flow
1. **Mood** - "Rate your mood 1-10"
2. **Energy** - "How's your energy level?"
3. **Stress** - "What's your stress level?"
4. **Productivity** - "How productive do you feel?"
5. **Notes** - "Any additional thoughts?"
6. **Summary** - Personalized insights and encouragement

### Mental Load Dump Flow
1. **Welcome** - "Safe space to unload thoughts"
2. **Collection** - User types everything freely
3. **Analysis** - AI analyzes stress level, mood, tags
4. **Support** - Offer coping strategies

### Burnout Assessment Flow
1. **Introduction** - Explain assessment process
2. **Questions** - 8 questions about emotional exhaustion
3. **Scoring** - Calculate burnout risk level
4. **Recommendations** - Personalized advice

## Implementation Guide

### 1. Setup Dependencies
```bash
npm install @nestjs/schedule @nestjs/event-emitter
```

### 2. Enable Scheduling (Optional)
To enable automatic cron jobs, uncomment `@Cron()` decorators in `ChatbotSchedulerService`.

### 3. Database Migration
The entities will auto-sync if `synchronize: true` is set in database config.

### 4. Integration
```typescript
// In your module
import { ChatbotModule } from './chatbot/enhanced-chatbot.module';

@Module({
  imports: [ChatbotModule],
})
```

### 5. Testing
```bash
# Start a check-in
curl -X POST http://localhost:8000/chatbot/checkin/start \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "checkinType": "morning"}'

# Process a message
curl -X POST http://localhost:8000/chatbot/message/process \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "uuid", "userId": 1, "message": "7"}'
```

## Features

### ✅ Implemented
- Multi-flow conversation management
- Context-aware responses
- Automated reminder system
- Stress level analysis
- Mood detection
- Tag extraction
- Burnout risk calculation
- Bulk operations
- Manual triggers
- Status monitoring

### 🔄 Extensible
- Custom reminder schedules per user
- AI-powered response generation
- WebSocket real-time notifications
- Advanced analytics dashboard
- Integration with external mental health APIs
- User preference management

## Mental Health Considerations

### Privacy & Safety
- All conversations are stored securely
- Mental load dumps are confidential
- No judgmental responses
- Crisis detection (can be added)
- Professional referral suggestions

### Evidence-Based Approaches
- Regular check-ins for mood tracking
- Stress level monitoring
- Work-life balance reminders
- Physical wellness integration
- Burnout prevention strategies

## Monitoring & Analytics

The system tracks:
- User engagement rates
- Reminder interaction rates
- Stress level trends
- Check-in completion rates
- System performance metrics

## Scaling Considerations

- Use Redis for session storage in production
- Implement WebSocket for real-time notifications  
- Add queue system for bulk operations
- Consider microservices architecture for high scale
- Implement rate limiting and user preferences

## Contributing

When adding new reminder types or conversation flows:
1. Add new enum values
2. Update service logic
3. Add appropriate database fields
4. Update documentation
5. Test thoroughly with edge cases

This system provides a solid foundation for developer mental health support that can be extended and customized based on specific needs.