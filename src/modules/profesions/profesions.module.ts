import { Module } from '@nestjs/common';
import { ProfesionsService } from './profesions.service';
import { ProfesionsController } from './profesions.controller';
import { ProfesionsRepository } from './profesions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesion } from 'src/database/entities/profesion.entity';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/modules/users/users.repository';
import { Credential } from 'src/database/entities/credentials.entity';
import { Experience } from 'src/database/entities/experience.entity';
import { ExperienceService } from '../experience/experience.service';
import { FeedbackService } from '../feedback/feedback.service';
import { Feedback } from 'src/database/entities/feedback.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profesion,
      User,
      Credential,
      Experience,
      Feedback,
    ]),
  ],
  controllers: [ProfesionsController],
  providers: [
    ProfesionsService,
    ProfesionsRepository,
    UserRepository,
    AuthService,
    ExperienceService,
    FeedbackService,
  ],
})
export class ProfesionsModule {}
