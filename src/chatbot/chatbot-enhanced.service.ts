import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyCheckin, CheckinType } from '../daily-checkins/entities/daily-checkin.entity';
import { BurnoutAssessment } from '../burnout-assesment/entities/burnout-assesment.entity';
import { ChatbotConversation, ConversationType } from './entities/chatbot-conversation.entity';
import { Reminder, TypeofReminder } from '../reminders/entities/reminder.entity';
import { User } from '../users/entities/user.entity';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  context: any;
  isCompleted: boolean;
  data?: any;
}

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(DailyCheckin)
    private checkinRepo: Repository<DailyCheckin>,
    @InjectRepository(BurnoutAssessment)
    private burnoutRepo: Repository<BurnoutAssessment>,
    @InjectRepository(ChatbotConversation)
    private conversationRepo: Repository<ChatbotConversation>,
    @InjectRepository(Reminder)
    private reminderRepo: Repository<Reminder>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // === DAILY CHECKINS ===
  async startDailyCheckin(userId: number, checkinType: CheckinType) {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    let conversationType: ConversationType;
    switch (checkinType) {
      case CheckinType.MORNING:
        conversationType = ConversationType.MORNING_CHECKIN;
        break;
      case CheckinType.EVENING:
        conversationType = ConversationType.EVENING_CHECKIN;
        break;
      default:
        conversationType = ConversationType.MIDDAY_CHECKIN;
        break;
    }

    const conversation = this.conversationRepo.create({
      user,
      conversationType,
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



  // === BURNOUT ASSESSMENT ===
  async startBurnoutAssessment(userId: number) {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const conversation = this.conversationRepo.create({
      user,
      conversationType: ConversationType.BURNOUT_ASSESSMENT,
      messages: [],
      context: { step: 'emotional_exhaustion', questionIndex: 0, scores: {} },
    });

    await this.conversationRepo.save(conversation);

    const greeting = "Let's do a quick burnout assessment. I'll ask you several questions to better understand how you've been feeling. Please answer honestly on a scale of 1-5 (1 = never, 5 = always).";
    const firstQuestion = "I feel emotionally drained from my work. (1-5)";
    
    const messages: ChatMessage[] = [
      { role: 'assistant', content: greeting, timestamp: new Date() },
      { role: 'assistant', content: firstQuestion, timestamp: new Date() },
    ];

    conversation.messages = messages;
    await this.conversationRepo.save(conversation);

    return { conversationId: conversation.id, messages };
  }

  // === MESSAGE PROCESSING ===
  async processChatbotMessage(conversationId: string, userId: number, message: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId, user: { user_id: userId } },
      relations: ['user'],
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

  // === AUTOMATED REMINDERS ===
  async createAutomatedReminder(userId: number, reminderType: TypeofReminder) {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const message = this.getReminderMessage(reminderType);
    
    // Set reminder time to 1 hour from now (you can adjust this logic)
    const remindAt = new Date();
    remindAt.setHours(remindAt.getHours() + 1);
    
    const reminder = this.reminderRepo.create({
      user,
      title: this.getReminderTitle(reminderType),
      type: reminderType,
      content: message,
      remind_at: remindAt,
    });

    await this.reminderRepo.save(reminder);
    
    // Create a conversation for this reminder
    const conversation = this.conversationRepo.create({
      user,
      conversationType: ConversationType.REMINDER_RESPONSE,
      messages: [
        { role: 'assistant', content: message, timestamp: new Date() }
      ],
      context: { reminderType, reminderId: reminder.reminder_id },
      metadata: { reminderType },
    });

    await this.conversationRepo.save(conversation);

    return { reminderId: reminder.reminder_id, conversationId: conversation.id, message };
  }

  async respondToReminder(conversationId: string, userId: number, response: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId, user: { user_id: userId } },
      relations: ['user'],
    });

    if (!conversation || conversation.conversationType !== ConversationType.REMINDER_RESPONSE) {
      throw new Error('Invalid reminder conversation');
    }

    const reminderId = conversation.context.reminderId;
    const reminder = await this.reminderRepo.findOne({ where: { reminder_id: reminderId } });
    
    if (reminder) {
      // Update reminder with user interaction (you can extend Reminder entity to track this)
      reminder.content = `${reminder.content}\n\nUser Response: ${response}`;
      await this.reminderRepo.save(reminder);
    }

    // Add user response to conversation
    const messages = conversation.messages as ChatMessage[];
    messages.push({ role: 'user', content: response, timestamp: new Date() });

    // Generate encouraging response
    const encouragement = this.getEncouragementMessage(conversation.context.reminderType, response);
    messages.push({ role: 'assistant', content: encouragement, timestamp: new Date() });

    conversation.messages = messages;
    conversation.isCompleted = true;
    await this.conversationRepo.save(conversation);

    return { messages, isCompleted: true };
  }

  // === HELPER METHODS ===
  private async generateResponse(conversation: any, userMessage: string): Promise<ChatResponse> {
    const type = conversation.conversationType;
    const context = conversation.context || {};

    if (type === ConversationType.MORNING_CHECKIN || 
        type === ConversationType.EVENING_CHECKIN || 
        type === ConversationType.MIDDAY_CHECKIN) {
      return this.handleCheckinFlow(context, userMessage);
    } else if (type === ConversationType.BURNOUT_ASSESSMENT) {
      return this.handleBurnoutAssessment(context, userMessage);
    }

    return { message: "I'm not sure how to help with that.", context, isCompleted: false };
  }

  private handleCheckinFlow(context: any, userMessage: string): ChatResponse {
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
          message: "How would you rate your productivity feeling today? (1-10)",
          context: { ...context, step: 'productivity', data },
          isCompleted: false,
        };

      case 'productivity':
        const productivityFeeling = parseInt(userMessage);
        if (isNaN(productivityFeeling) || productivityFeeling < 1 || productivityFeeling > 10) {
          return {
            message: "Please provide a number between 1 and 10.",
            context,
            isCompleted: false,
          };
        }
        data.productivityFeeling = productivityFeeling;
        return {
          message: "Any notes or thoughts you'd like to add about how you're feeling? (or type 'skip')",
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



  private handleBurnoutAssessment(context: any, userMessage: string): ChatResponse {
    const burnoutQuestions = [
      "I feel emotionally drained from my work.",
      "I have trouble sleeping because of work stress.",
      "I feel cynical about my work and colleagues.",
      "I doubt the significance of my work.",
      "I feel overwhelmed by my workload.",
      "I feel less empathetic toward colleagues and users.",
      "I have difficulty concentrating on tasks.",
      "I feel physically exhausted even after rest.",
    ];

    const score = parseInt(userMessage);
    if (isNaN(score) || score < 1 || score > 5) {
      return {
        message: "Please provide a number between 1 and 5 (1 = never, 5 = always).",
        context,
        isCompleted: false,
      };
    }

    const scores = context.scores || {};
    const questionIndex = context.questionIndex || 0;
    
    scores[`question_${questionIndex}`] = score;
    
    if (questionIndex < burnoutQuestions.length - 1) {
      const nextIndex = questionIndex + 1;
      return {
        message: `${burnoutQuestions[nextIndex]} (1-5)`,
        context: { ...context, questionIndex: nextIndex, scores },
        isCompleted: false,
      };
    }

    // Assessment completed
    const totalScore = Object.values(scores).reduce((sum: number, val: any) => sum + val, 0) as number;
    const averageScore = totalScore / burnoutQuestions.length;
    const riskLevel = this.calculateBurnoutRisk(averageScore);
    
    return {
      message: `Assessment complete! Based on your responses, your burnout risk level is: ${riskLevel}. I'll provide personalized recommendations to help you manage stress and prevent burnout.`,
      context: { ...context, scores, completed: true },
      data: { scores, totalScore, averageScore, riskLevel },
      isCompleted: true,
    };
  }

  private async saveCheckinData(userId: number, data: any, type: ConversationType) {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) return;

    if (type === ConversationType.MORNING_CHECKIN || 
        type === ConversationType.EVENING_CHECKIN || 
        type === ConversationType.MIDDAY_CHECKIN) {
      let checkinType: CheckinType;
      switch (type) {
        case ConversationType.MORNING_CHECKIN:
          checkinType = CheckinType.MORNING;
          break;
        case ConversationType.EVENING_CHECKIN:
          checkinType = CheckinType.EVENING;
          break;
        default:
          checkinType = CheckinType.CUSTOM;
          break;
      }
      
      const checkin = this.checkinRepo.create({
        user,
        checkin_type: checkinType,
        mood_score: data.moodScore,
        energy_level: data.energyLevel,
        stress_level: data.stressLevel,
        productivity_feeling: data.productivityFeeling,
        note: data.note,
      });
      await this.checkinRepo.save(checkin);

    } else if (type === ConversationType.BURNOUT_ASSESSMENT) {
      const assessment = this.burnoutRepo.create({
        user,
        overall_burnout_score: data.totalScore,
        risk_level: data.riskLevel,
        // Map individual scores to assessment fields as needed
      });
      await this.burnoutRepo.save(assessment);
    }
  }

  // === REMINDER MESSAGES ===
  private getReminderMessage(type: TypeofReminder): string {
    const messages = {
      [TypeofReminder.DRINK_WATER]: "💧 Time for a hydration break! Your brain is about 75% water, so staying hydrated helps you think clearly. Grab a glass of water! 🧠✨",
      [TypeofReminder.SCREEN_TIME_BREAK]: "👀 Your eyes need a break! Follow the 20-20-20 rule: Look at something 20 feet away for 20 seconds. Your future self will thank you! 🌟",
      [TypeofReminder.CODE_BREAK]: "🛑 Step away from the code for a moment! Sometimes the best debugging happens when you're not staring at the screen. Take 5 minutes to reset. 🔄",
      [TypeofReminder.CREATIVE_DIGEST]: "🎨 Time to feed your creative side! Read an interesting article, listen to music, or just let your mind wander. Creativity fuels innovation! 💡",
      [TypeofReminder.POSTURE_CHECK]: "🧘 Posture check! Roll those shoulders, straighten your back, and adjust your screen. Your spine will love you for it! 💪",
      [TypeofReminder.DEEP_BREATHING]: "🫁 Let's take a breathing break! Inhale for 4, hold for 4, exhale for 4. Repeat 3 times. Your nervous system needs this reset! 😌",
      [TypeofReminder.STRETCH_BREAK]: "🤸 Time to stretch! Your muscles have been in the same position too long. Stand up, reach for the sky, and move that body! 🌈",
      [TypeofReminder.MENTAL_HEALTH_CHECKIN]: "💚 How are you doing mentally? Remember, it's okay to not be okay. Your mental health matters more than any deadline. Check in with yourself. 🤗",
    };
    
    return messages[type];
  }

  private getReminderTitle(type: TypeofReminder): string {
    const titles = {
      [TypeofReminder.DRINK_WATER]: 'Hydration Break',
      [TypeofReminder.SCREEN_TIME_BREAK]: 'Screen Break',
      [TypeofReminder.CODE_BREAK]: 'Code Break',
      [TypeofReminder.CREATIVE_DIGEST]: 'Creative Time',
      [TypeofReminder.POSTURE_CHECK]: 'Posture Check',
      [TypeofReminder.DEEP_BREATHING]: 'Breathing Break',
      [TypeofReminder.STRETCH_BREAK]: 'Stretch Break',
      [TypeofReminder.MENTAL_HEALTH_CHECKIN]: 'Mental Health Check-in',
    };
    
    return titles[type];
  }

  private getEncouragementMessage(reminderType: TypeofReminder, userResponse: string): string {
    const positiveKeywords = ['good', 'great', 'yes', 'done', 'better', 'refreshed', 'helped'];
    const isPositive = positiveKeywords.some(word => userResponse.toLowerCase().includes(word));

    if (isPositive) {
      return "Awesome! 🌟 I'm glad you took that moment for yourself. These small breaks make a big difference in your wellbeing and productivity!";
    }

    return "Thanks for being honest! 💙 Even acknowledging the reminder is a step forward. Remember, self-care isn't selfish - it's necessary. You've got this! 🚀";
  }

  private getCheckinGreeting(type: CheckinType): string {
    if (type === CheckinType.MORNING) {
      return "Good morning! 🌅 Let's start your day with a quick check-in. This will help track your wellbeing and give you insights over time.";
    } else if (type === CheckinType.EVENING) {
      return "Good evening! 🌙 Let's wrap up your day with a quick reflection. This helps you process the day and prepare for restful sleep.";
    }
    return "Time for a midday check-in! 🌞 Let's pause and see how you're doing. This helps maintain awareness of your mental state throughout the day.";
  }

  private generateCheckinSummary(data: any): string {
    const insights: string[] = [];

    if (data.moodScore >= 7) {
      insights.push("Your mood seems good today! 😊");
    } else if (data.moodScore <= 4) {
      insights.push("I notice your mood is lower today. Remember, it's okay to have tough days. 🤗");
    }

    if (data.stressLevel >= 7) {
      insights.push("Your stress levels are high. Consider taking some breaks today. 🧘‍♀️");
    }

    if (data.energyLevel <= 4) {
      insights.push("Your energy seems low. Make sure to prioritize rest and nutrition. ⚡");
    }

    if (data.productivityFeeling >= 7) {
      insights.push("Great productivity feeling today! 🚀");
    }

    return insights.join(" ") || "I've logged your check-in. Keep taking care of yourself! 💚";
  }

  // === ANALYSIS HELPERS ===
  private analyzeStressLevel(text: string): number {
    const stressKeywords = {
      high: ['overwhelmed', 'stressed', 'anxious', 'panic', 'exhausted', 'burnout', 'deadline', 'pressure'],
      medium: ['worried', 'concerned', 'tired', 'busy', 'challenging', 'difficult'],
      low: ['calm', 'relaxed', 'peaceful', 'good', 'fine', 'okay']
    };

    const lowercaseText = text.toLowerCase();
    let highCount = stressKeywords.high.filter(word => lowercaseText.includes(word)).length;
    let mediumCount = stressKeywords.medium.filter(word => lowercaseText.includes(word)).length;
    let lowCount = stressKeywords.low.filter(word => lowercaseText.includes(word)).length;

    if (highCount > lowCount) return Math.min(7 + highCount, 10);
    if (mediumCount > lowCount) return 5 + mediumCount;
    return Math.max(3 - lowCount, 1);
  }

  private extractTags(text: string): string[] {
    const tagKeywords = {
      work: ['work', 'job', 'project', 'deadline', 'meeting', 'boss', 'colleague'],
      personal: ['family', 'relationship', 'health', 'money', 'financial'],
      coding: ['code', 'bug', 'programming', 'development', 'debugging'],
      time: ['time', 'schedule', 'busy', 'rushed']
    };

    const tags: string[] = [];
    const lowercaseText = text.toLowerCase();

    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  private detectMood(text: string): string {
    const moodKeywords = {
      anxious: ['anxious', 'worried', 'nervous', 'panic'],
      overwhelmed: ['overwhelmed', 'too much', 'can\'t handle'],
      frustrated: ['frustrated', 'annoyed', 'angry'],
      sad: ['sad', 'depressed', 'down', 'low'],
      stressed: ['stressed', 'pressure', 'tense']
    };

    const lowercaseText = text.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        return mood;
      }
    }

    return 'neutral';
  }

  private calculateBurnoutRisk(averageScore: number): string {
    if (averageScore >= 4) return 'severe';
    if (averageScore >= 3) return 'high';
    if (averageScore >= 2) return 'moderate';
    return 'low';
  }
}