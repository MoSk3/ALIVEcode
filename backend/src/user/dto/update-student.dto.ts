import { PartialType } from '@nestjs/mapped-types';
import { Student } from '../entities/student.entity';

export class UpdateStudentDto extends PartialType(Student) {}
