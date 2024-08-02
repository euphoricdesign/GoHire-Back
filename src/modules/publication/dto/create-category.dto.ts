import { IsNotEmpty, IsString } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  category: string;
}
