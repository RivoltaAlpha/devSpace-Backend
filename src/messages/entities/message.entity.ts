import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VOICE = 'voice',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number;

  @ManyToOne('Conversation')
  @JoinColumn({ name: 'conversation_id' })
  conversation_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver_id: number;
  
  @Column({
    type: 'nvarchar',
    enum: MessageType,
    name: 'message_type',
    default: MessageType.TEXT,
  })
  message_type: MessageType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  media_url?: string;

  @Column({ type: 'bit', default: false })
  is_read: boolean;

  @Column({ type: 'datetime2', nullable: true })
  read_at?: Date;

  @Column({ type: 'bit', default: false })
  is_edited: boolean;

  @Column({ type: 'datetime2', nullable: true })
  edited_at?: Date;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;
}