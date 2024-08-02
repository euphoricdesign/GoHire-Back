import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Credential } from 'src/database/entities/credentials.entity';
import { ExperienceService } from '../experience/experience.service';
import { Experience } from 'src/database/entities/experience.entity';
import { ProfesionsRepository } from '../profesions/profesions.repository';
import { Profesion } from 'src/database/entities/profesion.entity';
import { FeedbackService } from '../feedback/feedback.service';
import { Feedback } from 'src/database/entities/feedback.entity';
import { JwtService } from '@nestjs/jwt';
import { PopulateUserMiddleware } from 'src/middlewares/populateUser.middleware';
import { AuthService } from '../auth/auth.service';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Credential,
      Experience,
      Profesion,
      Feedback,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    AuthService,
    ExperienceService,
    ProfesionsRepository,
    FeedbackService,
    StatisticsModule,
    JwtService,
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PopulateUserMiddleware).forRoutes('*');
  }
}
