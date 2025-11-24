import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  CLOSED = 'closed',
}

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  conversation_id: number;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @Column({ name: 'last_message_at', nullable: true })
  last_message_at?: Date;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'dev_id' })
  dev: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'therapist_id' })
  therapist: User;

  @OneToMany(() => Message, message => message.conversation)
  messages?: Message[];
}
