import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

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
  @PrimaryGeneratedColumn()
  dev_id: number;

  @OneToOne('User')
  @JoinColumn({ name: 'user_id' })
  user: number;

  @Column({
    type: 'nvarchar',
    nullable: true,
    length: 255,
  })
  tech_stack?: string;

  @Column({
    type: 'nvarchar',
    enum: ExperienceLevel,
    name: 'experience_level',
    nullable: true,
  })
  experience_level?: ExperienceLevel;

  @Column({
    type: 'nvarchar',
    enum: WorkMode,
    name: 'work_mode',
    nullable: true,
  })
  work_mode?: WorkMode;

  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  bio?: string;

  @Column({
    type: 'nvarchar',
    name: 'primary_stressors',
    nullable: true,
    length: 1000,
  })
  primary_stressors?: string;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;
}
