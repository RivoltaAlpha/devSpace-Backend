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
  id: string;

  @Column({ name: 'dev_id' })
  devId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'dev_id' })
  dev: User;

  @Column({ name: 'therapist_id' })
  therapistId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'therapist_id' })
  therapist: User;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    name: 'appointment_type',
    default: AppointmentType.REGULAR_SESSION,
  })
  appointmentType: AppointmentType;

  @Column({ name: 'scheduled_at' })
  scheduledAt: Date;

  @Column({ name: 'duration_minutes', default: 50 })
  durationMinutes: number;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ name: 'meeting_link', nullable: true })
  meetingLink?: string;

  @Column({ name: 'meeting_platform', nullable: true })
  meetingPlatform?: string; // 'zoom', 'google-meet', 'teams'

  @Column('text', { name: 'dev_notes', nullable: true })
  devNotes?: string; // What the developer wants to discuss

  @Column('text', { name: 'therapist_notes', nullable: true })
  therapistNotes?: string; // Private notes for therapist

  @Column('text', { name: 'session_summary', nullable: true })
  sessionSummary?: string; // Post-session summary

  @Column({ name: 'dev_rating', nullable: true })
  devRating?: number; // 1-5 rating from developer

  @Column('text', { name: 'dev_feedback', nullable: true })
  devFeedback?: string;

  @Column({ name: 'reminder_sent', default: false })
  reminderSent: boolean;

  @Column({ name: 'reminder_sent_at', nullable: true })
  reminderSentAt?: Date;

  @Column({ name: 'started_at', nullable: true })
  startedAt?: Date;

  @Column({ name: 'ended_at', nullable: true })
  endedAt?: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy?: string; // userId who cancelled

  @Column('text', { name: 'cancellation_reason', nullable: true })
  cancellationReason?: string;

  @Column({ name: 'cancelled_at', nullable: true })
  cancelledAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
