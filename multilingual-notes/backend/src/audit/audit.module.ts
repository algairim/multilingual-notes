import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditListener } from './audit.listener';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog]), UserModule],
  providers: [AuditListener],
})
export class AuditModule {}
