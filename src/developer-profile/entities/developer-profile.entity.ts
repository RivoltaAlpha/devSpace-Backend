import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

export enum ExperienceLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  PRINCIPAL = 'principal',
}

export enum WorkMode {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ONSITE = 'onsite',
}

@Entity('developer_profiles')
export class DeveloperProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text', { array: true, name: 'tech_stack', nullable: true })
  techStack?: string[];

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    name: 'experience_level',
    nullable: true,
  })
  experienceLevel?: ExperienceLevel;

  @Column({ name: 'company_size', nullable: true })
  companySize?: string;

  @Column({
    type: 'enum',
    enum: WorkMode,
    name: 'work_mode',
    nullable: true,
  })
  workMode?: WorkMode;

  @Column({ nullable: true })
  timezone?: string;

  @Column('text', { nullable: true })
  bio?: string;

  @Column('text', { array: true, name: 'primary_stressors', nullable: true })
  primaryStressors?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}