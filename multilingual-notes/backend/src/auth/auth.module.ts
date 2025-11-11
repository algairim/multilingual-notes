import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

/**
 * This is the new AuthModule for Keycloak.
 * It no longer provides AuthService or AuthController.
 * Its only job is to provide the JwtStrategy that validates
 * tokens from Keycloak.
 */
@Module({
  imports: [
    // Register passport with 'jwt' as the default
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Import UserModule to allow JwtStrategy to inject the UserRepository
    UserModule,

    // Import ConfigModule so JwtStrategy can read KEYCLOAK_AUTH_URL
    ConfigModule,
  ],
  // Provide the new Keycloak strategy. This is what JwtAuthGuard will use.
  providers: [JwtStrategy],

  // Export PassportModule so other modules (like NotesModule) can use JwtAuthGuard
  exports: [PassportModule],
})
export class AuthModule {}