import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateLevelDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;
}
