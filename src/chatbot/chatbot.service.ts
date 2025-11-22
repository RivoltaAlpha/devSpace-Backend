import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyCheckin, CheckinType } from '../entities/daily-checkin.entity';
import { MentalLoadDump } from '../entities/mental-load-dump.entity';
import { BurnoutAssessment } from 'src/burnout-assesment/entities/burnout-assesment.entity';
import { ChatbotConversation } from '../entities/chatbot-conversation.entity';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(DailyCheckin)
    private checkinRepo: Repository<DailyCheckin>,
    @InjectRepository(MentalLoadDump)
    private mentalLoadRepo: Repository<MentalLoadDump>,
    @InjectRepository(BurnoutAssessment)
    private burnoutRepo: Repository<BurnoutAssessment>,
    @InjectRepository(ChatbotConversation)
    private conversationRepo: Repository<ChatbotConversation>,
  ) {}

  async startDailyCheckin(userId: string, checkinType: CheckinType) {
    const conversation = this.conversationRepo.create({
      userId,
      conversationType: `${checkinType}-checkin`,
      messages: [],
      context: { step: 'mood', checkinType },
    });

    await this.conversationRepo.save(conversation);

    const greeting = this.getCheckinGreeting(checkinType);
    const firstQuestion = "On a scale of 1-10, how would you rate your mood right now?";

    const messages: ChatMessage[] = [
      { role: 'assistant', content: greeting, timestamp: new Date() },
      { role: 'assistant', content: firstQuestion, timestamp: new Date() },
    ];

    conversation.messages = messages;
    await this.conversationRepo.save(conversation);

    return { conversationId: conversation.id, messages };
  }

  async processChatbotMessage(conversationId: string, userId: string, message: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Add user message
    const messages = conversation.messages as ChatMessage[];
    messages.push({ role: 'user', content: message, timestamp: new Date() });

    // Process based on conversation type and context
    const response = await this.generateResponse(conversation, message);
    messages.push({ role: 'assistant', content: response.message, timestamp: new Date() });

    conversation.messages = messages;
    conversation.context = response.context;
    conversation.isCompleted = response.isCompleted;

    await this.conversationRepo.save(conversation);

    // If completed, save the data
    if (response.isCompleted && response.data) {
      await this.saveCheckinData(userId, response.data, conversation.conversationType);
    }

    return { messages, isCompleted: response.isCompleted };
  }

  private async generateResponse(conversation: any, userMessage: string) {
    const type = conversation.conversationType;
    const context = conversation.context || {};

    if (type.includes('checkin')) {
      return this.handleCheckinFlow(context, userMessage);
    } else if (type === 'mental-load-dump') {
      return this.handleMentalLoadDump(context, userMessage);
    } else if (type === 'burnout-assessment') {
      return this.handleBurnoutAssessment(context, userMessage);
    }

    return { message: "I'm not sure how to help with that.", context, isCompleted: false };
  }

  private handleCheckinFlow(context: any, userMessage: string) {
    const step = context.step;
    const data = context.data || {};

    switch (step) {
      case 'mood':
        const moodScore = parseInt(userMessage);
        if (isNaN(moodScore) || moodScore < 1 || moodScore > 10) {
          return {
            message: "Please provide a number between 1 and 10.",
            context,
            isCompleted: false,
          };
        }
        data.moodScore = moodScore;
        return {
          message: "Got it. How's your energy level today? (1-10)",
          context: { ...context, step: 'energy', data },
          isCompleted: false,
        };

      case 'energy':
        const energyLevel = parseInt(userMessage);
        if (isNaN(energyLevel) || energyLevel < 1 || energyLevel > 10) {
          return {
            message: "Please provide a number between 1 and 10.",
            context,
            isCompleted: false,
          };
        }
        data.energyLevel = energyLevel;
        return {
          message: "And your stress level? (1-10, where 10 is most stressed)",
          context: { ...context, step: 'stress', data },
          isCompleted: false,
        };

      case 'stress':
        const stressLevel = parseInt(userMessage);
        if (isNaN(stressLevel) || stressLevel < 1 || stressLevel > 10) {
          return {
            message: "Please provide a number between 1 and 10.",
            context,
            isCompleted: false,
          };
        }
        data.stressLevel = stressLevel;
        return {
          message: "How did you sleep last night? (1-10)",
          context: { ...context, step: 'sleep', data },
          isCompleted: false,
        };

      case 'sleep':
        const sleepQuality = parseInt(userMessage);
        if (isNaN(sleepQuality) || sleepQuality < 1 || sleepQuality > 10) {
          return {
            message: "Please provide a number between 1 and 10.",
            context,
            isCompleted: false,
          };
        }
        data.sleepQuality = sleepQuality;
        return {
          message: "Lastly, any notes you'd like to add about how you're feeling?",
          context: { ...context, step: 'note', data },
          isCompleted: false,
        };

      case 'note':
        data.note = userMessage !== 'skip' ? userMessage : null;
        const summary = this.generateCheckinSummary(data);
        return {
          message: `Thanks for checking in! ${summary}`,
          context: { ...context, data },
          data,
          isCompleted: true,
        };

      default:
        return {
          message: "Something went wrong. Let's start over.",
          context: { step: 'mood' },
          isCompleted: false,
        };
    }
  }

  private handleMentalLoadDump(context: any, userMessage: string) {
    if (!context.started) {
      return {
        message: "What's on your mind? Just type everything out - no judgment, no filter.",
        context: { started: true },
        isCompleted: false,
      };
    }

    return {
      message: "Got it. I've saved your thoughts. Remember, it's okay to feel overwhelmed sometimes. Would you like some coping strategies for what you shared?",
      context,
      data: { content: userMessage },
      isCompleted: true,
    };
  }

  private handleBurnoutAssessment(context: any, userMessage: string) {
    // Implement burnout assessment flow similar to check-in
    // This would ask questions about emotional exhaustion, etc.
    return {
      message: "Burnout assessment coming soon...",
      context,
      isCompleted: true,
    };
  }

  private async saveCheckinData(userId: string, data: any, type: string) {
    if (type.includes('checkin')) {
      const checkinType = type.includes('morning') ? CheckinType.MORNING : CheckinType.EVENING;
      const checkin = this.checkinRepo.create({
        userId,
        checkinType,
        ...data,
      });
      await this.checkinRepo.save(checkin);
    } else if (type === 'mental-load-dump') {
      const dump = this.mentalLoadRepo.create({
        userId,
        content: data.content,
      });
      await this.mentalLoadRepo.save(dump);
    }
  }

  private getCheckinGreeting(type: CheckinType): string {
    if (type === CheckinType.MORNING) {
      return "Good morning! Let's start your day with a quick check-in. This will only take a minute.";
    }
    return "Hey there! Let's wrap up your day with a quick evening check-in.";
  }

  private generateCheckinSummary(data: any): string {
    const insights: string[] = [];

    if (data.moodScore >= 7) {
      insights.push("Your mood seems good today!");
    } else if (data.moodScore <= 4) {
      insights.push("I notice your mood is lower today. Remember, it's okay to have tough days.");
    }

    if (data.stressLevel >= 7) {
      insights.push("Your stress levels are high. Consider taking some breaks today.");
    }

    if (data.sleepQuality <= 4) {
      insights.push("Poor sleep can affect your day. Try to prioritize rest tonight.");
    }

    return insights.join(" ") || "I've logged your check-in. Keep taking care of yourself!";
  }
}