import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  SEVERE = 'severe',
}

@Entity('burnout_assessments')
export class BurnoutAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'emotional_exhaustion_score', nullable: true })
  emotionalExhaustionScore?: number;

  @Column({ name: 'depersonalization_score', nullable: true })
  depersonalizationScore?: number;

  @Column({ name: 'personal_accomplishment_score', nullable: true })
  personalAccomplishmentScore?: number;

  @Column({ name: 'overall_burnout_score', nullable: true })
  overallBurnoutScore?: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    name: 'risk_level',
    nullable: true,
  })
  riskLevel?: RiskLevel;

  @Column({ name: 'work_hours_per_week', nullable: true })
  workHoursPerWeek?: number;

  @Column({ name: 'on_call_frequency', nullable: true })
  onCallFrequency?: string;

  @Column({ name: 'recent_incidents', default: false })
  recentIncidents: boolean;

  @Column({ name: 'team_support_score', nullable: true })
  teamSupportScore?: number;

  @Column('jsonb', { nullable: true })
  responses?: Record<string, any>;

  @Column('text', { array: true, nullable: true })
  recommendations?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}