import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from './user.service';
import { apiResponse, AuthGuard } from 'src/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChangePasswordDto, UpdateUserDto } from './dto';

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

  @Put('profile')
  async handleUpdateProfile(
    @Req() req: { user: { id: string } },
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.userService.updateProfile(req.user.id, body);
    return apiResponse(res, {
      data: { user },
      message: 'Profile updated successfully',
    });
  }

  @Post('change-password')
  async handleChangePassword(
    @Req() req: { user: { id: string } },
    @Body() body: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.userService.changePassword(req.user.id, body);
    return apiResponse(res, {
      message: 'Password changed successfully',
    });
  }
}
