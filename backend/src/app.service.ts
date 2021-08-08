import { Injectable } from '@nestjs/common';
import { UserEntity } from './user/entities/user.entity';
import { ProfessorEntity } from './user/entities/professor.entity';
import { StudentEntity } from './user/entities/student.entity';

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
