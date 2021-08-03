import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import config from '../ormconfig';
import { DefaultAdminModule } from 'nestjs-admin';

@Module({
  imports: [TypeOrmModule.forRoot(config), UserModule, DefaultAdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
