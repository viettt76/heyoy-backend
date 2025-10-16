import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SessionGuard } from 'src/common/guards/session.guard';
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
            data: {
                accessToken: result.accessToken,
                user: result.user,
            },
        });
    }

    @Post('/logout')
    @UseGuards(AccessTokenGuard, RolesGuard, SessionGuard)
    async logout(@Req() req: any, @Res() res: any) {
        await this.authService.logout(req.user.id);
        return res.clearCookie('refresh_token').json();
    }

    @Post('/refresh')
    @UseGuards(RefreshTokenGuard, RolesGuard, SessionGuard)
    async refreshToken(@Req() req: any) {
        return apiHelper({
            action: () => this.authService.refreshToken(req.cookies['refresh_token']),
        });
    }
}
