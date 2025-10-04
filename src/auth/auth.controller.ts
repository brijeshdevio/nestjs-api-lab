import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import { apiResponse } from 'src/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async handleSignUp(
    @Body() body: SignUpAuthDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.signUp(body);
    return apiResponse(res, {
      message: 'Account created successfully!',
    });
  }

  @Post('signin')
  async handleSignIn(
    @Body() body: SignInAuthDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken, user } = await this.authService.signIn(body);
    return apiResponse(res, { data: { user }, rest: { accessToken } });
  }
}
