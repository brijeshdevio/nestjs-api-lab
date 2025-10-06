import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String, unique: true, index: true })
  slug: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ type: String })
  featuredImageUrl: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['draft', 'published'],
    default: 'draft',
    type: String,
  })
  status: string;

  @Prop({ type: String })
  metaTitle: string;

  @Prop({ type: String })
  metaDescription: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
