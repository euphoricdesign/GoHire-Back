import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('statistics')
// @Roles(Role.ADMIN)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('days')
  foundUsersByDays() {
    return this.statisticsService.foundUsersByDays();
  }
  @Get('week')
  foundUserWeek() {
    return this.statisticsService.foundUserWeek();
  }
  @Get('month')
  foundUsersByMonth() {
    return this.statisticsService.foundUsersByMonth();
  }

  @Get('publication/days')
  foundPublicationByDays() {
    return this.statisticsService.foundPublicationByDays();
  }
  @Get('publication/week')
  foundPublicationWeek() {
    return this.statisticsService.foundPublicationWeek();
  }
  @Get('publication/month')
  foundPublicationByMonth() {
    return this.statisticsService.foundPublicationByMonth();
  }

  @Get('payment/month')
  foundPaymentByMonth() {
    return this.statisticsService.foundPaymentByMonth();
  }
}
