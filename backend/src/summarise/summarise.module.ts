import { Module } from '@nestjs/common';
import { SummariseService } from './summarise.service';
import { SummariseController } from './summarise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteSummary } from './entities/note-summary.entity';
import { AuthModule } from '../auth/auth.module';
import { NotesModule } from '../notes/notes.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteSummary]),
    AuthModule,
    NotesModule, // To use NotesService
    HttpModule, // For external API calls (if used)
  ],
  controllers: [SummariseController],
  providers: [SummariseService],
})
export class SummariseModule {}
