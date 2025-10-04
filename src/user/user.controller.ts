import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from './user.service';
import { apiResponse, AuthGuard } from 'src/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async handleGetProfile(
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.userService.getProfile(req.user.id);
    return apiResponse(res, { data: { user } });
  }
}
