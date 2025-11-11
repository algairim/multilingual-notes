import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateNoteDto, UpdateNoteDto, NotesQueryDto } from './notes.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      user: { id: userId },
    });
    const savedNote = await this.notesRepository.save(note);

    this.eventEmitter.emit('note.created', {
      userId,
      noteId: savedNote.id,
      meta: { title: savedNote.title },
    });

    return savedNote;
  }

  async findAll(userId: string, query: NotesQueryDto) {
    const { page = 1, limit = 10, search, language } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Note> = { user: { id: userId } };

    if (search) {
      where.title = ILike(`%${search}%`); // Case-insensitive search
    }
    if (language) {
      where.languageCode = language;
    }

    const [data, total] = await this.notesRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['summary', 'translations'], // Load related entities
    });

    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found or you don't have access.`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    // findOne checks for ownership and throws NotFoundException if not found
    const note = await this.findOne(id, userId);

    // Merge new data into the found note
    Object.assign(note, updateNoteDto);

    const updatedNote = await this.notesRepository.save(note);

    this.eventEmitter.emit('note.updated', {
      userId,
      noteId: updatedNote.id,
      meta: { changes: Object.keys(updateNoteDto) },
    });

    return updatedNote;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    // findOne checks for ownership
    const note = await this.findOne(id, userId);
    await this.notesRepository.remove(note);

    this.eventEmitter.emit('note.deleted', {
      userId,
      noteId: id,
      meta: { title: note.title },
    });

    return { message: 'Note deleted successfully' };
  }
}
