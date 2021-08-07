import { PartialType } from '@nestjs/mapped-types';
import { Professor } from '../entities/professor.entity';

export class UpdateProfDto extends PartialType(Professor) {}
