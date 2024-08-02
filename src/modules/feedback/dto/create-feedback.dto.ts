import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { User } from 'src/database/entities/user.entity';

export class PostFeedbackDto {
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;

  user: User;
}
