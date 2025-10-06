import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from 'slugify';
import { Model } from 'mongoose';
import { Post } from 'src/schema/post.schema';
import { CreatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async generateSlug(title: string): Promise<string> {
    const slug = slugify(title);
    const isUnique = await this.postModel.findOne({ slug });
    if (isUnique) {
      return `${slug}-${Date.now()}`;
    }
    return slug;
  }

  async createPost(author: string, data: CreatePostDto): Promise<Post> {
    const slug = await this.generateSlug(data.title);
    const post = await this.postModel.create({
      ...data,
      slug,
      author,
    });
    return post.toJSON();
  }

  async getPosts(): Promise<Post[]> {
    const posts = await this.postModel
      .find()
      .lean()
      .select('-__v -updatedAt -content')
      .populate('author', 'name');
    return posts;
  }
}
