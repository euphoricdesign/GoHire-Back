import { EducationState } from 'src/enum/education.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'educations' })
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  educationalEntity: string;

  @Column({ type: 'varchar', nullable: true, length: 300 })
  description: string;

  @Column({
    type: 'enum',
    enum: EducationState,
    default: EducationState.FINISHED,
  })
  studiesState: EducationState | string;

  @Column({ type: 'varchar', length: 50 })
  startDate: string;

  @Column({ type: 'varchar', length: 50 })
  endDate: string;

  @ManyToOne(() => User, (user) => user.educations)
  @JoinColumn({ name: 'user_ID' })
  user: User;
}
