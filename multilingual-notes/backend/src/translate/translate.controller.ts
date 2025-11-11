import { Controller, Post, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

// --- DTO Classes defined in-file ---
const ALLOWED_LANG_CODES = ['en', 'fr', 'de', 'it', 'es'];

export class TranslateNoteDto {
  @IsUUID()
  @IsNotEmpty()
  noteId: string;

  @IsIn(ALLOWED_LANG_CODES)
  @IsNotEmpty()
  targetLanguageCode: string;
}
// --- End DTO Classes ---

@UseGuards(JwtAuthGuard)
@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  translate(@Body(ValidationPipe) translateNoteDto: TranslateNoteDto, @Request() req) {
    const userId = req.user.userId;
    return this.translateService.translateNote(
      translateNoteDto.noteId,
      translateNoteDto.targetLanguageCode,
      userId,
    );
  }
}
