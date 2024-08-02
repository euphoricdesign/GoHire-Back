import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'feedbacks' })
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'integer', nullable: false })
  rate: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isOfensive: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  blocked: boolean;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'user_ID' })
  user: User;
}
