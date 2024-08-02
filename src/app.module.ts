import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProfesionsModule } from './modules/profesions/profesions.module';
import { PublicationModule } from './modules/publication/publication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ExperienceModule } from './modules/experience/experience.module';
import typeorm from './database/config/typeorm';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EducationModule } from './modules/education/education.module';
import { JwtModule } from '@nestjs/jwt';
import { MorganMiddleware } from './middlewares/morgan.middleware';
import { PaymentsModule } from './modules/payments/payments.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';
import { ChatModule } from './chat/chat.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),

    UsersModule,
    ProfesionsModule,
    PublicationModule,
    FeedbackModule,
    EducationModule,
    AuthModule,
    PaymentsModule,
    ExperienceModule,
    FeedbackModule,
    NotificationsModule,
    PaymentsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '6000m',
      },
    }),
    ChatModule,
    InvitationModule,
    StatisticsModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
