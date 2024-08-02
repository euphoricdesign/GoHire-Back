import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: string;

  name?: string;
  lastname?: string;
  dni2?: number;
  country?: string;
  city?: string;
  birthdate?: string;
  availability?: boolean;
  bio?: string;
  imgPictureUrl?: string;
  availableToWork?: string;
  newMember?: boolean;
}
