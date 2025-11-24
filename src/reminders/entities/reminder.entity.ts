import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TypeofReminder {
  PERSONAL = 'personal',
  WORK = 'work',
  HEALTH = 'health',
  FINANCE = 'finance',
  OTHER = 'other',
}

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn()
  reminder_id: number;

  @Column({ type: 'nvarchar', length: 255 })
  title: string;

  @Column({ type: 'nvarchar', length: 50 })
  type: TypeofReminder;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'datetime2' })
  remind_at: Date;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
