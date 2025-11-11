import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // e.g., 'note.created', 'note.deleted'

  @Column({ nullable: true })
  noteId?: string;

  @Column('jsonb', { nullable: true })
  meta?: any; // e.g., { title: 'Old Title' }

  @CreateDateColumn()
  createdAt: Date;

  // --- Relations ---

  @ManyToOne(() => User, { eager: false, onDelete: 'SET NULL', nullable: true })
  user: User;
}
