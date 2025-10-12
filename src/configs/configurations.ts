const configurations = () => ({
    app: {
        port: process.env.PORT,
        frontendUrl: process.env.FRONTEND_URL,
    },
    authentication: {
        jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
        jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
        jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES,
    },
    redis: {
        url: '',
    },
});

export default configurations;
