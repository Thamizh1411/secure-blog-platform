import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { AuthGuard } from '@nestjs/passport';
import { Delete} from '@nestjs/common';
import {Param} from '@nestjs/common';
import { Query } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ApiTags } from '@nestjs/swagger';
import { Patch } from '@nestjs/common';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
//import { AuthGuard } from '@nestjs/passport';
//import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}
   @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Request() req,
    @Body() body: CreateCommentDto,
  ) {
    return this.blogsService.addComment(
      id,
      req.user.userId,
      body.content,
    );
  }
  // 🔐 Create Blog (Protected)
  @UseGuards(AuthGuard('jwt'))
  @Post()
 create(@Request() req, @Body() body: CreateBlogDto) {
  return this.blogsService.create(
    req.user.userId,
    body.title,
    body.content,
  );
}

  // 🌍 Get All Blogs (Public)
  @Get()
  findAll() {
    return this.blogsService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
@Delete(':id')
delete(@Request() req, @Param('id') id: string) {
  return this.blogsService.delete(id, req.user.userId);
}
@UseGuards(AuthGuard('jwt'))
@Post(':id/like')
toggleLike(@Param('id') id: string, @Request() req) {
  return this.blogsService.toggleLike(id, req.user.userId);
}
// Get Comments (Public)
@Get(':id/comments')
getComments(@Param('id') id: string) {
  return this.blogsService.getComments(id);
}
@Get('/public/feed')
getPublicFeed(
  @Query('page') page = 1,
  @Query('limit') limit = 5,
) {
  return this.blogsService.getPublicFeed(
    Number(page),
    Number(limit),
  );
}
@Get('/public/:slug')
getPublicBlog(@Param('slug') slug: string) {
  return this.blogsService.getPublicBlogBySlug(slug);
}
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Patch(':id')
update(
  @Param('id') id: string,
  @Request() req,
  @Body() body: UpdateBlogDto,
) {
  return this.blogsService.update(
    id,
    req.user.userId,
    body,
  );
}
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Delete(':id/like')
unlike(
  @Param('id') id: string,
  @Request() req,
) {
  return this.blogsService.toggleLike(
    id,
    req.user.userId,
  );
}
@UseGuards(AuthGuard('jwt'))
@Get('me')
getMyBlogs(@Request() req) {
  return this.blogsService.getMyBlogs(req.user.userId);
}
@UseGuards(AuthGuard('jwt'))
@Patch(':blogId/comments/:commentId')
updateComment(
  @Param('blogId') blogId: string,
  @Param('commentId') commentId: string,
  @Request() req,
  @Body() body: { content: string },
) {
  return this.blogsService.updateComment(
    blogId,
    commentId,
    req.user.userId,
    body.content,
  );
}

@UseGuards(AuthGuard('jwt'))
@Delete(':blogId/comments/:commentId')
deleteComment(
  @Param('blogId') blogId: string,
  @Param('commentId') commentId: string,
  @Request() req,
) {
  return this.blogsService.deleteComment(
    blogId,
    commentId,
    req.user.userId,
  );
}
}