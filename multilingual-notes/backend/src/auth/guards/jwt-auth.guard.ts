import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard automatically uses the JwtStrategy we defined in auth.module.ts
 * because it's registered with the name 'jwt' by default.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
