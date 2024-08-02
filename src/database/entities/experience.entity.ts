import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profesion } from './profesion.entity';
import { User } from './user.entity';
import { Feedback } from './feedback.entity';

@Entity({ name: 'experiences' })
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    default:
      'https://www.netambulo.com/storage/2011/12/404-not-found-gatito.jpg',
    nullable: true,
  })
  imgUrl: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 2000, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  startDate: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  endDate: string;

  @ManyToOne(() => Profesion, (profesion) => profesion.experiences)
  @JoinColumn({ name: 'profesion_ID' })
  profesion: Profesion;

  @ManyToOne(() => User, (user) => user.experiences)
  @JoinColumn({ name: 'user_ID' })
  user: User;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'client_ID' })
  client: User;

  @OneToOne(() => Feedback)
  @JoinColumn({ name: 'feedback_ID' })
  feedback: Feedback;
}
