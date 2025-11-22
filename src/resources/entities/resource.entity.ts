import { User } from 'src/users/entities/user.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
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

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, name: 'author_id' })
  authorId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author?: User;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  content?: string; // Full content for articles/guides

  @Column({
    type: 'enum',
    enum: ResourceType,
    name: 'resource_type',
  })
  resourceType: ResourceType;

  @Column({ name: 'media_url', nullable: true })
  mediaUrl?: string; // URL for videos, audios, PDFs

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl?: string;

  @Column({ name: 'duration_minutes', nullable: true })
  durationMinutes?: number;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    name: 'difficulty_level',
    nullable: true,
  })
  difficultyLevel?: DifficultyLevel;

  @Column('text', { array: true, nullable: true })
  tags?: string[]; // ['stress', 'burnout', 'imposter-syndrome']

  @Column('text', { array: true, nullable: true })
  categories?: string[]; // ['mental-health', 'work-life-balance']

  @Column({ name: 'target_audience', nullable: true })
  targetAudience?: string; // 'junior-devs', 'senior-devs', 'all'

  @Column({ name: 'is_premium', default: false })
  isPremium: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'completion_count', default: 0 })
  completionCount: number;

  @Column('jsonb', { name: 'metadata', nullable: true })
  metadata?: Record<string, any>; // Flexible field for extra data

  @Column({ name: 'published_at', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}