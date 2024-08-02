import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric' })
  value: number;

  @Column({ type: 'varchar', nullable: true })
  datePayment: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;
}
