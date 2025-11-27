import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messages.service';
import { MessageType } from './entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, string>(); // userId -> socketId

  constructor(private messagingService: MessagingService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.connectedUsers.entries())
      .find(([_, socketId]) => socketId === client.id)?.[0];
    
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      conversation_id: number;
      sender_id: number;
      receiver_id: number;
      content: string;
      messageType?: MessageType;
      mediaUrl?: string;
    },
  ) {
    try {
      const message = await this.messagingService.sendMessage(
        payload.conversation_id,
        payload.sender_id,
        payload.receiver_id,
        payload.content,
        payload.messageType,
        payload.mediaUrl,
      );

      // Emit to both participants
      const conversation = await this.messagingService.conversationRepo.findOne({
        where: { conversation_id: payload.conversation_id },
        relations: ['dev', 'therapist'],
      });

      if (!conversation) {
        client.emit('message_error', { error: 'Conversation not found' });
        return { success: false, error: 'Conversation not found' };
      }

      const recipientId = conversation.dev.dev_id === payload.sender_id 
        ? conversation.therapist.therapist_id
        : conversation.dev?.dev_id;

      const recipientSocketId = this.connectedUsers.get(recipientId);
      
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('new_message', message);
      }

      // Also emit back to sender for confirmation
      client.emit('message_sent', message);

      return { success: true, message };
    } catch (error) {
      client.emit('message_error', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; userId: string },
  ) {
    await this.messagingService.markMessagesAsRead(
      parseInt(payload.conversationId),
      parseInt(payload.userId),
    );

    // Notify the other user that messages were read
    const conversation = await this.messagingService.conversationRepo.findOne({
      where: { conversation_id: parseInt(payload.conversationId) },
      relations: ['dev', 'therapist'],
    });

    if (!conversation) {
      return;
    }

    const otherUserId = conversation.dev?.dev_id === parseInt(payload.userId) 
        ? conversation.therapist?.therapist_id 
        : conversation.dev?.dev_id;

    const otherUserSocketId: string | undefined = this.connectedUsers.get(otherUserId);
    
    if (otherUserSocketId) {
      this.server.to(otherUserSocketId).emit('messages_read', {
        conversationId: payload.conversationId,
        readBy: payload.userId,
      });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; userId: string; isTyping: boolean },
  ) {
    // Broadcast typing indicator to conversation participants
    client.to(payload.conversationId).emit('user_typing', {
      userId: payload.userId,
      isTyping: payload.isTyping,
    });
  }
}