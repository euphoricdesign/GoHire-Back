import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { JobState } from 'src/enum/job-state.enum';

export class UpdateInvitationDto {
  @IsString()
  @MinLength(200)
  @MaxLength(2000)
  @IsOptional()
  jobDescription: string;

  @IsNumber()
  @IsOptional()
  payPerHour: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  issue: string;

  @IsString()
  @MaxLength(15)
  @IsOptional()
  location: string;

  @IsBoolean()
  @IsOptional()
  isRemote: boolean;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  startDate: string;

  @IsEnum(JobState)
  @IsOptional()
  jobState: JobState;
}
