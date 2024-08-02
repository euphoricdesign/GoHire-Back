import { Experience } from 'src/database/entities/experience.entity';

export class CreateProfesionDto {
  category: string;
  education?: string;
  experience?: Experience[];
}
