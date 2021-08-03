import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessorDto } from './create-prof.dto';

export class UpdateProfDto extends PartialType(CreateProfessorDto) {}
