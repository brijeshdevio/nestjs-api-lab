import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { Model } from 'mongoose';
import { AuthProvider, User } from 'src/schema/user.schema';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import { GITHUB_PROFILE } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async getTokens(id: string) {
    const payload = { id };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  async signUp(data: SignUpAuthDto) {
    data.password = await argon2.hash(data.password);
    const provider = {
      provider: AuthProvider.LOCAL,
      providerId: data.email,
    };
    try {
      const createdUser = await this.userModel.create({
        name: data.name,
        email: data.email,
        password: data.password,
        providers: [provider],
      });
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
    if (!user || !user?._id || !user?.password) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const isValidPassword = await argon2.verify(user?.password, data.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Credentials.');
    }
    user.password = undefined as unknown as string;

    const tokens = await this.getTokens(String(user._id));
    return { user, ...tokens };
  }

  async refreshToken(id: string) {
    const tokens = await this.getTokens(id);
    return tokens;
  }

  async findByProviderId(provider: AuthProvider, providerId: string) {
    const user = await this.userModel
      .findOne({
        'providers.provider': provider,
        'providers.providerId': providerId,
      })
      .lean()
      .select('-__v -password -providers');
    return user;
  }

  async github(data: GITHUB_PROFILE) {
    const findUser = await this.findByProviderId(AuthProvider.GITHUB, data.id);
    if (findUser) {
      return await this.getTokens(String(findUser._id));
    }
    const user = await this.userModel.create({
      name: data.displayName,
      providers: [
        {
          provider: AuthProvider.GITHUB,
          providerId: data.id,
        },
      ],
      avatar: data._json.avatar_url,
      bio: data._json.bio,
    });
    return await this.getTokens(String(user._id));
  }
}
