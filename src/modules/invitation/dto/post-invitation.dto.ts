import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/database/entities/user.entity';

export class PostInvitationDto {
  @IsString()
  @MinLength(200)
  @MaxLength(2000)
  @IsNotEmpty()
  jobDescription: string;

  @IsNumber()
  @IsNotEmpty()
  payPerHour: number;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  issue: string;

  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  location: string;

  @IsBoolean()
  @IsOptional()
  isRemote: boolean;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  startDate: string;

  invitationOwner: User;

  employee: User;
}
