import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Profesion } from './profesion.entity';

@Entity({ name: 'publications' })
export class Publicaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  location: string;

  @Column({ type: 'boolean', nullable: true })
  remoteWork: boolean;

  @Column({ type: 'varchar', length: 1500, nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  imgUrl: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  date: Date | string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  timelapse: string;

  @Column({ nullable: true, default: false })
  premium: boolean;

  @Column({ type: 'varchar', length: 40, nullable: true })
  endDate: Date | string;

  @ManyToOne(() => Profesion, (profesion) => profesion)
  @JoinColumn({ name: 'profesion_ID' })
  profesion: Profesion;

  @ManyToOne(() => User, (user) => user.publicactions)
  @JoinColumn({ name: 'user_ID' })
  user: User;

  @OneToMany(() => User, (user) => user.publication)
  @JoinColumn({ name: 'usersList' })
  usersList: User[];
}
