import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto';
import { apiResponse, AuthGuard } from 'src/common';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  async handleCreatePost(
    @Req() req: { user: { id: string } },
    @Body() body: CreatePostDto,
    @Res() res: Response,
  ): Promise<Response> {
    const post = await this.postService.createPost(req.user.id, body);
    return apiResponse(res, { data: { post } });
  }

  @Get()
  async handleGetPosts(@Res() res: Response): Promise<Response> {
    const posts = await this.postService.getPosts();
    return apiResponse(res, { data: { posts } });
  }

  @Get(':id')
  async handleGetPost(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const post = await this.postService.getPost(id);
    return apiResponse(res, { data: { post } });
  }
}
