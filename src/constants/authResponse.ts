import { httpStatusCode } from './httpStatusCode';

export const authResponse = {
    USERNAME_EXIST: {
        status: httpStatusCode.BAD_REQUEST,
        message: 'Username already exists',
    },
    ACCOUNT_DELETED: {
        status: httpStatusCode.FORBIDDEN,
        message: 'Tài khoản của bạn đã bị xoá',
        code: 'ACCOUNT_SOFT_DELETED',
    },
    LOGIN_INCORRECT: {
        status: httpStatusCode.UNAUTHORIZED,
        message: 'Thông tin tài khoản hoặc mật khẩu không chính xác',
    },
    INVALID_TOKEN: {
        status: httpStatusCode.UNAUTHORIZED,
        message: 'Invalid token',
    },
    INVALID_REFRESH_TOKEN: {
        status: httpStatusCode.UNAUTHORIZED,
        message: 'Invalid refresh token',
    },
    USER_NOT_FOUND: {
        status: httpStatusCode.BAD_REQUEST,
        message: 'User not found',
    },
    CHANGE_PASSWORD_FAIL: {
        status: httpStatusCode.BAD_REQUEST,
        message: 'Old password incorrect',
    },
    RECOVER_ACCOUNT_PASSWORD_INCORRECT: {
        status: httpStatusCode.BAD_REQUEST,
        message: 'Password incorrect',
    },
    ACCOUNT_LOCKED: {
        status: httpStatusCode.FORBIDDEN,

        message: 'Tài khoản của bạn đã bị khoá',
        code: 'ACCOUNT_LOCKED',
    },
};
