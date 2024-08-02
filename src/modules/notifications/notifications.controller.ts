import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { User } from 'src/database/entities/user.entity';
import { NotificationType } from 'src/enum/notification.enum';
import { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('me')
  async getAllNotifications(@Req() req: Request) {
    return this.notificationsService.getAllNotifications(req);
  }

  @Post()
  async createNotification(
    @Body() notificationData: NotificationType,
    user: User,
  ) {
    return this.notificationsService.postNotification(notificationData, user);
  }
  @Delete(':id')
  async deleteNotification(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
