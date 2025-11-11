import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, ValidationPipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNotEmpty, IsOptional, IsString, IsIn, MaxLength } from 'class-validator';

// --- DTO Classes defined in-file ---
const ALLOWED_LANG_CODES = ['en', 'fr', 'de', 'it', 'es'];

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsIn(ALLOWED_LANG_CODES)
  @IsNotEmpty()
  languageCode: string;
}

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsIn(ALLOWED_LANG_CODES)
  @IsOptional()
  languageCode?: string;
}

export class NotesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(ALLOWED_LANG_CODES)
  language?: string;

  // We'll keep pagination simple
  // In a real app, use @Type(() => Number) and more validation
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
// --- End DTO Classes ---

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body(ValidationPipe) createNoteDto: CreateNoteDto, @Request() req) {
    const userId = req.user.userId;
    return this.notesService.create(createNoteDto, userId);
  }

  @Get()
  findAll(@Query(ValidationPipe) query: NotesQueryDto, @Request() req) {
    const userId = req.user.userId;
    return this.notesService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user.userId;
    return this.notesService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.notesService.update(id, updateNoteDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user.userId;
    return this.notesService.remove(id, userId);
  }
}
