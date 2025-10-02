import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { SignInAuthDto, SignUpAuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: SignUpAuthDto) {
    data.password = await argon2.hash(data.password);
    try {
      const createdUser = await this.userModel.create(data);
      return createdUser;
    } catch (error: unknown) {
      const CONFLICT_CODE = 11000;
      const err = error as { code: number };
      if (err?.code === CONFLICT_CODE) {
        throw new ConflictException(
          'A user with this email address already exists.',
        );
      }
      throw error;
    }
  }

  async signIn(data: SignInAuthDto) {
    const user = await this.userModel
      .findOne({ email: data.email })
      .lean()
      .select('-__v');
    if (!user || !user?._id) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const isValidPassword = await argon2.verify(user.password, data.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Credentials.');
    }
    user.password = undefined as unknown as string;

    const payload = { id: user._id };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user,
    };
  }
}
