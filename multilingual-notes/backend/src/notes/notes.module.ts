import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), AuthModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService], // Export for Summarise/Translate services
})
export class NotesModule {}
