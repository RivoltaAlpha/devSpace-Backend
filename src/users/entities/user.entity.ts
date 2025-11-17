import { Event } from "../../events/entities/event.entity";
import { Feedback } from "../../feedback/entities/feedback.entity";
import { Registration } from "../../registrations/entities/registration.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

export enum UserRole{
    Admin = 'Admin',
    User = 'user',
    Organizer = 'Organizer',
    Guest = 'Guest'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    email:string;

    @Column({type: 'varchar', length: 255, nullable: false})
    password: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    phone:string;

    @Column({type: 'varchar', length: 255})
    hashedRefreshedToken?: string | null; 

    @Column({
        type: 'varchar',
        length: 10,
        default: UserRole.User
    })
    role: UserRole;
    
    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;

    @OneToMany(() => Feedback, (feedback) => feedback.user)
    feedback: Feedback;

    @OneToMany(() => Registration, (registration) => registration.user)
    registration: Registration;

    @OneToMany(() => Event, (event) => event.created_by)
    event: Event;
}
