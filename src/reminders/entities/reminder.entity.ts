import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TypeofReminder {
  DRINK_WATER = 'drink_water',
  SCREEN_TIME_BREAK = 'screen_time_break',
  CODE_BREAK = 'code_break',
  CREATIVE_DIGEST = 'creative_digest',
  POSTURE_CHECK = 'posture_check',
  DEEP_BREATHING = 'deep_breathing',
  STRETCH_BREAK = 'stretch_break',
  MENTAL_HEALTH_CHECKIN = 'mental_health_checkin',
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

  @Column({ type: 'bit', default: false })
  is_completed: boolean;

  @Column({ type: 'datetime2', nullable: true })
  completed_at?: Date;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
