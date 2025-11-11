import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

/**
 * This module is responsible for managing the User entity.
 * It imports TypeOrmModule.forFeature([User]) and exports it,
 * allowing any other module that imports UserModule to inject
 * the UserRepository.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [],
  exports: [TypeOrmModule], // Export this so AuthModule can use Repository<User>
})
export class UserModule {}
