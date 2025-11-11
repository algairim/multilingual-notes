import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Note } from '../../notes/entities/note.entity';

@Entity()
export class NoteTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  targetLanguageCode: string; // e.g., 'fr', 'de'

  @Column('text')
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  // --- Relations ---

  @ManyToOne(() => Note, (note) => note.translations, { onDelete: 'CASCADE' })
  note: Note;
}
