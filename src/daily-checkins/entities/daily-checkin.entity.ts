import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum CheckinType {
  MORNING = 'morning',
  EVENING = 'evening',
  CUSTOM = 'custom',
}

@Entity('daily_checkins')
export class DailyCheckin {
  @PrimaryGeneratedColumn('uuid')
  daily_checkin_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'nvarchar',
    enum: CheckinType,
  })
  checkin_type: CheckinType;

  @Column({ type: 'int', nullable: true })
  mood_score?: number;

  @Column({ type: 'int', nullable: true })
  energy_level?: number;

  @Column({ type: 'int', nullable: true })
  stress_level?: number;

  @Column({ type: 'int', nullable: true })
  productivity_feeling?: number;

  @Column('text', { nullable: true })
  note?: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;
}