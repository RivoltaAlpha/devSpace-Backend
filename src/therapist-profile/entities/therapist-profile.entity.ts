import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('therapist_profiles')
export class TherapistProfile {
  @PrimaryGeneratedColumn()
  therapist_id: number;

  @OneToOne('User')
  @JoinColumn({ name: 'user_id' })
  user: number;

  @Column({ type: 'nvarchar', nullable: false })
  license_number?: string;

  @Column('text', { array: true, nullable: true })
  specializations?: string[];

  @Column({ type: 'int', nullable: true })
  years_experience?: number;

  @Column('text', { nullable: true })
  bio?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  session_rate?: number;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  availability_slots?: string;

  @Column({ type: 'bit', default: true })
  is_accepting_clients: boolean;

  @Column({ type: 'int', default: 20 })
  max_clients: number;

    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;
}
