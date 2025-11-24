import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
} from 'typeorm';

@Entity('blogs')
export class Blog {
@PrimaryGeneratedColumn()
blog_id: number;

@Column({ type: 'nvarchar', length: 255 })
title: string;

@Column({ type: 'text' })
content: string;

@Column({ type: 'nvarchar', length: 100 })
category: string;

    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;
}
