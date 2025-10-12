import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { messages } from 'src/constants/constants';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const { roles } = this.reflector.get<{ roles: string[] }>(ROLES_KEY, context.getHandler()) || {};

        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) throw new ForbiddenException(messages.AUTHENTICATION.NOT_AUTHENTICATION);

        if (!roles.includes(user.role)) throw new ForbiddenException(messages.AUTHENTICATION.ACCESS_DENIED);

        return true;
    }
}
