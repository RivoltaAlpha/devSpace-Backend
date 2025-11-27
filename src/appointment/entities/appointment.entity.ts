import { User } from 'src/users/entities/user.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum AppointmentType {
  INITIAL_CONSULTATION = 'initial_consultation',
  REGULAR_SESSION = 'regular_session',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  GROUP_SESSION = 'group_session',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  appointment_id: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    name: 'appointment_type',
    default: AppointmentType.REGULAR_SESSION,
  })
  appointmentType: AppointmentType;

  @Column({ name: 'scheduled_at' })
  scheduled_at: Date;

  @Column({ name: 'duration_minutes', default: 50 })
  duration_minutes: number;

  @Column({
    type: 'nvarchar',
    length: 255,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ type: 'nvarchar', nullable: true })
  meeting_link?: string;

  @Column({ type: 'nvarchar', nullable: true })
  meeting_platform?: string; // 'zoom', 'google-meet', 'teams'

  @Column('text', { nullable: true })
  dev_notes?: string; // What the developer wants to discuss

  @Column('text', { nullable: true })
  therapist_notes?: string; // Private notes for therapist

  @Column('text', { nullable: true })
  session_summary?: string; // Post-session summary

  @Column({ type: 'int', nullable: true })
  dev_rating?: number; // 1-5 rating from developer

  @Column('text', { nullable: true })
  dev_feedback?: string;

  @Column({ type: 'bit', default: false })
  reminder_sent: boolean;

  @Column({ type: 'datetime2', nullable: true })
  started_at?: Date;

  @Column({ type: 'datetime2', nullable: true })
  ended_at?: Date;

  @Column({ type: 'int', nullable: true })
  cancelled_by?: number; // userId who cancelled

  @Column({type: 'nvarchar', length: 255, nullable: true })
  cancellation_reason?: string;

    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;
  
  // Relationships
  @ManyToOne(() => User)
  @JoinColumn({ name: 'dev_id' })
  dev: User;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'therapist_id' })
  therapist: User;
}