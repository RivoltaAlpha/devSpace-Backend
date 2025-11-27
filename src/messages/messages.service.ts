import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationStatus } from '../conversations/entities/conversation.entity';
import { Message, MessageType } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    public conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async createOrGetConversation(dev_id: number, therapist_id: number) {
    let conversation = await this.conversationRepo.findOne({
      where: { 
        dev: { dev_id: dev_id },
        therapist: { therapist_id: therapist_id }
      },
      relations: ['dev', 'therapist'],
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        status: ConversationStatus.ACTIVE,
      });
      conversation.dev = { id: dev_id } as any;
      conversation.therapist = { id: therapist_id } as any;
      await this.conversationRepo.save(conversation);
    }

    return conversation;
  }

  async sendMessage(
    conversation_id: number,
    sender_id: number,
    receiver_id: number,
    content: string,
    messageType: MessageType = MessageType.TEXT,
    mediaUrl?: string,
  ) {
    const conversation = await this.conversationRepo.findOne({
      where: { conversation_id: conversation_id },
      relations: ['dev', 'therapist'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify sender is part of the conversation
    if (conversation.dev.dev_id !== sender_id && conversation.therapist.therapist_id !== sender_id) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    const message = this.messageRepo.create({
      conversation: { conversation_id: conversation_id } as any,
      sender: { id: sender_id } as any,
      receiver: { id: conversation.dev.dev_id === sender_id ? conversation.therapist.therapist_id : conversation.dev.dev_id } as any,
      content,
      message_type: messageType,
      media_url: mediaUrl,
    });

    await this.messageRepo.save(message);

    // Update conversation's last message timestamp
    conversation.last_message_at = new Date();
    await this.conversationRepo.save(conversation);

    return message;
  }

  async getConversationMessages(
    conversationId: number,
    userId: number,
    page: number = 1,
    limit: number = 50,
  ) {
    const conversation = await this.conversationRepo.findOne({
      where: { conversation_id: conversationId },
      relations: ['dev', 'therapist'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify user has access
    if (conversation.dev.dev_id !== userId && conversation.therapist.therapist_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const [messages, total] = await this.messageRepo.findAndCount({
      where: { 
        conversation: { conversation_id: conversationId }
      },
      relations: ['sender', 'receiver'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      messages: messages.reverse(), // Show oldest first
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markMessagesAsRead(conversationId: number, userId: number) {
    await this.messageRepo
      .createQueryBuilder('message')
      .update(Message)
      .set({ is_read: true, read_at: new Date() })
      .where('message.conversation_id = :conversationId', { conversationId })
      .andWhere('message.sender_id != :userId', { userId })
      .andWhere('message.is_read = :isRead', { isRead: false })
      .execute();
  }

  async getUserConversations(userId: number, userRole: string) {
    const whereCondition = userRole === 'dev' 
      ? { dev: { dev_id: userId } }
      : { therapist: { therapist_id: userId } };

    return this.conversationRepo.find({
      where: whereCondition,
      relations: ['dev', 'therapist'],
      order: { last_message_at: 'DESC' },
    });
  }

  // Add missing CRUD methods for controller compatibility
  async create(createMessageDto: CreateMessageDto) {
    return this.sendMessage(
      createMessageDto.conversation_id,
      createMessageDto.sender_id,
      createMessageDto.receiver_id,
      createMessageDto.content,
      createMessageDto.messageType,
      createMessageDto.mediaUrl,
    );
  }

  async findAll() {
    return this.messageRepo.find({
      relations: ['sender', 'receiver', 'conversation'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const message = await this.messageRepo.findOne({
      where: { message_id: id },
      relations: ['sender', 'receiver', 'conversation'],
    });
    
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);
    
    Object.assign(message, updateMessageDto);
    message.is_edited = true;
    message.edited_at = new Date();
    
    return this.messageRepo.save(message);
  }

  async remove(id: number) {
    const message = await this.findOne(id);
    return this.messageRepo.remove(message);
  }
}

