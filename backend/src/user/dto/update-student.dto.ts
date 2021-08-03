import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { CreateUserDto } from './create-user.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  name: string
}
