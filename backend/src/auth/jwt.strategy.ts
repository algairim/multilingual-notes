import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

/**
 * This interface defines the expected payload from the Keycloak JWT.
 * 'sub' is the unique User ID from Keycloak.
 */
interface KeycloakPayload {
  sub: string;
  email: string;
  // Add other fields from the token you might need, e.g., preferred_username
}

/**
 * This interface defines the user object that will be attached
 * to the `req.user` object in our controllers.
 */
export interface AuthUser {
  userId: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    const keycloakAuthUrl = configService.get<string>('KEYCLOAK_AUTH_URL');

    super({
      // 1. How to get the token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. How to get the public key to verify the token
      // This dynamically fetches the public keys from Keycloak's JWKS endpoint
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${keycloakAuthUrl}/protocol/openid-connect/certs`,
      }),

      // 3. Which algorithms to trust
      algorithms: ['RS256'],

      // 4. Who the token issuer should be
      issuer: keycloakAuthUrl,
    });
  }

  /**
   * This method is called by passport-jwt after it successfully validates
   * the token's signature and claims (like 'iss' and 'exp').
   * The `payload` is the decoded JSON from the JWT.
   */
  async validate(payload: KeycloakPayload): Promise<AuthUser> {
    if (!payload.sub || !payload.email) {
      this.logger.warn('Invalid JWT payload received');
      throw new UnauthorizedException('Invalid token payload');
    }

    try {
      // Find the user in our local DB by their Keycloak ID ('sub')
      let user = await this.usersRepository.findOneBy({ id: payload.sub });

      // If the user doesn't exist, create them "just-in-time"
      if (!user) {
        this.logger.log(`Provisioning new user: ${payload.email}`);
        user = this.usersRepository.create({
          id: payload.sub, // Use Keycloak's ID as our primary key
          email: payload.email,
        });
        await this.usersRepository.save(user);
      }

      // This object will be attached to `req.user`
      return {
        userId: user.id,
        email: user.email,
      };
    } catch (error) {
      this.logger.error('Error during user validation/provisioning', error);
      throw new UnauthorizedException('Could not process user');
    }
  }
}
