import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum ConversationType {
  MORNING_CHECKIN = 'morning-checkin',
  MIDDAY_CHECKIN = 'midday-checkin',
  EVENING_CHECKIN = 'evening-checkin',
  BURNOUT_ASSESSMENT = 'burnout-assessment',
  GENERAL_CHAT = 'general-chat',
  REMINDER_RESPONSE = 'reminder-response',
}

@Entity('chatbot_conversations')
export class ChatbotConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'nvarchar',
    enum: ConversationType,
    name: 'conversation_type',
  })
  conversationType: ConversationType;

  @Column({ type: 'jsonb' })
  messages: any[]; // Array of ChatMessage objects

  @Column({ type: 'jsonb', nullable: true })
  context?: any; // Current conversation context/state

  @Column({ type: 'bit', default: false })
  isCompleted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any; // Additional data like reminder type, etc.

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;
}