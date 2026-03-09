import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class BlogQueue {
  constructor(
    @InjectQueue('blog-summary')
    private blogQueue: Queue,
  ) {}

  async generateSummary(blogId: string, content: string) {
    await this.blogQueue.add('generate-summary', {
      blogId,
      content,
    });
  }
}