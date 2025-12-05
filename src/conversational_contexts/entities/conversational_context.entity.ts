import { User } from "../../users/entities/user.entity";
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('conversational_contexts')
export class ConversationalContext {
    @PrimaryGeneratedColumn()
    context_id: number;

    @Column({ type: 'nvarchar', length: 'MAX' })
    context_data: string;

    @Column({ type: 'nvarchar', length: 255 })
    session_type: string;

    @CreateDateColumn({ type: 'datetime2' })
    created_at: Date;
    
    @UpdateDateColumn({ type: 'datetime2' })
    updated_at: Date;

    // relationships
    @ManyToOne(() => User)
    @JoinColumn({ name: 'dev_id' })
    dev: User;
}
