import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string; // Hashed password

  @CreateDateColumn()
  createdAt: Date;

  // --- Relations ---

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
