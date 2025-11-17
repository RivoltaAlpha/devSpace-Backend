import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/signup.dto';
import { LoginDto } from "./dto/signin.dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await this.hashData(refreshToken);
    await this.userRepository.update(userId,
        {
            hashedRefreshedToken: hashedToken,
        }
    );
  }

  private generateTokens(userId: number, email: string, role: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email: email, role: role },
      {
        secret: this.configService.getOrThrow<string>(
          'JWT_ACCESS_TOKEN_SECRET',
        ),
        expiresIn: '2h',
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId, email: email, role: role },
      {
        secret: this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_SECRET',
        ),
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async SignUp(createAuthDto: CreateAuthDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
      select: ['user_id', 'email', 'password'],
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const user = this.userRepository.create({
      ...createAuthDto,
        hashedRefreshedToken: "",
      password: hashedPassword,
    });

    // generate the tokens
    const savedUser = await this.userRepository.save(user);
    const { accessToken, refreshToken } = this.generateTokens(
      savedUser.user_id,
      savedUser.email,
      savedUser.role,
    );

    await this.saveRefreshToken(savedUser.user_id, refreshToken);    
    
    // return user and tokens
    const updatedUser = await this.userRepository.findOne({
        where: {user_id: savedUser.user_id},
    });

    const isAuthenticated = true;

    // const userWithoutPassoword = 
    return {
        user: updatedUser,
        accessToken,
        refreshToken,
        isAuthenticated
    }
}

async SignOut (userId: number) {
    const res = await this.userRepository.update(userId, {
        hashedRefreshedToken: null,
    }
);

    if (res.affected === 0) {
        throw new NotFoundException(`user with id ${userId} not found`);
    }
    return `user with id ${userId} signed out`
}

async SignIn (loginDto: LoginDto) {
    const foundUser = await this.userRepository.findOne({
        where: {email: loginDto.email},
        select: ['email' ,'user_id', 'role', 'password']
    })

    if(!foundUser) {
        throw new NotFoundException('User with that email not found')
    };

    const foundPassword = await bcrypt.compare(
        loginDto.password,
        foundUser.password,
    );

    if(!foundPassword){
        throw new UnauthorizedException('Invalid password😒');
    }

    const {accessToken, refreshToken} = await this.generateTokens(
        foundUser.user_id,
        foundUser.email,
        foundUser.role
    )

    await this.saveRefreshToken(foundUser.user_id, refreshToken);    

        const isAuthenticated = true;

    
    // return user and tokens
    return {
        foundUser,
        accessToken,
        refreshToken,
        isAuthenticated
    }

}

}