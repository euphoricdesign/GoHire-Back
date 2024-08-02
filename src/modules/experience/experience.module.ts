import { Module } from '@nestjs/common';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { Experience } from 'src/database/entities/experience.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/modules/users/users.repository';
import { Credential } from 'src/database/entities/credentials.entity';
import { Profesion } from 'src/database/entities/profesion.entity';
import { ProfesionsRepository } from 'src/modules/profesions/profesions.repository';
import { FeedbackService } from '../feedback/feedback.service';
import { Feedback } from 'src/database/entities/feedback.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Experience,
      User,
      Credential,
      Profesion,
      Feedback,
    ]),
  ],
  controllers: [ExperienceController],
  providers: [
    ExperienceService,
    UserRepository,
    AuthService,
    ProfesionsRepository,
    FeedbackService,
  ],
})
export class ExperienceModule {}
