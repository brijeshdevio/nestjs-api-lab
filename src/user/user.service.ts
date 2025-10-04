import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async getProfile(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .lean()
      .select('-__v -password');
    if (!user) {
      throw new UnauthorizedException('You are not authorized');
    }
    return user;
  }

  async updateProfile(id: string, data: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .lean()
      .select('-__v -password');
    if (!updatedUser) {
      throw new UnauthorizedException('You are not authorized');
    }
    return updatedUser;
  }
}
