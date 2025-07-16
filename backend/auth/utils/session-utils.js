import auth from '../config/auth-config.js';

export const createUserSession = async (userId, additionalData = {}) => {
    try {
        const session = await auth.api.signIn.email({
            email: additionalData.email,
            password: additionalData.password,
        });
        return session;
    } catch (error) {
        console.error('Failed to create user session:', error);
        throw error;
    }
};

export const validateSession = async (sessionToken) => {
    try {
        const session = await auth.api.getSession({
            headers: {
                authorization: `Bearer ${sessionToken}`,
            },
        });
        return session;
    } catch (error) {
        console.error('Failed to validate session:', error);
        return null;
    }
};

export const revokeSession = async (sessionToken) => {
    try {
        await auth.api.signOut({
            headers: {
                authorization: `Bearer ${sessionToken}`,
            },
        });
        return true;
    } catch (error) {
        console.error('Failed to revoke session:', error);
        return false;
    }
};

export const refreshSession = async (sessionToken) => {
    try {
        const session = await validateSession(sessionToken);
        if (!session) {
            throw new Error('Invalid session');
        }
        
        // Session is automatically refreshed by BetterAuth when validated
        return session;
    } catch (error) {
        console.error('Failed to refresh session:', error);
        throw error;
    }
};

export const getUserFromSession = async (req) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });
        
        return session?.user || null;
    } catch (error) {
        console.error('Failed to get user from session:', error);
        return null;
    }
};

export const isAuthenticated = async (req) => {
    const user = await getUserFromSession(req);
    return !!user;
};

export default {
    createUserSession,
    validateSession,
    revokeSession,
    refreshSession,
    getUserFromSession,
    isAuthenticated,
};