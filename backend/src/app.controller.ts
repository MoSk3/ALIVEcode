import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './utils/decorators/auth.decorator';
import { User } from './utils/decorators/user.decorator';
import { UserEntity } from './user/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth()
  getHello(@User() user: UserEntity): string {
    return this.appService.getHello(user);
  }
}
