import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EducationState } from 'src/enum/education.enum';

export class UpdateEducationDto {
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  @IsOptional()
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  @IsOptional()
  educationalEntity: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  description: string;

  @IsEnum(EducationState)
  @IsOptional()
  studiesState: EducationState;

  @IsString()
  @MinLength(9)
  @IsOptional()
  startDate: string;

  @IsString()
  @MinLength(9)
  @IsOptional()
  endDate: string;
}
