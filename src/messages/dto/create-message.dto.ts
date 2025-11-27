import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { MessageType } from '../entities/message.entity';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  conversation_id: number;

  @IsNumber()
  @IsNotEmpty()
  sender_id: number;
  
  @IsNumber()
  @IsNotEmpty()
  receiver_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType;

  @IsString()
  @IsOptional()
  mediaUrl?: string;
}
