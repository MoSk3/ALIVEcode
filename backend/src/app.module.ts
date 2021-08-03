import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import config from '../ormconfig';
import { DefaultAdminModule } from 'nestjs-admin';
import { ClassroomModule } from './classroom/classroom.module';
import { LevelModule } from './level/level.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    DefaultAdminModule,
    ClassroomModule,
    LevelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
