import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'memberships' })
export class Membership {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  premiunMember: boolean;

  @Column({ type: 'varchar', nullable: true })
  startDate: string;

  @Column({ type: 'varchar', nullable: true })
  endDate: string;

  @OneToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_ID' })
  users: User[];
}
