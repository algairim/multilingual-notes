import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from './jwt.strategy';

/**
 * Custom decorator `@CurrentUser()` to easily extract the user object
 * from the request, which was attached by the `JwtAuthGuard` -> `JwtStrategy`.
 *
 * Example Usage in a controller:
 * @Get('me')
 * getMe(@CurrentUser() user: AuthUser) {
 * return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
