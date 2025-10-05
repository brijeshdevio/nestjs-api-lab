import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export default class ChangePasswordDto {
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @IsStrongPassword()
  password: string;
}
