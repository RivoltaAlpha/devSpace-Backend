import { TherapistProfile } from 'src/therapist-profile/entities/therapist-profile.entity';
import { DeveloperProfile } from 'src/developer-profile/entities/developer-profile.entity';
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

  @ManyToOne(() => DeveloperProfile)
  @JoinColumn({ name: 'dev_id' })
  dev: DeveloperProfile;

  @ManyToOne(() => TherapistProfile)
  @JoinColumn({ name: 'therapist_id' })
  therapist: TherapistProfile;

  @OneToMany(() => Message, message => message.conversation)
  messages?: Message[];
}
