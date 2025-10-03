import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class SignInAuthDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
