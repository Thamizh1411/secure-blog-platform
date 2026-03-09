import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Nice blog!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}