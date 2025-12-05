import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  SEVERE = 'severe',
}

@Entity('burnout_assessments')
export class BurnoutAssessment {
  @PrimaryGeneratedColumn()
  assessment_id: number;

  @Column({ type: 'int', nullable: true })
  emotionalExhaustion_score?: number;

  @Column({ type: 'int', nullable: true })
  depersonalization_score?: number;

  @Column({ type: 'int', nullable: true })
  personal_accomplishment_score?: number;

  @Column({ type: 'int', nullable: true })
  overall_burnout_score?: number;

  @Column({
    type: 'nvarchar',
    length: 255,
    name: 'risk_level',
    nullable: true,
  })
  risk_level?: RiskLevel;

  @Column('text', { array: true, nullable: true })
  recommendations?: string[];

  @CreateDateColumn({ type: 'datetime2'})
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}