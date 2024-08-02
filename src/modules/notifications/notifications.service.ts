import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/database/entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationType } from 'src/enum/notification.enum';
import { User } from 'src/database/entities/user.entity';
import * as moment from 'moment';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async getAllNotifications(req) {
    const notifications = await this.notificationsRepository.find({
      relations: { user: true },
    });
    notifications.map((notifications) => {
      const date = new Date();
      const timelapsed = moment(date).fromNow();
      notifications.timelapse = timelapsed;
      this.notificationsRepository.save(notifications)
    })
    const filteredNotifications: Notification[] = [];

    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].user.id === req.currentUser.id)
        filteredNotifications.push(notifications[i]);
    }
    return filteredNotifications;
  }

  async postNotification(notificationData: NotificationType, user: User) {
    const notification = new Notification();
    const now = new Date();
    const date = moment();


    
    const timelapsed = moment().startOf('hour').fromNow();  
    const title = this.checkNotificationType(notificationData);

    notification.title = title;
    notification.type = notificationData;
    notification.date = now;
    notification.timelapse = timelapsed;
    notification.user = user;
    await this.notificationsRepository.save(notification);
    return notification;
  }

  async deleteNotification(id: string) {
    await this.notificationsRepository.delete(id);
    return { message: 'Notification has been deleted' };
  }
  private checkNotificationType(notificationType: NotificationType) {
    switch (notificationType) {
      case 'OFFER_JOB':
        return 'New Job Offer!';
      case 'ACEPTED_JOB':
        return 'Your invitation has been Acepted!';
      case 'FINISHED':
        return 'Job Finished!';
      case 'VIEWS_PROFILE':
        return 'Profile Viewed!';
      case 'VIEWS_PUBLICATION':
        return 'Publication Viewed!';
      case 'SEND_APPLY_REQUEST':
        return 'New Apply Request!';
    }
  }
}
