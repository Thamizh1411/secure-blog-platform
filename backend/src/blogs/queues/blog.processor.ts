import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('blog-summary')
export class BlogProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any>) {
    const { blogId, content } = job.data;

    const summary = content.slice(0, 120) + "...";

    await this.prisma.blog.update({
      where: { id: blogId },
      data: {
        summary,
      },
    });

    console.log(`Summary generated for blog ${blogId}`);
  }
}  