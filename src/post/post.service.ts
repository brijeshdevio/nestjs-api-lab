import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from 'slugify';
import { Model, Types } from 'mongoose';
import { Post } from 'src/schema/post.schema';
import { CreatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  private isValidId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Post ID');
    }
  }

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

  async getPost(id: string): Promise<Post> {
    this.isValidId(id);
    const post = await this.postModel
      .findById(id)
      .lean()
      .select('-__v -updatedAt -content')
      .populate('author', 'name');
    if (post) {
      return post;
    }
    throw new NotFoundException(`Post with id ${id} not found.`);
  }

  async updatePost(id: string, data: any): Promise<Post> {
    this.isValidId(id);
    const post = await this.postModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .lean()
      .select('-__v -updatedAt -content')
      .populate('author', 'name');
    if (post) {
      return post;
    }

    throw new NotFoundException(`Post with id ${id} not found.`);
  }
}
