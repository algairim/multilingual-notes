import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Repository } from 'typeorm';

// Define event payload structures
interface NoteEventPayload {
  userId: string;
  noteId: string;
  meta?: any;
}

@Injectable()
export class AuditListener {
  private readonly logger = new Logger(AuditListener.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  private async handleAuditEvent(
    userId: string,
    action: string,
    noteId?: string,
    meta?: any,
  ) {
    try {
      const logEntry = this.auditLogRepository.create({
        action,
        noteId,
        meta,
        user: { id: userId },
      });
      await this.auditLogRepository.save(logEntry);
    } catch (error) {
      this.logger.error(`Failed to save audit log for action: ${action}`, error.stack);
    }
  }

  @OnEvent('note.created')
  handleNoteCreated(payload: NoteEventPayload) {
    this.handleAuditEvent(payload.userId, 'note.created', payload.noteId, payload.meta);
  }

  @OnEvent('note.updated')
  handleNoteUpdated(payload: NoteEventPayload) {
    this.handleAuditEvent(payload.userId, 'note.updated', payload.noteId, payload.meta);
  }

  @OnEvent('note.deleted')
  handleNoteDeleted(payload: NoteEventPayload) {
    this.handleAuditEvent(payload.userId, 'note.deleted', payload.noteId, payload.meta);
  }

  @OnEvent('note.summarised')
  handleNoteSummarised(payload: NoteEventPayload) {
    this.handleAuditEvent(payload.userId, 'note.summarised', payload.noteId);
  }

  @OnEvent('note.translated')
  handleNoteTranslated(payload: NoteEventPayload) {
    this.handleAuditEvent(payload.userId, 'note.translated', payload.noteId, payload.meta);
  }
}
