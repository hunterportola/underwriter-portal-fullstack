import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { Button } from './Button';

interface BankAccount {
    accountId: string;
    accessToken: string;
    name: string;
    mask: string;
    subtype: string;
}

const AddNewAccountFlow = ({ onAccountAdded, onCancel }: { onAccountAdded: () => void; onCancel: () => void; }) => {
    const [linkToken, setLinkToken] = useState<string | null>(null);

    useEffect(() => {
        const generateToken = async () => {
            try {
                const response = await axios.post('http://localhost:3001/api/create_link_token');
                setLinkToken(response.data.link_token);
            } catch (error) {
                console.error("Failed to generate Plaid link token:", error);
            }
        };
        generateToken();
    }, []);

    const onSuccess = useCallback(async (public_token: string) => {
        await axios.post('http://localhost:3001/api/exchange_public_token', { public_token });
        onAccountAdded();
    }, [onAccountAdded]);

    const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

    return (
        <div className="p-4 border-2 border-dashed border-pebble rounded-md text-center">
            <p className="font-serif mb-4">Securely link a new bank account using Plaid.</p>
            <div className="flex gap-4">
                <Button variant="ghost" className="w-full" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="primary" size="lg" className="w-full" onClick={() => open()} disabled={!ready || !linkToken}>
                    Link New Account
                </Button>
            </div>
        </div>
    );
};

const SavedAccountRow = ({ account, onDelete }: { account: BankAccount, onDelete: () => void }) => (
     <div className="flex items-center justify-between p-3 border-2 border-pebble rounded-md">
        <div>
            <p className="font-serif text-portola-green">
                <span className="font-bold capitalize">{account.subtype.replace('_', ' ')}</span> ending in {account.mask}
            </p>
            <p className="text-xs text-steel">{account.name}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>Remove</Button>
    </div>
);

export function BankManagement() {
    const [view, setView] = useState<'list' | 'add'>('list');
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = async () => {
        setError(null);
        try {
            const { data } = await axios.get('http://localhost:3001/api/plaid/accounts');
            if (Array.isArray(data)) {
                setAccounts(data);
            } else {
                 setError("Could not load your saved accounts.");
            }
        } catch (err) {
            setError("Could not load your saved accounts.");
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchAccounts();
        }
    }, [view]);

    // Note: Plaid does not have a simple "detach" like Stripe. 
    // In a real app, you would have a backend endpoint to delete the Plaid item from your database.
    const handleDelete = (accountId: string) => {
        alert(`In a real app, you would now delete account ${accountId} from your database.`);
    };

    return (
        <div className="space-y-4">
            {view === 'list' ? (
                <>
                    {accounts.length > 0 ? (
                        accounts.map(acc => (
                            <SavedAccountRow key={acc.accountId} account={acc} onDelete={() => handleDelete(acc.accountId)} />
                        ))
                    ) : (
                        <p className="text-center text-steel p-4">You have no linked bank accounts.</p>
                    )}
                    {error && <p className="text-xs text-center text-alert">{error}</p>}
                    <Button variant="outline" className="w-full" onClick={() => setView('add')}>
                        Link New Bank Account
                    </Button>
                </>
            ) : (
                <AddNewAccountFlow onAccountAdded={() => setView('list')} onCancel={() => setView('list')} />
            )}
        </div>
    );
}