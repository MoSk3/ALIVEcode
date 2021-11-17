import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from 'src/models/social/messages/entities/message.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message
    ]),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}