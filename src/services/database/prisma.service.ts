import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super();

        this.$use(async (params, next) => {
            if (params.action === 'delete' || params.action === 'deleteMany') {
                if (!params.args) params.args = {};
                if (params.args.data && typeof params.args.data === 'object') params.args.data.deletedAt = new Date();
                else params.args.data = { deletedAt: new Date() };
            }

            if (params.action === 'delete') {
                params.action = 'update';
            }
            if (params.action === 'deleteMany') {
                params.action = 'updateMany';
            }

            if (['findMany', 'findFirst', 'findUnique'].includes(params.action)) {
                if (!params.args) params.args = {};

                if (params.args?.includeDeleted) {
                    params.args.where = { ...params.args.where };
                } else {
                    params.args.where = {
                        ...params.args.where,
                        deletedAt: null,
                    };
                }
            }

            return next(params);
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
