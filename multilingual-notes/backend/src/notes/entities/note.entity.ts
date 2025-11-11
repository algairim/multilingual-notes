import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { NoteSummary } from '../../summarise/entities/note-summary.entity';
import { NoteTranslation } from '../../translate/entities/note-translation.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  languageCode: string; // e.g., 'en', 'fr'

  @CreateDateColumn()
  createdAt: Date;

  // --- Relations ---

  @ManyToOne(() => User, (user) => user.notes, { eager: false })
  user: User;

  @OneToOne(() => NoteSummary, (summary) => summary.note, { cascade: true, nullable: true })
  summary: NoteSummary;

  @OneToMany(() => NoteTranslation, (translation) => translation.note, { cascade: true })
  translations: NoteTranslation[];
}
