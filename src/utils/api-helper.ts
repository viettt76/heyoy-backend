import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export const apiHelper = async ({
    action,
    message,
    statusCode,
}: {
    action: () => Promise<any>;
    message?: string;
    statusCode?: number;
}) => {
    try {
        const data = await action();

        const code = statusCode ?? HttpStatus.OK;

        return {
            statusCode: code,
            message: message ?? (code >= 200 && code < 300 ? 'Success' : 'Error'),
            data,
        };
    } catch (error) {
        Logger.error(error);
        throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
