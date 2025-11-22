import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { AtGuard } from './auth/guards/access-token.guard';
import { User } from './users/entities/user.entity';
import { LoggerModule } from './logger/logger.module';
import { databaseConfig } from './database/database.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { DeveloperProfileModule } from './developer-profile/developer-profile.module';
import { TherapistProfileModule } from './therapist-profile/therapist-profile.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { DailyCheckinsModule } from './daily-checkins/daily-checkins.module';
import { BurnoutAssesmentModule } from './burnout-assesment/burnout-assesment.module';
import { BlogsModule } from './blogs/blogs.module';
import { ResourcesModule } from './resources/resources.module';
import { RemindersModule } from './reminders/reminders.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ConversationalContextsModule } from './conversational_contexts/conversational_contexts.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    DeveloperProfileModule,
    TherapistProfileModule,
    MessagesModule,
    ConversationsModule,
    DailyCheckinsModule,
    BurnoutAssesmentModule,
    BlogsModule,
    ResourcesModule,
    RemindersModule,
    AppointmentModule,
    ConversationalContextsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
