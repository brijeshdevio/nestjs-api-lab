import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schema/user.schema';
import { AuthGuard } from 'src/common';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async handleGetProfile(@Req() req: { user: { id: string } }): Promise<User> {
    const user = await this.userService.getProfile(req.user.id);
    return user;
  }
}
