import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/database/entities/user.entity';
import { EducationState } from 'src/enum/education.enum';

export class PostEducationDto {
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  @IsNotEmpty()
  educationalEntity: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  description: string;

  @IsEnum(EducationState)
  studiesState: EducationState;

  @IsString()
  @MinLength(9)
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @MinLength(9)
  @IsNotEmpty()
  endDate: string;

  user: User;
}
