import { Controller, Post, Body, UseGuards, Request, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { SummariseService } from './summarise.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNotEmpty, IsUUID } from 'class-validator';

// --- DTO Classes defined in-file ---
export class SummariseNoteDto {
  @IsUUID()
  @IsNotEmpty()
  noteId: string;
}
// --- End DTO Classes ---

@UseGuards(JwtAuthGuard)
@Controller('summarise')
export class SummariseController {
  constructor(private readonly summariseService: SummariseService) {}

  @Post()
  summarise(@Body(ValidationPipe) summariseNoteDto: SummariseNoteDto, @Request() req) {
    const userId = req.user.userId;
    return this.summariseService.summariseNote(summariseNoteDto.noteId, userId);
  }
}
