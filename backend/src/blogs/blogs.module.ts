import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { BullModule } from '@nestjs/bullmq';
import { BlogQueue } from './queues/blog.queue';
import { BlogProcessor } from './queues/blog.processor';

@Module({
  imports: [
    PrismaModule,

    // ✅ Register blog queue
    BullModule.registerQueue({
      name: 'blog-summary',
    }),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogQueue,
    BlogProcessor,
  ],
})
export class BlogsModule {}