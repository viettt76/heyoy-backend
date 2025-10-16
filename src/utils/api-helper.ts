import { HttpStatus } from '@nestjs/common';

export const apiHelper = async ({
    action,
    message,
    statusCode,
}: {
    action: () => Promise<any>;
    message?: string;
    statusCode?: number;
}) => {
    const data = await action();

    const code = statusCode ?? HttpStatus.OK;

    return {
        statusCode: code,
        message: message ?? (code >= 200 && code < 300 ? 'Success' : 'Error'),
        data,
    };
};
