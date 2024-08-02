import { PartialType } from '@nestjs/swagger';
import { CreateProfesionDto } from './create-profesion.dto';
import { Experience } from 'src/database/entities/experience.entity';

export class UpdateProfesionDto extends PartialType(CreateProfesionDto) {
  id: string;
  category?: string;
  rate?: number;
  education?: string;
  experience?: Experience[];
}
