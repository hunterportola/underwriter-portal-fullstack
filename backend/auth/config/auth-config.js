import { betterAuth } from 'better-auth';
// import { createRavenDBAdapter } from '../adapters/ravendb-adapter.js';

const authConfig = {
    // database: createRavenDBAdapter(), // TODO: Enable when RavenDB adapter is fully tested
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: '/api/auth',
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') || [process.env.FRONTEND_URL || 'http://localhost:5173'],
    session: {
        expiresIn: parseInt(process.env.SESSION_MAX_AGE) || 60 * 60 * 24 * 7, // 7 days
        updateAge: parseInt(process.env.SESSION_UPDATE_AGE) || 60 * 60 * 24, // 1 day
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    user: {
        additionalFields: {
            firstName: {
                type: 'string',
                required: false,
            },
            lastName: {
                type: 'string',
                required: false,
            },
            phoneNumber: {
                type: 'string',
                required: false,
            },
            maritalStatus: {
                type: 'string',
                required: false,
            },
            education: {
                type: 'string',
                required: false,
            },
            stripeCustomerId: {
                type: 'string',
                required: false,
            },
            walletAddress: {
                type: 'string',
                required: false,
            },
        },
    },
};

export const auth = betterAuth(authConfig);

export default auth;