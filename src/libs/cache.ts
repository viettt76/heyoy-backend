import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisConnection implements OnModuleInit {
    public redisClient: RedisClientType;
    public redisPub: RedisClientType;
    public redisSub: RedisClientType;

    constructor(private configService: ConfigService) {
        const redisUrl = `redis://:${this.configService.get('redis.password')}@${this.configService.get('redis.host')}:${this.configService.get('redis.port')}`;
        this.redisClient = createClient({ url: redisUrl });
        this.redisPub = createClient({ url: redisUrl });
        this.redisSub = createClient({ url: redisUrl });
    }

    async onModuleInit() {
        await Promise.all([this.redisClient.connect(), this.redisPub.connect(), this.redisSub.connect()]);
    }
}
