import store from '../../config/db.js';
import { getUserFromSession } from './session-utils.js';

// Utility to sync BetterAuth users with RavenDB user documents
export const syncUserToRavenDB = async (betterAuthUser) => {
    const session = store.openSession();
    try {
        const userId = betterAuthUser.id;
        
        // Check if user already exists in RavenDB
        let ravenUser = await session.load(userId);
        
        if (!ravenUser) {
            // Create new user document in RavenDB
            ravenUser = {
                id: userId,
                email: betterAuthUser.email,
                firstName: betterAuthUser.firstName || '',
                lastName: betterAuthUser.lastName || '',
                phoneNumber: betterAuthUser.phoneNumber || '',
                maritalStatus: betterAuthUser.maritalStatus || '',
                education: betterAuthUser.education || '',
                stripeCustomerId: betterAuthUser.stripeCustomerId || null,
                walletAddress: betterAuthUser.walletAddress || null,
                createdAt: betterAuthUser.createdAt || new Date(),
                updatedAt: new Date()
            };
            
            await session.store(ravenUser, userId);
        } else {
            // Update existing user with any new data from BetterAuth
            Object.assign(ravenUser, {
                email: betterAuthUser.email,
                firstName: betterAuthUser.firstName || ravenUser.firstName,
                lastName: betterAuthUser.lastName || ravenUser.lastName,
                phoneNumber: betterAuthUser.phoneNumber || ravenUser.phoneNumber,
                maritalStatus: betterAuthUser.maritalStatus || ravenUser.maritalStatus,
                education: betterAuthUser.education || ravenUser.education,
                stripeCustomerId: betterAuthUser.stripeCustomerId || ravenUser.stripeCustomerId,
                walletAddress: betterAuthUser.walletAddress || ravenUser.walletAddress,
                updatedAt: new Date()
            });
        }
        
        await session.saveChanges();
        return ravenUser;
    } catch (error) {
        console.error('Failed to sync user to RavenDB:', error);
        throw error;
    }
};

export const getRavenUserFromAuth = async (req) => {
    try {
        const authUser = await getUserFromSession(req);
        if (!authUser) {
            return null;
        }
        
        const session = store.openSession();
        let ravenUser = await session.load(authUser.id);
        
        if (!ravenUser) {
            // Sync the auth user to RavenDB if not exists
            ravenUser = await syncUserToRavenDB(authUser);
        }
        
        return ravenUser;
    } catch (error) {
        console.error('Failed to get RavenDB user from auth:', error);
        return null;
    }
};

export const updateRavenUser = async (userId, updateData) => {
    const session = store.openSession();
    try {
        const user = await session.load(userId);
        if (!user) {
            throw new Error('User not found in RavenDB');
        }
        
        Object.assign(user, updateData, { updatedAt: new Date() });
        await session.saveChanges();
        
        return user;
    } catch (error) {
        console.error('Failed to update RavenDB user:', error);
        throw error;
    }
};

export default {
    syncUserToRavenDB,
    getRavenUserFromAuth,
    updateRavenUser,
};