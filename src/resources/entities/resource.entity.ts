import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
} from 'typeorm';

export enum ResourceType {
  ARTICLE = 'article',
  VIDEO = 'video',
  AUDIO = 'audio',
  EXERCISE = 'exercise',
  MEDITATION = 'meditation',
  GUIDE = 'guide',
  TOOL = 'tool',
  WORKSHEET = 'worksheet',
  COURSE = 'course',
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  resource_id: number;

  @Column({ type: 'nvarchar', length: 255 })
  title: string;

  @Column({ type: 'nvarchar', length: 255, unique: true })
  description?: string;

  @Column('text', { nullable: true })
  content?: string; 

  @Column({
    type: 'nvarchar',
    enum: ResourceType,
    name: 'resource_type',
  })
  resourceType: ResourceType;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  media_url?: string; // URL for videos, audios, PDFs

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'int', nullable: true })
  duration_minutes?: number;

  @Column({
    type: 'nvarchar',
    nullable: true,
    transformer: {
      to: (value: string[]) => value ? JSON.stringify(value) : null,
      from: (value: string) => value ? JSON.parse(value) : null,
    },
  })
  tags?: string[]; // ['stress', 'burnout', 'imposter-syndrome']

  @Column({
    type: 'nvarchar',
    nullable: true,
    transformer: {
      to: (value: string[]) => value ? JSON.stringify(value) : null,
      from: (value: string) => value ? JSON.parse(value) : null,
    },
  })
  categories?: string[]; // ['mental-health', 'work-life-balance']

  @Column({ type: 'nvarchar', length: 255, name: 'target_audience', nullable: true })
  target_audience?: string; // 'junior-devs', 'senior-devs', 'all'

  @Column({ type: 'int', default: 50 })
  view_count: number;

  @Column({ type: 'int', default: 30 })
  like_count: number;

    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;
}