import auth from '../config/auth-config.js';

export const requireAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Valid session required' 
            });
        }

        req.user = session.user;
        req.session = session.session;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'Authentication failed' 
        });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (session) {
            req.user = session.user;
            req.session = session.session;
        }

        next();
    } catch (error) {
        console.error('Optional auth middleware error:', error);
        next();
    }
};

export const requireRole = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Authentication required' 
            });
        }

        const userRoles = req.user.role || [];
        const hasRole = roles.some(role => userRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ 
                error: 'Forbidden',
                message: 'Insufficient permissions' 
            });
        }

        next();
    };
};

export default {
    requireAuth,
    optionalAuth,
    requireRole,
};