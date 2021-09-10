import { IsNotEmpty } from 'class-validator';
export class JoinClassroomDTO {
  @IsNotEmpty()
  code: string;
}