import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { messages } from 'src/constants/constants';
import { LoginDto, SignupDto } from 'src/dtos/auth.dto';
import { PrismaService } from 'src/services/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { $Enums } from '@prisma/client';
import { UserService } from 'src/services/users/user.service';

@Injectable()
export class AuthService {
    private readonly jwtAccessSecret?: string;
    private readonly jwtAccessExpires?: string;

    private readonly jwtRefreshSecret?: string;
    private readonly jwtRefreshExpires?: string;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
        this.jwtAccessSecret = this.configService.get('authentication.jwtAccessSecret');
        this.jwtAccessExpires = this.configService.get('authentication.jwtAccessExpires');

        this.jwtRefreshSecret = this.configService.get('authentication.jwtRefreshSecret');
        this.jwtRefreshExpires = this.configService.get('authentication.jwtRefreshExpires');
    }

    async signup(data: SignupDto): Promise<void> {
        const { username, password, firstName, lastName, gender } = data;

        const user = await this.userService.getUserByUsername(username);

        if (user) throw new BadRequestException(messages.AUTHENTICATION.USERNAME_ALREADY_EXISTS);

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prismaService.user.create({
            data: { username, password: hashedPassword, firstName, lastName, gender, role: $Enums.UserRole.USER },
        });
    }

    async login(data: LoginDto) {
        const { username, password } = data;
        const user = await this.prismaService.user.findFirst({
            where: {
                username,
            },
        });

        if (!user) throw new NotFoundException(messages.AUTHENTICATION.USERNAME_PASSWORD_INCORRECT);

        if (!user.isActive) throw new BadRequestException(messages.AUTHENTICATION.USER_NOT_ACTIVE);

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) throw new BadRequestException(messages.AUTHENTICATION.USERNAME_PASSWORD_INCORRECT);

        const { accessToken, refreshToken } = await this.signToken({
            id: user.id,
            role: user.role,
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                role: user.role,
            },
        };
    }

    async signToken(data: { id: string; role: $Enums.UserRole }) {
        if (!this.jwtAccessSecret || !this.jwtAccessExpires) {
            throw new Error('JWT access secret or jwt access expires is not defined!');
        }
        if (!this.jwtRefreshSecret || !this.jwtRefreshExpires) {
            throw new Error('JWT refresh secret or jwt refresh expires is not defined!');
        }
        const accessToken = await this.jwtService.signAsync(data, {
            secret: this.jwtAccessSecret,
            expiresIn: Number(this.jwtAccessExpires) || 3600000, // 1d
        });
        const refreshToken = await this.jwtService.signAsync(data, {
            secret: this.jwtRefreshSecret,
            expiresIn: Number(this.jwtRefreshExpires) || 2592000000, // 30d
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(refreshToken: string) {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.jwtRefreshSecret,
        });

        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.sub,
            },
        });

        if (!user || !user.refreshToken) throw new ForbiddenException(messages.AUTHENTICATION.FORBIDDEN_MESSAGE);

        const refreshTokenMatches = await bcrypt.compareSync(refreshToken, user.refreshToken);

        if (!refreshTokenMatches) throw new ForbiddenException(messages.AUTHENTICATION.FORBIDDEN_MESSAGE);

        const { accessToken } = await this.signToken({
            id: user.id,
            role: user.role,
        });

        return { accessToken };
    }
}
