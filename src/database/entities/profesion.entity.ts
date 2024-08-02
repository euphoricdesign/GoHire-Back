import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Experience } from './experience.entity';
import { User } from './user.entity';
import { Publicaction } from './publication.entity';

@Entity({ name: 'profesions' })
export class Profesion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  available: string;

  @OneToMany(() => Experience, (experience) => experience.profesion)
  experiences: Experience[];

  @ManyToOne(() => User, (user) => user.profesions)
  @JoinColumn({ name: 'user_ID' })
  user: User;

  @OneToMany(() => Publicaction, (publicaction) => publicaction.profesion)
  publicactions: Publicaction[];
}
