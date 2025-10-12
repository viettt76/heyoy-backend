import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { LoginDto, SignupDto } from 'src/dtos/auth.dto';
import { AuthService } from 'src/services/auth/auth.service';
import { apiHelper } from 'src/utils/api-helper';

@Controller('/auth')
export class AuthController {
    private readonly jwtRefreshExpires: number;

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        this.jwtRefreshExpires = this.configService.get('authentication.jwtRefreshExpires')!;
    }

    @Post('/signup')
    async signup(@Body() data: SignupDto) {
        return apiHelper({
            action: () => this.authService.signup(data),
        });
    }

    @Post('/login')
    async login(@Body() data: LoginDto, @Res() response: any) {
        const result = await this.authService.login(data);
        response.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: Number(this.jwtRefreshExpires) || 2592000000,
        });
        return response.json({
            accessToken: result.accessToken,
            user: result.user,
        });
    }

    @Post('/refresh')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async refreshToken(@Req() req: any) {
        return apiHelper({
            action: () => this.authService.refreshToken(req.cookies['refresh_token']),
        });
    }
}
