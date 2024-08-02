import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { User } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicaction } from 'src/database/entities/publication.entity';
import { Payment } from 'src/database/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Publicaction, Payment])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
