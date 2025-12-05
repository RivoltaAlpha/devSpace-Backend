
import { DeveloperProfile } from "../../developer-profile/entities/developer-profile.entity";
import { TherapistProfile } from "../../therapist-profile/entities/therapist-profile.entity";
import { Appointment } from "../../appointment/entities/appointment.entity";
import { Conversation } from "../../conversations/entities/conversation.entity";
import { Message } from "../../messages/entities/message.entity";
import { DailyCheckin } from "../../daily-checkins/entities/daily-checkin.entity";
import { BurnoutAssessment } from "../../burnout-assesment/entities/burnout-assesment.entity";
import { Reminder } from "../../reminders/entities/reminder.entity";
import { ConversationalContext } from "../../conversational_contexts/entities/conversational_context.entity";
import { ChatbotConversation } from "../../chatbot/entities/chatbot-conversation.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToOne } from "typeorm";

export enum UserRole{
    Admin = 'Admin',
    Dev = 'Dev',
    Therapist = 'Therapist',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    email:string;

    @Column({type: 'varchar', length: 255, nullable: false})
    password: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    phone:string;

    @Column({type: 'varchar', length: 255})
    hashedRefreshedToken?: string | null; 

    @Column({
        type: 'varchar',
        length: 10,
        default: UserRole.Dev
    })
    role: UserRole;
    
    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;

    @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @Column({ name: 'is_verified', default: false })
  is_verified: boolean;

  @Column({ name: 'last_active_at', nullable: true })
  last_active_at?: Date;

  // One-to-One relationships
  @OneToOne('DeveloperProfile', (profile: DeveloperProfile) => profile.user)
  developerProfile?: DeveloperProfile;

  @OneToOne('TherapistProfile', (profile: TherapistProfile) => profile.user)
  therapistProfile?: TherapistProfile;

  // One-to-Many relationships
  @OneToMany('Appointment', (appointment: Appointment) => appointment.dev)
  devAppointments?: Appointment[];

  @OneToMany('Appointment', (appointment: Appointment) => appointment.therapist)
  therapistAppointments?: Appointment[];

  @OneToMany('Conversation', (conversation: Conversation) => conversation.dev)
  devConversations?: Conversation[];

  @OneToMany('Conversation', (conversation: Conversation) => conversation.therapist)
  therapistConversations?: Conversation[];

  @OneToMany('Message', (message: Message) => message.sender_id)
  sentMessages?: Message[];

  @OneToMany('Message', (message: Message) => message.receiver_id)
  receivedMessages?: Message[];

  @OneToMany('DailyCheckin', (checkin: DailyCheckin) => checkin.user)
  dailyCheckins?: DailyCheckin[];

  @OneToMany('BurnoutAssessment', (assessment: BurnoutAssessment) => assessment.user)
  burnoutAssessments?: BurnoutAssessment[];

  @OneToMany('Reminder', (reminder: Reminder) => reminder.user)
  reminders?: Reminder[];

  @OneToMany('ConversationalContext', (context: ConversationalContext) => context.dev)
  conversationalContexts?: ConversationalContext[];

  @OneToMany('ChatbotConversation', (conversation: ChatbotConversation) => conversation.user)
  chatbotConversations?: ChatbotConversation[];
}
