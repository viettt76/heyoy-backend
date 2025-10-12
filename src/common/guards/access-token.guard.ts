import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard(['jwt']) {
    handleRequest<TUser = any>(err: any, user: any): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

    // getRequest(context: ExecutionContext) {
    //     const request = context.switchToHttp().getRequest();

    //     const token = request.cookies?.access_token;

    //     if (token) {
    //         request.headers.authorization = `Bearer ${token}`;
    //     }

    //     return request;
    // }
}
