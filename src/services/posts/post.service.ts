import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) {}

    async getPosts(userId: string): Promise<Post[]> {
        return this.prismaService.post.findMany();
    }
}
