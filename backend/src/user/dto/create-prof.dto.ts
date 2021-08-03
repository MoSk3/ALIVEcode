import { CreateUserDto } from './create-user.dto';

export class CreateProfessorDto extends CreateUserDto {
  firstName: string;
  lastName: string;
}
