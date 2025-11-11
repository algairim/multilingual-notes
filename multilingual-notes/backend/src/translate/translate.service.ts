import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteTranslation } from './entities/note-translation.entity';
import { Repository } from 'typeorm';
import { NotesService } from '../notes/notes.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name);
  private readonly mockDictionary = {
    en: {
      hello: 'bonjour (mock)',
      world: 'monde (mock)',
      this: 'ceci (mock)',
      is: 'est (mock)',
      a: 'un (mock)',
      test: 'test (mock)',
    },
    fr: {
      bonjour: 'hello (mock)',
      monde: 'world (mock)',
    },
    // Add other target languages if needed
  };

  constructor(
    @InjectRepository(NoteTranslation)
    private translationRepository: Repository<NoteTranslation>,
    private notesService: NotesService,
    private configService: ConfigService,
    private httpService: HttpService,
    private eventEmitter: EventEmitter2,
  ) {}

  async translateNote(
    noteId: string,
    targetLanguageCode: string,
    userId: string,
  ): Promise<NoteTranslation> {
    // 1. Find note and check ownership
    const note = await this.notesService.findOne(noteId, userId);

    if (note.languageCode === targetLanguageCode) {
      throw new BadRequestException('Target language cannot be the same as source language');
    }

    // 2. Check for existing translation
    const existingTranslation = await this.translationRepository.findOne({
      where: { note: { id: noteId }, targetLanguageCode },
    });
    if (existingTranslation) {
      return existingTranslation; // Return saved translation
    }

    // 3. Get translated text
    const translatedText = await this.getTranslation(
      note.content,
      note.languageCode,
      targetLanguageCode,
    );

    // 4. Save new translation
    const newTranslation = this.translationRepository.create({
      note,
      targetLanguageCode,
      text: translatedText,
    });

    try {
      const savedTranslation = await this.translationRepository.save(newTranslation);

      this.eventEmitter.emit('note.translated', {
        userId,
        noteId,
        meta: { targetLanguage: targetLanguageCode },
      });

      return savedTranslation;
    } catch (error) {
      this.logger.error(`Failed to save translation for note ${noteId}`, error.stack);
      throw new InternalServerErrorException('Could not save translation');
    }
  }

  private async getTranslation(
    text: string,
    source: string,
    target: string,
  ): Promise<string> {
    const apiUrl = this.configService.get<string>('TRANSLATION_API_URL');

    // Use mock translator if no API URL is provided
    if (!apiUrl) {
      return this.mockTranslate(text, source, target);
    }

    // Use external API
    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, {
          q: text,
          source: source,
          target: target,
          format: 'text',
        }),
      );
      return response.data.translatedText;
    } catch (error) {
      this.logger.error('External translation API failed', error.stack);
      // Fallback to mock translator on API failure
      return this.mockTranslate(text, source, target);
    }
  }

  private mockTranslate(text: string, source: string, target: string): string {
    const dictionary = this.mockDictionary[source] || {};
    const words = text.toLowerCase().split(/\s+/);
    const translatedWords = words.map((word) => dictionary[word] || word);
    return translatedWords.join(' ') + ' (mock)';
  }
}
