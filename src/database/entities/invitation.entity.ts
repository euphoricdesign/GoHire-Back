import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { JobState } from 'src/enum/job-state.enum';

@Entity({ name: 'invitations' })
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 2000, nullable: false })
  jobDescription: string;

  @Column({ type: 'float', nullable: false })
  payPerHour: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  issue: string;

  @Column({ type: 'varchar', nullable: false, length: 15 })
  location: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isRemote: boolean;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  startDate: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: JobState,
    default: JobState.PENDING,
  })
  jobState: JobState;

  @ManyToMany(() => User)
  @JoinTable({ name: 'invitationID__employeeID' })
  invitationOwner: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'employee_ID_invitationID' })
  employee: User[];
}
