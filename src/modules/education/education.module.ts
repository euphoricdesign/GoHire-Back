import { Module } from '@nestjs/common';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from 'src/database/entities/education.entity';
import { UserRepository } from '../users/users.repository';
import { User } from 'src/database/entities/user.entity';
import { Credential } from 'src/database/entities/credentials.entity';
import { Experience } from 'src/database/entities/experience.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Education, User, Credential, Experience]),
  ],
  controllers: [EducationController],
  providers: [EducationService, UserRepository, AuthService],
})
export class EducationModule {}
