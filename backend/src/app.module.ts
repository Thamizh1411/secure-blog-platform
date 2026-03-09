import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bullmq';

import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),

    // // ✅ Redis Queue Configuration
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),

    AuthModule,
    BlogsModule,
    PrismaModule,
  ],
})
export class AppModule {}