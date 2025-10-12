import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/services/database/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUserByUsername(username: string): Promise<User | null> {
        return await this.prismaService.user.findFirst({
            where: {
                username,
            },
        });
    }

    async getUserInfo(userId: string): Promise<Partial<User> | null> {
        return await this.prismaService.user.findFirst({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                birthday: true,
                gender: true,
                hometown: true,
                school: true,
                avatar: true,
                role: true,
                isPrivate: true,
                isActive: true,
            },
            where: {
                id: userId,
            },
        });
    }
}
