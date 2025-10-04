import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;
}
