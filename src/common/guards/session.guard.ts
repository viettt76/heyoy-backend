import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RedisService } from 'src/libs/cache';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private redisService: RedisService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return false;

        if (request.headers['x-api-key']) {
            return true;
        }

        const activeSession = await this.redisService.getActiveSession(user.sub);
        return activeSession === user.sessionId;
    }
}
