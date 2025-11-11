import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { SummariseModule } from './summarise/summarise.module';
import { TranslateModule } from './translate/translate.module';
import { AuditModule } from './audit/audit.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Note } from './notes/entities/note.entity';
import { NoteSummary } from './summarise/entities/note-summary.entity';
import { NoteTranslation } from './translate/entities/note-translation.entity';
import { AuditLog } from './audit/entities/audit-log.entity';

@Module({
  imports: [
    // --- Global Modules ---
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Note, NoteSummary, NoteTranslation, AuditLog],
        synchronize: true, // Auto-create DB tables (dev only)
        logging: false,
      }),
    }),
    // --- Feature Modules ---
    AuthModule,
    UserModule,
    NotesModule,
    SummariseModule,
    TranslateModule,
    AuditModule,
  ],
})
export class AppModule {}
