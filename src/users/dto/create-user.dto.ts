import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({example: 'Tiffany Mwaniki'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({example: 'tiffany@example.com'})
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({example: 'password123'})
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({example: '+1234567890'})
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({example: 'null', description: 'Hashed refresh token'})
  @IsOptional()
  @IsString()
  hashedRefreshedToken?: string | null;

  @ApiProperty({example: 'user'})
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;


}
