import store from '../../config/db.js';

export function createRavenDBAdapter(documentStore = store) {
    return {
        id: "ravendb",
        
        async create({ model, data, select }) {
            const session = documentStore.openSession();
            try {
                const id = `${model}s/${generateId()}`;
                const doc = {
                    id,
                    ...data,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                await session.store(doc, id);
                await session.saveChanges();
                
                return doc;
            } catch (error) {
                throw new Error(`Failed to create ${model}: ${error.message}`);
            }
        },

        async findOne({ model, where, select }) {
            const session = documentStore.openSession();
            try {
                if (where.id) {
                    return await session.load(where.id);
                }

                const query = session.query({ collection: `${model}s` });
                
                Object.entries(where).forEach(([key, value]) => {
                    query.whereEquals(key, value);
                });

                const results = await query.take(1).all();
                return results[0] || null;
            } catch (error) {
                throw new Error(`Failed to find ${model}: ${error.message}`);
            }
        },

        async findMany({ model, where = {}, limit, sortBy, offset }) {
            const session = documentStore.openSession();
            try {
                let query = session.query({ collection: `${model}s` });
                
                Object.entries(where).forEach(([key, value]) => {
                    query.whereEquals(key, value);
                });

                if (offset) {
                    query = query.skip(offset);
                }

                if (limit) {
                    query = query.take(limit);
                }

                return await query.all();
            } catch (error) {
                throw new Error(`Failed to find many ${model}: ${error.message}`);
            }
        },

        async update({ model, where, update }) {
            const session = documentStore.openSession();
            try {
                let doc;
                
                if (where.id) {
                    doc = await session.load(where.id);
                } else {
                    const query = session.query({ collection: `${model}s` });
                    Object.entries(where).forEach(([key, value]) => {
                        query.whereEquals(key, value);
                    });
                    const results = await query.take(1).all();
                    doc = results[0];
                }

                if (!doc) {
                    throw new Error(`${model} not found`);
                }

                Object.assign(doc, update, { updatedAt: new Date() });
                await session.saveChanges();
                
                return doc;
            } catch (error) {
                throw new Error(`Failed to update ${model}: ${error.message}`);
            }
        },

        async updateMany({ model, where, update }) {
            const session = documentStore.openSession();
            try {
                const query = session.query({ collection: `${model}s` });
                
                Object.entries(where).forEach(([key, value]) => {
                    query.whereEquals(key, value);
                });

                const docs = await query.all();
                
                docs.forEach(doc => {
                    Object.assign(doc, update, { updatedAt: new Date() });
                });

                await session.saveChanges();
                
                return docs.length;
            } catch (error) {
                throw new Error(`Failed to update many ${model}: ${error.message}`);
            }
        },

        async delete({ model, where }) {
            const session = documentStore.openSession();
            try {
                let doc;
                
                if (where.id) {
                    doc = await session.load(where.id);
                } else {
                    const query = session.query({ collection: `${model}s` });
                    Object.entries(where).forEach(([key, value]) => {
                        query.whereEquals(key, value);
                    });
                    const results = await query.take(1).all();
                    doc = results[0];
                }

                if (!doc) {
                    return;
                }

                session.delete(doc);
                await session.saveChanges();
            } catch (error) {
                throw new Error(`Failed to delete ${model}: ${error.message}`);
            }
        },

        async deleteMany({ model, where }) {
            const session = documentStore.openSession();
            try {
                const query = session.query({ collection: `${model}s` });
                
                Object.entries(where).forEach(([key, value]) => {
                    query.whereEquals(key, value);
                });

                const docs = await query.all();
                
                docs.forEach(doc => {
                    session.delete(doc);
                });

                await session.saveChanges();
                
                return docs.length;
            } catch (error) {
                throw new Error(`Failed to delete many ${model}: ${error.message}`);
            }
        },

        async count({ model, where = {} }) {
            const session = documentStore.openSession();
            try {
                const query = session.query({ collection: `${model}s` });
                
                Object.entries(where).forEach(([key, value]) => {
                    query.whereEquals(key, value);
                });

                const docs = await query.all();
                return docs.length;
            } catch (error) {
                throw new Error(`Failed to count ${model}: ${error.message}`);
            }
        }
    };
}

function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export class RavenDBAdapter {
    constructor(documentStore = store) {
        this.store = documentStore;
    }

    async createUser(user) {
        const session = this.store.openSession();
        try {
            const userId = `users/${this.generateId()}`;
            const userDoc = {
                id: userId,
                ...user,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            await session.store(userDoc, userId);
            await session.saveChanges();
            
            return { ...userDoc, id: userId };
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    async getUserById(id) {
        const session = this.store.openSession();
        try {
            const user = await session.load(id);
            return user;
        } catch (error) {
            throw new Error(`Failed to get user by id: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        const session = this.store.openSession();
        try {
            const users = await session
                .query({ collection: 'Users' })
                .whereEquals('email', email)
                .take(1)
                .all();
            
            return users[0] || null;
        } catch (error) {
            throw new Error(`Failed to get user by email: ${error.message}`);
        }
    }

    async updateUser(id, data) {
        const session = this.store.openSession();
        try {
            const user = await session.load(id);
            if (!user) {
                throw new Error('User not found');
            }

            Object.assign(user, data, { updatedAt: new Date() });
            await session.saveChanges();
            
            return user;
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    async deleteUser(id) {
        const session = this.store.openSession();
        try {
            const user = await session.load(id);
            if (!user) {
                throw new Error('User not found');
            }

            session.delete(user);
            await session.saveChanges();
            
            return user;
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    async createSession(session) {
        const dbSession = this.store.openSession();
        try {
            const sessionId = `sessions/${this.generateId()}`;
            const sessionDoc = {
                id: sessionId,
                ...session,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            await dbSession.store(sessionDoc, sessionId);
            await dbSession.saveChanges();
            
            return { ...sessionDoc, id: sessionId };
        } catch (error) {
            throw new Error(`Failed to create session: ${error.message}`);
        }
    }

    async getSession(sessionToken) {
        const session = this.store.openSession();
        try {
            const sessions = await session
                .query({ collection: 'Sessions' })
                .whereEquals('sessionToken', sessionToken)
                .take(1)
                .all();
            
            return sessions[0] || null;
        } catch (error) {
            throw new Error(`Failed to get session: ${error.message}`);
        }
    }

    async updateSession(sessionToken, data) {
        const session = this.store.openSession();
        try {
            const sessions = await session
                .query({ collection: 'Sessions' })
                .whereEquals('sessionToken', sessionToken)
                .take(1)
                .all();
            
            if (!sessions[0]) {
                throw new Error('Session not found');
            }

            const sessionDoc = sessions[0];
            Object.assign(sessionDoc, data, { updatedAt: new Date() });
            await session.saveChanges();
            
            return sessionDoc;
        } catch (error) {
            throw new Error(`Failed to update session: ${error.message}`);
        }
    }

    async deleteSession(sessionToken) {
        const session = this.store.openSession();
        try {
            const sessions = await session
                .query({ collection: 'Sessions' })
                .whereEquals('sessionToken', sessionToken)
                .take(1)
                .all();
            
            if (!sessions[0]) {
                throw new Error('Session not found');
            }

            session.delete(sessions[0]);
            await session.saveChanges();
            
            return sessions[0];
        } catch (error) {
            throw new Error(`Failed to delete session: ${error.message}`);
        }
    }

    async createAccount(account) {
        const session = this.store.openSession();
        try {
            const accountId = `accounts/${this.generateId()}`;
            const accountDoc = {
                id: accountId,
                ...account,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            await session.store(accountDoc, accountId);
            await session.saveChanges();
            
            return { ...accountDoc, id: accountId };
        } catch (error) {
            throw new Error(`Failed to create account: ${error.message}`);
        }
    }

    async getAccount(provider, providerAccountId) {
        const session = this.store.openSession();
        try {
            const accounts = await session
                .query({ collection: 'Accounts' })
                .whereEquals('provider', provider)
                .andAlso()
                .whereEquals('providerAccountId', providerAccountId)
                .take(1)
                .all();
            
            return accounts[0] || null;
        } catch (error) {
            throw new Error(`Failed to get account: ${error.message}`);
        }
    }

    async updateAccount(provider, providerAccountId, data) {
        const session = this.store.openSession();
        try {
            const accounts = await session
                .query({ collection: 'Accounts' })
                .whereEquals('provider', provider)
                .andAlso()
                .whereEquals('providerAccountId', providerAccountId)
                .take(1)
                .all();
            
            if (!accounts[0]) {
                throw new Error('Account not found');
            }

            const accountDoc = accounts[0];
            Object.assign(accountDoc, data, { updatedAt: new Date() });
            await session.saveChanges();
            
            return accountDoc;
        } catch (error) {
            throw new Error(`Failed to update account: ${error.message}`);
        }
    }

    async deleteAccount(provider, providerAccountId) {
        const session = this.store.openSession();
        try {
            const accounts = await session
                .query({ collection: 'Accounts' })
                .whereEquals('provider', provider)
                .andAlso()
                .whereEquals('providerAccountId', providerAccountId)
                .take(1)
                .all();
            
            if (!accounts[0]) {
                throw new Error('Account not found');
            }

            session.delete(accounts[0]);
            await session.saveChanges();
            
            return accounts[0];
        } catch (error) {
            throw new Error(`Failed to delete account: ${error.message}`);
        }
    }

    async createVerificationToken(verificationToken) {
        const session = this.store.openSession();
        try {
            const tokenId = `verifications/${this.generateId()}`;
            const tokenDoc = {
                id: tokenId,
                ...verificationToken,
                createdAt: new Date()
            };
            
            await session.store(tokenDoc, tokenId);
            await session.saveChanges();
            
            return { ...tokenDoc, id: tokenId };
        } catch (error) {
            throw new Error(`Failed to create verification token: ${error.message}`);
        }
    }

    async getVerificationToken(identifier, token) {
        const session = this.store.openSession();
        try {
            const tokens = await session
                .query({ collection: 'Verifications' })
                .whereEquals('identifier', identifier)
                .andAlso()
                .whereEquals('token', token)
                .take(1)
                .all();
            
            return tokens[0] || null;
        } catch (error) {
            throw new Error(`Failed to get verification token: ${error.message}`);
        }
    }

    async deleteVerificationToken(identifier, token) {
        const session = this.store.openSession();
        try {
            const tokens = await session
                .query({ collection: 'Verifications' })
                .whereEquals('identifier', identifier)
                .andAlso()
                .whereEquals('token', token)
                .take(1)
                .all();
            
            if (!tokens[0]) {
                throw new Error('Verification token not found');
            }

            session.delete(tokens[0]);
            await session.saveChanges();
            
            return tokens[0];
        } catch (error) {
            throw new Error(`Failed to delete verification token: ${error.message}`);
        }
    }

    generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

export default RavenDBAdapter;