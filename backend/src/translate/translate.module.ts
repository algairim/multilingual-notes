import { Module } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateController } from './translate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteTranslation } from './entities/note-translation.entity';
import { AuthModule } from '../auth/auth.module';
import { NotesModule } from '../notes/notes.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteTranslation]),
    AuthModule,
    NotesModule, // To use NotesService
    HttpModule,
    ConfigModule, // To get TRANSLATION_API_URL
  ],
  controllers: [TranslateController],
  providers: [TranslateService],
})
export class TranslateModule {}
