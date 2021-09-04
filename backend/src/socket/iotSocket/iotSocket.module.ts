import { Module } from '@nestjs/common';
import { IoTGateway } from './iot.gateway';

@Module({
  providers: [IoTGateway],
})
export class EventsModule {}