import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy as JwtStrategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(JwtStrategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwtFromCookie,
            secretOrKey: configService.get('authentication.jwtRefreshSecret')!,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}

function ExtractJwtFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies['refresh_token']) {
        return req.cookies['refresh_token'];
    }
    return null;
}
