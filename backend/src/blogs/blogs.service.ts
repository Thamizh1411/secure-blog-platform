import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlogQueue } from './queues/blog.queue';

@Injectable()
export class BlogsService {
  private logger = new Logger(BlogsService.name);

  constructor(
    private prisma: PrismaService,
    private blogQueue: BlogQueue,
  ) {}

  async create(userId: string, title: string, content: string) {
    this.logger.log(`Creating blog for user ${userId}`);

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const uniqueSuffix = Date.now();

    const slug = `${baseSlug}-${uniqueSuffix}`;

    return this.prisma.blog.create({
      data: {
        title,
        content,
        slug,
        userId,
      },
    });
  }

  async findAll() {
    this.logger.log('Fetching all blogs');

    return this.prisma.blog.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(blogId: string, userId: string) {
    this.logger.log(`Deleting blog ${blogId}`);

    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      this.logger.warn(`Blog not found: ${blogId}`);
      throw new NotFoundException('Blog not found');
    }

    if (blog.userId !== userId) {
      this.logger.warn(`Unauthorized delete attempt by user ${userId}`);
      throw new ForbiddenException(
        'You are not allowed to delete this blog',
      );
    }

    await this.prisma.like.deleteMany({
      where: { blogId },
    });

    await this.prisma.comment.deleteMany({
      where: { blogId },
    });

    await this.prisma.blog.delete({
      where: { id: blogId },
    });

    this.logger.log(`Blog ${blogId} deleted`);

    return { message: 'Blog deleted successfully' };
  }

  async addComment(blogId: string, userId: string, content: string) {
    this.logger.log(`Adding comment to blog ${blogId}`);

    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.prisma.comment.create({
      data: {
        blogId,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async getComments(blogId: string) {
    this.logger.log(`Fetching comments for blog ${blogId}`);

    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async getPublicFeed(page = 1, limit = 5) {
    this.logger.log(`Fetching public feed page ${page}`);

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      this.prisma.blog.findMany({
        where: { isPublished: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      this.prisma.blog.count({
        where: { isPublished: true },
      }),
    ]);

    return {
      data: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        summary: blog.summary,
        createdAt: blog.createdAt,
        author: blog.user,
        totalLikes: blog._count.likes,
        totalComments: blog._count.comments,
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPublicBlogBySlug(slug: string) {
    this.logger.log(`Fetching blog by slug ${slug}`);

    const blog = await this.prisma.blog.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        user: {
          select: { id: true, email: true },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, email: true },
            },
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      summary: blog.summary,
      createdAt: blog.createdAt,
      author: blog.user,
      totalLikes: blog._count.likes,
      comments: blog.comments,
    };
  }

  async update(blogId: string, userId: string, data: any) {
    this.logger.log(`Updating blog ${blogId}`);

    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to edit this blog',
      );
    }

    const updatedData: any = { ...data };

    if (data.title) {
      const baseSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      const uniqueSuffix = Date.now();

      updatedData.slug = `${baseSlug}-${uniqueSuffix}`;
    }

    const updatedBlog = await this.prisma.blog.update({
      where: { id: blogId },
      data: updatedData,
    });

    // ⭐ Async queue job
    if (data.isPublished === true) {
      await this.blogQueue.generateSummary(
        blogId,
        updatedBlog.content,
      );
    }

    return updatedBlog;
  }

  async toggleLike(blogId: string, userId: string) {
    this.logger.log(`Toggling like for blog ${blogId}`);

    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });
    } else {
      await this.prisma.like.create({
        data: {
          userId,
          blogId,
        },
      });
    }

    const totalLikes = await this.prisma.like.count({
      where: { blogId },
    });

    return {
      message: existingLike ? 'Blog unliked' : 'Blog liked',
      totalLikes,
    };
  }

  async getMyBlogs(userId: string) {
    this.logger.log(`Fetching blogs for user ${userId}`);

    return this.prisma.blog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateComment(blogId: string, commentId: string, userId: string, content: string) {
    this.logger.log(`Updating comment ${commentId}`);

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to edit this comment',
      );
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async deleteComment(blogId: string, commentId: string, userId: string) {
    this.logger.log(`Deleting comment ${commentId}`);

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }
}