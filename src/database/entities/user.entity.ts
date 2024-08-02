import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  // ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Publicaction } from './publication.entity';
import { Profesion } from './profesion.entity';
import { Credential } from './credentials.entity';
import { Notification } from './notification.entity';
import { Education } from './education.entity';
import { Experience } from './experience.entity';
import { Role } from 'src/enum/role.enum';
import { Feedback } from './feedback.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lastName: string;

  @Column({ type: 'int', unique: true, nullable: true })
  dni: number;

  @Column({ type: 'int', nullable: true })
  dni2: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  birthdate: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email_verified: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imgPictureUrl: string;

  @Column({ default: false })
  availableToWork: string;

  @Column({ type: 'simple-array', nullable: true, default: 10 })
  professionalRate: number[];

  @Column({ type: 'boolean', nullable: true, default: true })
  newMember: boolean;

  @CreateDateColumn({ type: 'date' })
  datecreateUser: Date;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role[];

  @Column({ type: 'int', nullable: true, default: 0 })
  strikes: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  isBlocked: boolean;

  @OneToOne(() => Credential)
  @JoinColumn({ name: 'credentials_ID' })
  credential: Credential;

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Publicaction, (publicaction) => publicaction.user)
  publicactions: Publicaction[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @JoinColumn({ name: 'notification_ID' })
  notifications: Notification[];

  @OneToMany(() => Profesion, (profesion) => profesion.user)
  @JoinColumn({ name: 'profesion_ID' })
  profesions: Profesion[];

  @OneToMany(() => Education, (education) => education.user)
  educations: Education[];

  @OneToMany(() => Experience, (experice) => experice.client)
  experiences: Experience[];

  @ManyToOne(() => Publicaction, (Publicaction) => Publicaction.usersList)
  publication: Publicaction;
}
