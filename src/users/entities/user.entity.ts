
import { DeveloperProfile } from "src/developer-profile/entities/developer-profile.entity";
import { TherapistProfile } from "src/therapist-profile/entities/therapist-profile.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToOne } from "typeorm";

export enum UserRole{
    Admin = 'Admin',
    Dev = 'Dev',
    Therapist = 'Therapist',
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

    @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'last_active_at', nullable: true })
  lastActiveAt?: Date;

   @OneToOne(() => DeveloperProfile, profile => profile.user)
  developerProfile?: DeveloperProfile;

  @OneToOne(() => TherapistProfile, profile => profile.user)
  therapistProfile?: TherapistProfile;
}
