import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteSummary } from './entities/note-summary.entity';
import { Repository } from 'typeorm';
import { NotesService } from '../notes/notes.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { HttpService } from '@nestjs/axios'; // Uncomment to use external API

@Injectable()
export class SummariseService {
  private readonly logger = new Logger(SummariseService.name);

  constructor(
    @InjectRepository(NoteSummary)
    private summaryRepository: Repository<NoteSummary>,
    private notesService: NotesService,
    private eventEmitter: EventEmitter2,
    // private httpService: HttpService, // Uncomment to use external API
  ) {}

  async summariseNote(noteId: string, userId: string): Promise<NoteSummary> {
    // 1. Find the note and check ownership
    const note = await this.notesService.findOne(noteId, userId);

    // 2. Generate summary
    // As per PDF, we implement the simple local summariser
    const summaryText = this.generateLocalSummary(note.content);

    // 3. Save the summary
    // Check if a summary already exists
    let summary = await this.summaryRepository.findOne({ where: { note: { id: noteId } } });

    if (summary) {
      // Update existing summary
      summary.summary = summaryText;
      summary.createdAt = new Date(); // Update timestamp
    } else {
      // Create new summary
      summary = this.summaryRepository.create({
        summary: summaryText,
        note: note,
      });
    }

    try {
      const savedSummary = await this.summaryRepository.save(summary);

      this.eventEmitter.emit('note.summarised', {
        userId,
        noteId,
      });

      return savedSummary;
    } catch (error) {
      this.logger.error(`Failed to save summary for note ${noteId}`, error.stack);
      throw new InternalServerErrorException('Could not save summary');
    }
  }

  /**
   * Local summariser: takes the first sentence.
   */
  private generateLocalSummary(content: string): string {
    if (!content) return '';
    const sentences = content.split(/[.!?]/);
    if (sentences.length > 0 && sentences[0].trim()) {
      return sentences[0].trim() + '.';
    }
    // Fallback: take first 100 chars
    return content.substring(0, 100) + (content.length > 100 ? '...' : '');
  }
}
