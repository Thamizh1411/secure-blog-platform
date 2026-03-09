import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {

  // 👇 THIS IS WHERE YOU WRITE IT
  constructor(
  private prisma: PrismaService,
  private jwtService: JwtService,
) {}

  async register(email: string, password: string) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hash,
      },
    });

    return {
      id: user.id,
      email: user.email,
    };
  }
  async login(email: string, password: string) {
  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = {
    sub: user.id,
    email: user.email,
  };

  const token = await this.jwtService.signAsync(payload);

  return {
    access_token: token,
  };
}
}