// gateway/app.gateway.ts
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, Socket } from 'socket.io';
import { RedisConnection } from 'src/libs/cache';

@WebSocketGateway({
    cors: { origin: process.env.FRONTEND_URL },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(AppGateway.name);

    constructor(
        private readonly redisConnection: RedisConnection,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async afterInit() {
        const pubClient = this.redisConnection.redisPub;
        const subClient = this.redisConnection.redisSub;
        this.server.adapter(createAdapter(pubClient, subClient));
        this.logger.log('✅ Redis adapter connected for Socket.IO');
    }

    async handleConnection(socket: Socket) {
        const accessToken = socket.handshake.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            this.handleDisconnect(socket);
            return;
        }

        try {
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: this.configService.get('authentication.jwtAccessSecret'),
            });

            const userId = payload.id;

            socket.join(`user:${userId}`);
        } catch (error) {
            this.logger.error(`❌ Invalid token for socket ${socket.id}: ${error.message}`);
            socket.disconnect();
            return;
        }
    }

    async handleDisconnect(socket: Socket) {
        const accessToken = socket.handshake.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            socket.disconnect();
            return;
        }

        try {
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: this.configService.get('authentication.jwtAccessSecret'),
            });

            const userId = payload.id;

            socket.leave(`user:${userId}`);
        } catch (error) {
            this.logger.error(`❌ Invalid token for socket ${socket.id}: ${error.message}`);
            socket.disconnect();
            return;
        }
    }

    // === Chat events ===
    @SubscribeMessage('chat:send')
    async handleChatMessage(
        @MessageBody() payload: { roomId: string; message: string },
        @ConnectedSocket() socket: Socket,
    ) {
        this.server.to(`room:${payload.roomId}`).emit('chat:receive', payload);
    }
}
