import { Injectable } from '@nestjs/common';
import { UserEntity } from './models/user/entities/user.entity';
import { ProfessorEntity } from './models/user/entities/professor.entity';
import { StudentEntity } from './models/user/entities/student.entity';

@Injectable()
export class AppService {
  getHello(user: UserEntity): string {
    if (user instanceof ProfessorEntity) {
      return `Hello ${user.firstName} ${user.lastName} !`;
    } else if (user instanceof StudentEntity) {
      return `Hello ${user.name} !`;
    }
    return `Hello !`;
  }
}
