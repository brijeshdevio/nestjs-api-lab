import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

  @UseGuards(AuthGuard)
  @Put(':id')
  async handleUpdatePost(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<Response> {
    const post = await this.postService.updatePost(req.user.id, id, body);
    return apiResponse(res, {
      data: { post },
      message: 'Post updated successfully.',
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async handleDeletePost(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.postService.deletePost(req.user.id, id);
    return apiResponse(res, { message: 'Post deleted successfully.' });
  }
}
