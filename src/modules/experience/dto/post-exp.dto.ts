import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Profesion } from 'src/database/entities/profesion.entity';

export class PostExperienceDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @IsOptional()
  company: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @IsNotEmpty()
  description: string;

  @IsString()
  @MinLength(9)
  @IsOptional()
  startDate: string;

  @IsString()
  @MinLength(9)
  @IsOptional()
  endDate: string;

  @IsString()
  @IsOptional()
  imgUrl: string;

  profesion: Profesion;

  clientID: string;
}
