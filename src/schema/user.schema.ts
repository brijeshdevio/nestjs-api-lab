import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum AuthProvider {
  LOCAL = 'local',
  GITHUB = 'github',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  email?: string;

  // ✅ Keep password optional since OAuth users may not have one
  @Prop({ required: false, select: false })
  password?: string;

  // ✅ Provider data array (one user can link multiple)
  @Prop({
    type: [
      {
        provider: {
          type: String,
          enum: Object.values(AuthProvider),
          required: true,
        },
        providerId: { type: String, required: true },
      },
    ],
    default: [],
  })
  providers: {
    provider: AuthProvider;
    providerId: string;
  }[];

  // Optional fields for OAuth profile data
  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  // For handling refresh tokens (JWT)
  @Prop({ select: false })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
