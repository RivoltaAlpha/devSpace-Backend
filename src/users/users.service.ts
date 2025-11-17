import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if user with email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const user = this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        phone: createUserDto.phone,
        role: createUserDto.role,
        hashedRefreshedToken: ""
      });

     const savedUser: any = await this.userRepository.save(user);
     this.logger.log('This is a log of the user being created', savedUser)

      return savedUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    } 
  }  

  async findAll() {
    try {
      return await this.userRepository.find({
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      console.log(error)
      throw new HttpException('Error frindding your users', HttpStatus.INTERNAL_SERVER_ERROR,)
    }
  }

  async findOne(user_id: number) {
    try {
      const user = await this.userRepository.findOne({where: {user_id}});
      if(!user){
        throw new NotFoundException(`User with id ${user_id} not found`)
      }
      return user;
    } catch (error) {
      if(error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Error while finding user');
    }
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({where: {user_id}});
      if(!existingUser){
        throw new NotFoundException(`User with id ${user_id} not found`)
      }

      await this.userRepository.update(user_id, updateUserDto);
      const updatedUser = await this.userRepository.findOne({where: {user_id}});
      if(!updatedUser){
        throw new NotFoundException(`User with id ${user_id} not found`)
      }
      return updatedUser;
    } catch (error) {
      if(error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Error while updating the user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(user_id: number): Promise<string> {
    try {
      const existingUser = await this.userRepository.findOne({where: {user_id}});
      if(!existingUser){
        throw new NotFoundException(`User with id ${user_id} not found`)
      }

      const result = await this.userRepository.delete(user_id);
      if(result.affected === 0) {
        throw new NotFoundException(`User with not found`)
      }
      return'User deleted'
    } catch (error) {
            if(error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Error deleting the user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
