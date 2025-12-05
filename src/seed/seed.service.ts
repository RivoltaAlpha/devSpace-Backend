import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

// Entity imports
import { User, UserRole } from '../users/entities/user.entity';
import { DeveloperProfile, ExperienceLevel, WorkMode } from '../developer-profile/entities/developer-profile.entity';
import { TherapistProfile } from '../therapist-profile/entities/therapist-profile.entity';
import { Resource, ResourceType } from '../resources/entities/resource.entity';
import { BurnoutAssessment, RiskLevel } from '../burnout-assesment/entities/burnout-assesment.entity';
import { DailyCheckin, CheckinType } from '../daily-checkins/entities/daily-checkin.entity';
import { Reminder, TypeofReminder } from '../reminders/entities/reminder.entity';
import { ConversationalContext } from '../conversational_contexts/entities/conversational_context.entity';
import { ChatbotConversation, ConversationType } from '../chatbot/entities/chatbot-conversation.entity';
import { Appointment, AppointmentStatus, AppointmentType } from '../appointment/entities/appointment.entity';
import { Conversation, ConversationStatus } from '../conversations/entities/conversation.entity';
import { Message, MessageType } from '../messages/entities/message.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DeveloperProfile)
    private readonly developerProfileRepository: Repository<DeveloperProfile>,
    @InjectRepository(TherapistProfile)
    private readonly therapistProfileRepository: Repository<TherapistProfile>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(BurnoutAssessment)
    private readonly burnoutAssessmentRepository: Repository<BurnoutAssessment>,
    @InjectRepository(DailyCheckin)
    private readonly dailyCheckinRepository: Repository<DailyCheckin>,
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
    @InjectRepository(ConversationalContext)
    private readonly conversationalContextRepository: Repository<ConversationalContext>,
    @InjectRepository(ChatbotConversation)
    private readonly chatbotConversationRepository: Repository<ChatbotConversation>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // This method calls all other seeding methods in the correct order, ensuring that parent entities are seeded before their dependent entities
  async seedDatabase(): Promise<void> {
    this.logger.log('Seeding database...');
    try {
      await this.seedUsers(); // independent
      await this.seedDeveloperProfiles(); // dependent on users
      await this.seedTherapistProfiles(); // dependent on users
      await this.seedResources(); // independent
      await this.seedBurnoutAssessments(); // dependent on users
      await this.seedDailyCheckins(); // dependent on users
      await this.seedReminders(); // dependent on users
      await this.seedConversationalContexts(); // dependent on users
      await this.seedChatbotConversations(); // dependent on users
      await this.seedAppointments(); // dependent on users
      await this.seedConversations(); // dependent on developer and therapist profiles
      await this.seedMessages(); // dependent on conversations and users
      this.logger.log('Database seeding completed.');
    } catch (error) {
      this.logger.error(`Error during database seeding: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedUsers(): Promise<void> {
    this.logger.log('Seeding users...');
    try {
      const existingUsers = await this.userRepository.count();
      if (existingUsers > 0) {
        this.logger.log('Users already exist, skipping user seeding');
        return;
      }

      const users: User[] = [];
      const userCount = 20;

      for (let i = 0; i < userCount; i++) {
        const user = new User();
        user.name = faker.person.fullName();
        user.email = faker.internet.email().toLowerCase();
        user.password = '$2b$10$rU1K5o5WJXQ5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5'; // hashed 'password123'
        user.phone = faker.phone.number();
        user.role = faker.helpers.arrayElement([UserRole.Dev, UserRole.Therapist, UserRole.Admin]);
        user.is_active = faker.datatype.boolean(0.9);
        user.is_verified = faker.datatype.boolean(0.8);
        user.last_active_at = faker.date.recent({ days: 30 });
        user.hashedRefreshedToken = ' null';
        users.push(user);
      }

      await this.userRepository.save(users);
      this.logger.log(`${userCount} users seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedDeveloperProfiles(): Promise<void> {
    this.logger.log('Seeding developer profiles...');
    try {
      const developers = await this.userRepository.find({ where: { role: UserRole.Dev } });
      if (developers.length === 0) {
        this.logger.log('No developer users found, skipping developer profile seeding');
        return;
      }

      const profiles: DeveloperProfile[] = [];
      const techStacks = ['React/Node.js', 'Angular/.NET', 'Vue/Laravel', 'Python/Django', 'Java/Spring', 'Flutter/Dart'];
      const stressors = ['Tight deadlines', 'Complex requirements', 'Technical debt', 'Work-life balance', 'Imposter syndrome', 'Burnout'];

      for (const developer of developers) {
        const profile = new DeveloperProfile();
        profile.user = developer.user_id;
        profile.tech_stack = faker.helpers.arrayElement(techStacks);
        profile.experience_level = faker.helpers.arrayElement(Object.values(ExperienceLevel));
        profile.work_mode = faker.helpers.arrayElement(Object.values(WorkMode));
        profile.bio = faker.lorem.paragraph();
        profile.primary_stressors = faker.helpers.arrayElements(stressors, { min: 1, max: 3 }).join(', ');
        profiles.push(profile);
      }

      await this.developerProfileRepository.save(profiles);
      this.logger.log(`${profiles.length} developer profiles seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding developer profiles: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedTherapistProfiles(): Promise<void> {
    this.logger.log('Seeding therapist profiles...');
    try {
      const therapists = await this.userRepository.find({ where: { role: UserRole.Therapist } });
      if (therapists.length === 0) {
        this.logger.log('No therapist users found, skipping therapist profile seeding');
        return;
      }

      const profiles: TherapistProfile[] = [];
      const specializations = ['Cognitive Behavioral Therapy', 'Stress Management', 'Workplace Psychology', 'Burnout Prevention', 'Anxiety Disorders'];

      for (const therapist of therapists) {
        const profile = new TherapistProfile();
        profile.user = therapist.user_id;
        profile.license_number = `LIC-${faker.string.numeric(6)}`;
        profile.specializations = faker.helpers.arrayElements(specializations, { min: 1, max: 3 });
        profile.years_experience = faker.number.int({ min: 1, max: 20 });
        profile.bio = faker.lorem.paragraphs(2);
        profile.session_rate = faker.number.float({ min: 50, max: 200, fractionDigits: 2 });
        profile.availability_slots = JSON.stringify({
          monday: ['09:00-17:00'],
          tuesday: ['09:00-17:00'],
          wednesday: ['09:00-17:00'],
          thursday: ['09:00-17:00'],
          friday: ['09:00-17:00']
        });
        profile.is_accepting_clients = faker.datatype.boolean(0.8);
        profile.max_clients = faker.number.int({ min: 15, max: 30 });
        profiles.push(profile);
      }

      await this.therapistProfileRepository.save(profiles);
      this.logger.log(`${profiles.length} therapist profiles seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding therapist profiles: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedResources(): Promise<void> {
    this.logger.log('Seeding resources...');
    try {
      const existingResources = await this.resourceRepository.count();
      if (existingResources > 0) {
        this.logger.log('Resources already exist, skipping resource seeding');
        return;
      }

      const resources: Resource[] = [];
      const resourceCount = 50;
      const categories = ['mental-health', 'work-life-balance', 'stress-management', 'productivity', 'communication'];
      const tags = ['stress', 'burnout', 'anxiety', 'depression', 'productivity', 'mindfulness', 'meditation'];
      const audiences = ['junior-devs', 'senior-devs', 'team-leads', 'all'];

      for (let i = 0; i < resourceCount; i++) {
        const resource = new Resource();
        resource.title = faker.lorem.sentence();
        resource.description = faker.lorem.paragraph();
        resource.content = faker.lorem.paragraphs(3);
        resource.resourceType = faker.helpers.arrayElement(Object.values(ResourceType));
        resource.media_url = resource.resourceType === ResourceType.VIDEO ? faker.internet.url() : undefined;
        resource.thumbnail_url = faker.image.url();
        resource.duration_minutes = resource.resourceType === ResourceType.VIDEO ? faker.number.int({ min: 5, max: 60 }) : undefined;
        resource.tags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
        resource.categories = faker.helpers.arrayElements(categories, { min: 1, max: 2 });
        resource.target_audience = faker.helpers.arrayElement(audiences);
        resource.view_count = faker.number.int({ min: 0, max: 1000 });
        resource.like_count = faker.number.int({ min: 0, max: 100 });
        resources.push(resource);
      }

      await this.resourceRepository.save(resources);
      this.logger.log(`${resourceCount} resources seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding resources: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedBurnoutAssessments(): Promise<void> {
    this.logger.log('Seeding burnout assessments...');
    try {
      const users = await this.userRepository.find({ where: { role: UserRole.Dev } });
      if (users.length === 0) {
        this.logger.log('No users found, skipping burnout assessments seeding');
        return;
      }

      const assessments: BurnoutAssessment[] = [];
      const assessmentCount = Math.min(users.length * 2, 30);

      for (let i = 0; i < assessmentCount; i++) {
        const user = faker.helpers.arrayElement(users);
        const assessment = new BurnoutAssessment();
        assessment.user = user;
        assessment.emotionalExhaustion_score = faker.number.int({ min: 0, max: 54 });
        assessment.depersonalization_score = faker.number.int({ min: 0, max: 30 });
        assessment.personal_accomplishment_score = faker.number.int({ min: 0, max: 48 });
        assessment.overall_burnout_score = faker.number.int({ min: 0, max: 132 });
        assessment.risk_level = faker.helpers.arrayElement(Object.values(RiskLevel));
        assessment.recommendations = [
          'Take regular breaks during work',
          'Practice stress management techniques',
          'Consider speaking with a therapist'
        ];
        assessments.push(assessment);
      }

      await this.burnoutAssessmentRepository.save(assessments);
      this.logger.log(`${assessmentCount} burnout assessments seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding burnout assessments: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedDailyCheckins(): Promise<void> {
    this.logger.log('Seeding daily checkins...');
    try {
      const users = await this.userRepository.find({ where: { role: UserRole.Dev } });
      if (users.length === 0) {
        this.logger.log('No users found, skipping daily checkins seeding');
        return;
      }

      const checkins: DailyCheckin[] = [];
      const checkinCount = users.length * 7;
      const checkinTags = ['productive', 'stressed', 'energetic', 'tired', 'focused', 'distracted'];

      for (let i = 0; i < checkinCount; i++) {
        const user = faker.helpers.arrayElement(users);
        const checkin = new DailyCheckin();
        checkin.user = user;
        checkin.checkin_type = faker.helpers.arrayElement(Object.values(CheckinType));
        checkin.mood_score = faker.number.int({ min: 1, max: 5 });
        checkin.energy_level = faker.number.int({ min: 1, max: 5 });
        checkin.stress_level = faker.number.int({ min: 1, max: 5 });
        checkin.productivity_feeling = faker.number.int({ min: 1, max: 5 });
        checkin.note = faker.lorem.sentence();
        checkin.tags = faker.helpers.arrayElements(checkinTags, { min: 0, max: 2 });
        checkins.push(checkin);
      }

      await this.dailyCheckinRepository.save(checkins);
      this.logger.log(`${checkinCount} daily checkins seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding daily checkins: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedReminders(): Promise<void> {
    this.logger.log('Seeding reminders...');
    try {
      const users = await this.userRepository.find();
      if (users.length === 0) {
        this.logger.log('No users found, skipping reminders seeding');
        return;
      }

      const reminders: Reminder[] = [];
      const reminderCount = users.length * 5;

      for (let i = 0; i < reminderCount; i++) {
        const user = faker.helpers.arrayElement(users);
        const reminderType = faker.helpers.arrayElement(Object.values(TypeofReminder));
        const reminder = new Reminder();
        reminder.user = user;
        reminder.title = this.getReminderTitle(reminderType);
        reminder.type = reminderType;
        reminder.content = this.getReminderContent(reminderType);
        reminder.remind_at = faker.date.future();
        reminder.is_completed = faker.datatype.boolean(0.3);
        reminder.completed_at = reminder.is_completed ? faker.date.recent() : undefined;
        reminders.push(reminder);
      }

      await this.reminderRepository.save(reminders);
      this.logger.log(`${reminderCount} reminders seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding reminders: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedConversationalContexts(): Promise<void> {
    this.logger.log('Seeding conversational contexts...');
    try {
      const developers = await this.userRepository.find({ where: { role: UserRole.Dev } });
      if (developers.length === 0) {
        this.logger.log('No developer users found, skipping conversational contexts seeding');
        return;
      }

      const contexts: ConversationalContext[] = [];
      const contextCount = developers.length * 3;
      const sessionTypes = ['therapy_session', 'coaching_session', 'support_chat', 'assessment'];

      for (let i = 0; i < contextCount; i++) {
        const dev = faker.helpers.arrayElement(developers);
        const context = new ConversationalContext();
        context.dev = dev;
        context.context_data = JSON.stringify({
          previous_topics: faker.helpers.arrayElements(['stress', 'burnout', 'productivity', 'work-life-balance'], { min: 1, max: 2 }),
          session_notes: faker.lorem.sentence(),
          emotional_state: faker.helpers.arrayElement(['calm', 'anxious', 'stressed', 'happy', 'neutral'])
        });
        context.session_type = faker.helpers.arrayElement(sessionTypes);
        contexts.push(context);
      }

      await this.conversationalContextRepository.save(contexts);
      this.logger.log(`${contextCount} conversational contexts seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding conversational contexts: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedChatbotConversations(): Promise<void> {
    this.logger.log('Seeding chatbot conversations...');
    try {
      const users = await this.userRepository.find();
      if (users.length === 0) {
        this.logger.log('No users found, skipping chatbot conversations seeding');
        return;
      }

      const conversations: ChatbotConversation[] = [];
      const conversationCount = users.length * 4;

      for (let i = 0; i < conversationCount; i++) {
        const user = faker.helpers.arrayElement(users);
        const conversation = new ChatbotConversation();
        conversation.user = user;
        conversation.conversationType = faker.helpers.arrayElement(Object.values(ConversationType));
        conversation.messages = [
          { role: 'user', content: faker.lorem.sentence(), timestamp: faker.date.recent().toISOString() },
          { role: 'assistant', content: faker.lorem.paragraph(), timestamp: faker.date.recent().toISOString() }
        ];
        conversation.context = {
          mood: faker.helpers.arrayElement(['happy', 'stressed', 'neutral', 'anxious']),
          topic: faker.helpers.arrayElement(['work', 'personal', 'health', 'productivity'])
        };
        conversation.isCompleted = faker.datatype.boolean(0.7);
        conversation.metadata = {
          platform: 'web',
          duration_minutes: faker.number.int({ min: 5, max: 45 })
        };
        conversations.push(conversation);
      }

      await this.chatbotConversationRepository.save(conversations);
      this.logger.log(`${conversationCount} chatbot conversations seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding chatbot conversations: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedAppointments(): Promise<void> {
    this.logger.log('Seeding appointments...');
    try {
      const developers = await this.userRepository.find({ where: { role: UserRole.Dev } });
      const therapists = await this.userRepository.find({ where: { role: UserRole.Therapist } });
      
      if (developers.length === 0 || therapists.length === 0) {
        this.logger.log('Not enough developers or therapists found, skipping appointments seeding');
        return;
      }

      const appointments: Appointment[] = [];
      const appointmentCount = Math.min(developers.length * 2, 30);

      for (let i = 0; i < appointmentCount; i++) {
        const dev = faker.helpers.arrayElement(developers);
        const therapist = faker.helpers.arrayElement(therapists);
        const appointment = new Appointment();
        appointment.dev = dev;
        appointment.therapist = therapist;
        appointment.appointmentType = faker.helpers.arrayElement(Object.values(AppointmentType));
        appointment.scheduled_at = faker.date.future();
        appointment.duration_minutes = faker.helpers.arrayElement([30, 45, 60]);
        appointment.status = faker.helpers.arrayElement(Object.values(AppointmentStatus));
        appointment.meeting_link = faker.internet.url();
        appointment.meeting_platform = faker.helpers.arrayElement(['zoom', 'google-meet', 'teams']);
        appointment.dev_notes = faker.lorem.paragraph();
        appointment.therapist_notes = faker.lorem.paragraph();
        appointment.session_summary = appointment.status === AppointmentStatus.COMPLETED ? faker.lorem.paragraphs(2) : undefined;
        appointment.dev_rating = appointment.status === AppointmentStatus.COMPLETED ? faker.number.int({ min: 1, max: 5 }) : undefined;
        appointment.dev_feedback = appointment.status === AppointmentStatus.COMPLETED ? faker.lorem.sentence() : undefined;
        appointment.reminder_sent = faker.datatype.boolean(0.8);
        appointments.push(appointment);
      }

      await this.appointmentRepository.save(appointments);
      this.logger.log(`${appointmentCount} appointments seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding appointments: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedConversations(): Promise<void> {
    this.logger.log('Seeding conversations...');
    try {
      const devProfiles = await this.developerProfileRepository.find({ relations: ['user'] });
      const therapistProfiles = await this.therapistProfileRepository.find({ relations: ['user'] });
      
      if (devProfiles.length === 0 || therapistProfiles.length === 0) {
        this.logger.log('Not enough profiles found, skipping conversations seeding');
        return;
      }

      const conversations: Conversation[] = [];
      const conversationCount = Math.min(devProfiles.length, 15);

      for (let i = 0; i < conversationCount; i++) {
        const devProfile = faker.helpers.arrayElement(devProfiles);
        const therapistProfile = faker.helpers.arrayElement(therapistProfiles);
        const conversation = new Conversation();
        conversation.dev = devProfile;
        conversation.therapist = therapistProfile;
        conversation.status = faker.helpers.arrayElement(Object.values(ConversationStatus));
        conversation.last_message_at = faker.date.recent({ days: 7 });
        conversations.push(conversation);
      }

      await this.conversationRepository.save(conversations);
      this.logger.log(`${conversationCount} conversations seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding conversations: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedMessages(): Promise<void> {
    this.logger.log('Seeding messages...');
    try {
      const conversations = await this.conversationRepository.find({ relations: ['dev', 'therapist'] });
      if (conversations.length === 0) {
        this.logger.log('No conversations found, skipping messages seeding');
        return;
      }

      const messages: Message[] = [];
      const messageCount = conversations.length * 10;

      for (let i = 0; i < messageCount; i++) {
        const conversation = faker.helpers.arrayElement(conversations);
        const message = new Message();
        message.conversation_id = conversation.conversation_id;
        
        const isDeveloperSender = faker.datatype.boolean();
        message.sender_id = isDeveloperSender ? conversation.dev.user : conversation.therapist.user;
        message.receiver_id = isDeveloperSender ? conversation.therapist.user : conversation.dev.user;
        
        message.message_type = faker.helpers.arrayElement(Object.values(MessageType));
        message.content = faker.lorem.paragraph();
        message.media_url = message.message_type !== MessageType.TEXT ? faker.internet.url() : undefined;
        message.is_read = faker.datatype.boolean(0.7);
        message.read_at = message.is_read ? faker.date.recent() : undefined;
        message.is_edited = faker.datatype.boolean(0.1);
        message.edited_at = message.is_edited ? faker.date.recent() : undefined;
        messages.push(message);
      }

      await this.messageRepository.save(messages);
      this.logger.log(`${messageCount} messages seeded successfully`);
    } catch (error) {
      this.logger.error(`Error seeding messages: ${error.message}`, error.stack);
      throw error;
    }
  }

  private getReminderTitle(type: TypeofReminder): string {
    const titles = {
      [TypeofReminder.DRINK_WATER]: 'Stay Hydrated',
      [TypeofReminder.SCREEN_TIME_BREAK]: 'Take a Screen Break',
      [TypeofReminder.CODE_BREAK]: 'Time for a Code Break',
      [TypeofReminder.CREATIVE_DIGEST]: 'Creative Inspiration Time',
      [TypeofReminder.POSTURE_CHECK]: 'Check Your Posture',
      [TypeofReminder.DEEP_BREATHING]: 'Deep Breathing Exercise',
      [TypeofReminder.STRETCH_BREAK]: 'Time to Stretch',
      [TypeofReminder.MENTAL_HEALTH_CHECKIN]: 'Mental Health Check-in'
    };
    return titles[type] || 'General Reminder';
  }

  private getReminderContent(type: TypeofReminder): string {
    const content = {
      [TypeofReminder.DRINK_WATER]: 'Remember to drink some water to stay hydrated throughout the day.',
      [TypeofReminder.SCREEN_TIME_BREAK]: 'Take a 5-minute break from your screen to rest your eyes.',
      [TypeofReminder.CODE_BREAK]: 'Step away from coding for a few minutes to clear your mind.',
      [TypeofReminder.CREATIVE_DIGEST]: 'Take some time to explore creative content and get inspired.',
      [TypeofReminder.POSTURE_CHECK]: 'Check your sitting posture and adjust if needed.',
      [TypeofReminder.DEEP_BREATHING]: 'Take 5 deep breaths to center yourself and reduce stress.',
      [TypeofReminder.STRETCH_BREAK]: 'Do some light stretching to relieve muscle tension.',
      [TypeofReminder.MENTAL_HEALTH_CHECKIN]: 'Take a moment to check in with how you are feeling mentally.'
    };
    return content[type] || 'General reminder content';
  }

  async clearDatabase(): Promise<void> {
    this.logger.log('Clearing database...');
    try {
      await this.messageRepository.clear();
      await this.conversationRepository.clear();
      await this.appointmentRepository.clear();
      await this.chatbotConversationRepository.clear();
      await this.conversationalContextRepository.clear();
      await this.reminderRepository.clear();
      await this.dailyCheckinRepository.clear();
      await this.burnoutAssessmentRepository.clear();
      await this.resourceRepository.clear();
      await this.therapistProfileRepository.clear();
      await this.developerProfileRepository.clear();
      await this.userRepository.clear();
      this.logger.log('Database cleared successfully');
    } catch (error) {
      this.logger.error(`Error clearing database: ${error.message}`, error.stack);
      throw error;
    }
  }
}