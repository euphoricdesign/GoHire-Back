import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { NotificationType } from 'src/enum/notification.enum';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'varchar', nullable: true })
  timelapse: string;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_ID' })
  user: User;
}
