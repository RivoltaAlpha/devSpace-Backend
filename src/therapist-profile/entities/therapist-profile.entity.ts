import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('therapist_profiles')
export class TherapistProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'license_number', nullable: true })
  licenseNumber?: string;

  @Column('text', { array: true, nullable: true })
  specializations?: string[];

  @Column({ name: 'years_experience', nullable: true })
  yearsExperience?: number;

  @Column('text', { nullable: true })
  bio?: string;

  @Column('decimal', { name: 'session_rate', precision: 10, scale: 2, nullable: true })
  sessionRate?: number;

  @Column('jsonb', { name: 'availability_slots', nullable: true })
  availabilitySlots?: Record<string, any>;

  @Column({ name: 'is_accepting_clients', default: true })
  isAcceptingClients: boolean;

  @Column({ name: 'max_clients', default: 20 })
  maxClients: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
