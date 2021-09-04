import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './utils/decorators/auth.decorator';
import { User } from './utils/decorators/user.decorator';
import { UserEntity } from './models/user/entities/user.entity';
import { DTOInterceptor } from './utils/interceptors/dto.interceptor';

@Controller()
@UseInterceptors(new DTOInterceptor())
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth()
  getHello(@User() user: UserEntity): string {
    return this.appService.getHello(user);
  }
}
