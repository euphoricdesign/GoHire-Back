import { PartialType } from '@nestjs/swagger';
import { CreatePublicationDto } from './create-publication.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {
  id: string;

  title?: string;

  location?: string;

  remoteWork?: boolean;

  description?: string;

  category?: string;

  imgUrl?: string;
}
