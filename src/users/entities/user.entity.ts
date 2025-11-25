
import { DeveloperProfile } from "src/developer-profile/entities/developer-profile.entity";
import { TherapistProfile } from "src/therapist-profile/entities/therapist-profile.entity";
import { Appointment } from "src/appointment/entities/appointment.entity";
import { Conversation } from "src/conversations/entities/conversation.entity";
import { Message } from "src/messages/entities/message.entity";
import { DailyCheckin } from "src/daily-checkins/entities/daily-checkin.entity";
import { BurnoutAssessment } from "src/burnout-assesment/entities/burnout-assesment.entity";
import { Reminder } from "src/reminders/entities/reminder.entity";
import { ConversationalContext } from "src/conversational_contexts/entities/conversational_context.entity";
import { ChatbotConversation } from "src/chatbot/entities/chatbot-conversation.entity";
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
  @OneToOne(() => DeveloperProfile, profile => profile.user)
  developerProfile?: DeveloperProfile;

  @OneToOne(() => TherapistProfile, profile => profile.user)
  therapistProfile?: TherapistProfile;

  // One-to-Many relationships
  @OneToMany(() => Appointment, appointment => appointment.dev)
  devAppointments?: Appointment[];

  @OneToMany(() => Appointment, appointment => appointment.therapist)
  therapistAppointments?: Appointment[];

  @OneToMany(() => Conversation, conversation => conversation.dev)
  devConversations?: Conversation[];

  @OneToMany(() => Conversation, conversation => conversation.therapist)
  therapistConversations?: Conversation[];

  @OneToMany(() => Message, message => message.sender)
  sentMessages?: Message[];

  @OneToMany(() => Message, message => message.receiver)
  receivedMessages?: Message[];

  @OneToMany(() => DailyCheckin, checkin => checkin.user)
  dailyCheckins?: DailyCheckin[];

  @OneToMany(() => BurnoutAssessment, assessment => assessment.user)
  burnoutAssessments?: BurnoutAssessment[];

  @OneToMany(() => Reminder, reminder => reminder.user)
  reminders?: Reminder[];

  @OneToMany(() => ConversationalContext, context => context.dev)
  conversationalContexts?: ConversationalContext[];

  @OneToMany(() => ChatbotConversation, conversation => conversation.user)
  chatbotConversations?: ChatbotConversation[];
}
