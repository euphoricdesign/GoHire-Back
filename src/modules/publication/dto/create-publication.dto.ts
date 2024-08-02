import { IsNotEmpty } from 'class-validator';

export class CreatePublicationDto {
  title?: string;

  description?: string;

  @IsNotEmpty()
  category: string;

  location?: string;

  remoteWork?: boolean;

  file?: string;

  user: string;
}
