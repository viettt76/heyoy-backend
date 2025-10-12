import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    constructor(private readonly configService: ConfigService) {
        // createClient();
    }

    getActiveSession(userId: string) {
        return;
    }
}
