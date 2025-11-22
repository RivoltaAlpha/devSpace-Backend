import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationStatus } from '../conversations/entities/conversation.entity';
import { Message, MessageType } from './entities/message.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    public conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async createOrGetConversation(devId: string, therapistId: string) {
    let conversation = await this.conversationRepo.findOne({
      where: { devId, therapistId },
      relations: ['dev', 'therapist'],
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        devId,
        therapistId,
        status: ConversationStatus.ACTIVE,
      });
      await this.conversationRepo.save(conversation);
    }

    return conversation;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: MessageType = MessageType.TEXT,
    mediaUrl?: string,
  ) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify sender is part of the conversation
    if (conversation.devId !== senderId && conversation.therapistId !== senderId) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    const message = this.messageRepo.create({
      conversationId,
      senderId,
      content,
      messageType,
      mediaUrl,
    });

    await this.messageRepo.save(message);

    // Update conversation's last message timestamp
    conversation.lastMessageAt = new Date();
    await this.conversationRepo.save(conversation);

    return message;
  }

  async getConversationMessages(
    conversationId: string,
    userId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify user has access
    if (conversation.devId !== userId && conversation.therapistId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const [messages, total] = await this.messageRepo.findAndCount({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
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

  async markMessagesAsRead(conversationId: string, userId: string) {
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true, readAt: new Date() })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('senderId != :userId', { userId })
      .andWhere('isRead = :isRead', { isRead: false })
      .execute();
  }

  async getUserConversations(userId: string, userRole: string) {
    const whereCondition = userRole === 'dev' 
      ? { devId: userId }
      : { therapistId: userId };

    return this.conversationRepo.find({
      where: whereCondition,
      relations: ['dev', 'therapist'],
      order: { lastMessageAt: 'DESC' },
    });
  }
}

