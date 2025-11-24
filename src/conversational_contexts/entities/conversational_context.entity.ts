import { User } from "src/users/entities/user.entity";
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


export class ConversationalContext {
    @PrimaryGeneratedColumn()
    context_id: number;

    @Column({ type: 'nvarchar' })
    context_data: string;

    @Column({ type: 'nvarchar' })
    session_type: string;

    @Column()
    created_at: Date;
    updated_at: Date;

    // relationships
      @ManyToOne(() => User)
      @JoinColumn({ name: 'dev_id' })
      dev: User;
}
