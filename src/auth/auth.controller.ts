import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import { apiResponse, AuthGuard, RefreshTokenGuard } from 'src/common';
import { GITHUB_PROFILE } from 'src/types';

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
    const { accessToken, user, refreshToken } =
      await this.authService.signIn(body);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    return apiResponse(res, {
      data: { user },
      rest: { accessToken, refreshToken },
    });
  }

  @UseGuards(AuthGuard)
  @Post('signout')
  handleSignOut(@Res() res: Response): Response {
    res.clearCookie('accessToken');
    return apiResponse(res, { message: 'Sign out successfully' });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async handleRefreshToken(
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      req.user.id,
    );
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    return apiResponse(res, {
      rest: { accessToken, refreshToken },
    });
  }

  @Get('github')
  @UseGuards(PassportAuthGuard('github'))
  googleAuth() {
    return;
  }

  @Get('github/callback')
  @UseGuards(PassportAuthGuard('github'))
  async handleGithubCallback(
    @Req() req: { user: GITHUB_PROFILE },
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken, refreshToken } = await this.authService.github(
      req.user,
    );
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    return apiResponse(res, {
      rest: { accessToken, refreshToken },
    });
  }
}
