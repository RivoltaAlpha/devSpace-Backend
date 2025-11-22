import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum CheckinType {
  MORNING = 'morning',
  EVENING = 'evening',
  CUSTOM = 'custom',
}

@Entity('daily_checkins')
export class DailyCheckin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: CheckinType,
    name: 'checkin_type',
  })
  checkinType: CheckinType;

  @Column({ name: 'mood_score', nullable: true })
  moodScore?: number;

  @Column({ name: 'energy_level', nullable: true })
  energyLevel?: number;

  @Column({ name: 'stress_level', nullable: true })
  stressLevel?: number;

  @Column({ name: 'sleep_quality', nullable: true })
  sleepQuality?: number;

  @Column({ name: 'productivity_feeling', nullable: true })
  productivityFeeling?: number;

  @Column('text', { nullable: true })
  note?: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}