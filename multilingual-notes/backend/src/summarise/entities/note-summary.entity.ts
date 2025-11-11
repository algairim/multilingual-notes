import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Note } from '../../notes/entities/note.entity';

@Entity()
export class NoteSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  // --- Relations ---

  @OneToOne(() => Note, (note) => note.summary, { onDelete: 'CASCADE' })
  @JoinColumn() // This side holds the foreign key
  note: Note;
}
