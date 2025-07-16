import { useState, useEffect, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
// import type { RootState, AppDispatch } from '../store/store';
// import { fetchActivities } from '../store/activitySlice';
import { Modal } from './Modal';
import { Button } from './Button';
import { DollarAmountInput } from './DollarAmountInput';
import { cn } from '../utils';

interface BankAccount {
    accountId: string;
    accessToken: string;
    name: string;
    mask: string;
    subtype: string;
}

const AddNewAccountFlow = ({ onAccountAdded }: { onAccountAdded: () => void }) => {
    const [linkToken, setLinkToken] = useState<string | null>(null);

    useEffect(() => {
        const generateToken = async () => {
            try {
                const response = await axios.post('http://localhost:3001/api/plaid/create_link_token');
                setLinkToken(response.data.link_token);
            } catch (error) {
                console.error("Failed to generate Plaid link token:", error);
            }
        };
        generateToken();
    }, []);

    const onSuccess = useCallback(async (public_token: string) => {
        await axios.post('http://localhost:3001/api/plaid/exchange_public_token', { public_token });
        onAccountAdded();
    }, [onAccountAdded]);

    const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

    return (
        <div className="text-center">
            <p className="font-serif mb-4">Please connect your bank account to pay with ACH.</p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => open()} disabled={!ready || !linkToken}>
                Connect a New Bank Account
            </Button>
        </div>
    );
};

const BankAccountRow = ({ account, isSelected, onSelect }: { account: BankAccount; isSelected: boolean; onSelect: () => void; }) => (
    <div
        onClick={onSelect}
        className={cn(
            "flex items-center justify-between p-3 border-2 rounded-md cursor-pointer transition-colors duration-200",
            isSelected ? "border-grass bg-cotton" : "border-pebble hover:border-dried-thyme"
        )}
    >
        <div>
            <p className="font-serif text-portola-green">
                <span className="font-bold capitalize">{account.subtype.replace('_', ' ')}</span> ending in {account.mask}
            </p>
            <p className="text-xs text-steel">{account.name}</p>
        </div>
        {isSelected && <div className="w-5 h-5 rounded-full bg-grass flex items-center justify-center text-cloud">✓</div>}
    </div>
);

export function ACHPaymentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
    // const dispatch: AppDispatch = useDispatch();
    // const { nextPaymentAmount } = useSelector((state: RootState) => state.loan);
    const nextPaymentAmount = 100.00; // Placeholder
    const [view, setView] = useState<'select_account' | 'add_account' | 'confirm_payment' | 'success'>('select_account');
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPartialInput, setShowPartialInput] = useState(false);
    const [partialAmount, setPartialAmount] = useState('');

    const fetchAccounts = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/plaid/accounts');
            
            if (Array.isArray(data)) {
                setAccounts(data);
                if (data.length > 0) {
                    setSelectedAccount(data[0]);
                    setView('select_account');
                } else {
                    setView('add_account');
                }
            } else {
                console.error("API did not return an array for accounts:", data);
                setError("Received an invalid response from the server.");
            }

        } catch (err) {
            console.error("Could not fetch bank accounts", err);
            setError("Could not load your saved bank accounts.");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchAccounts();
        }
    }, [isOpen]);

    const handlePay = async (amount: string) => {
        if (!selectedAccount) return;

        setIsProcessing(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3001/api/plaid/ach/payment', {
                amount: parseFloat(amount).toFixed(2),
                accessToken: selectedAccount.accessToken,
                accountId: selectedAccount.accountId,
            });

            if (response.data.success) {
                setView('success');
                // dispatch(fetchActivities());
                setTimeout(() => handleClose(), 2000);
            } else {
                setError(response.data.error || 'Payment failed.');
            }
        } catch (err) {
            setError('Could not process payment.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleClose = () => {
        setView('select_account');
        setShowPartialInput(false);
        setPartialAmount('');
        setError(null);
        setSelectedAccount(null);
        onClose();
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const renderContent = () => {
        switch (view) {
            case 'success':
                return (
                    <div className="text-center p-8">
                        <h3 className="font-serif text-lg text-grass">✅ ACH Payment Initiated!</h3>
                        <p className="text-sm text-steel mt-2">
                            You can track the progress in the Activity section. This window will close shortly.
                        </p>
                    </div>
                );
            case 'select_account':
                if (accounts.length === 0) {
                    return <AddNewAccountFlow onAccountAdded={fetchAccounts} />;
                }
                return (
                    <div className="space-y-4">
                        <p className="text-sm font-sans text-steel">Select an account to pay with:</p>
                        {accounts.map(acc => (
                            <BankAccountRow key={acc.accountId} account={acc} isSelected={selectedAccount?.accountId === acc.accountId} onSelect={() => setSelectedAccount(acc)} />
                        ))}
                        <Button variant="primary" className="w-full" disabled={!selectedAccount} onClick={() => setView('confirm_payment')}>
                            Continue
                        </Button>
                        <hr/>
                        <Button variant="outline" className="w-full" onClick={() => setView('add_account')}>
                            Link a New Account
                        </Button>
                    </div>
                );
            case 'confirm_payment':
                if (!selectedAccount) {
                    setView('select_account');
                    return null;
                }
                return (
                    <div className="space-y-4">
                        <div className="p-4 border border-pebble rounded-md bg-sand">
                            <p className="font-sans text-sm text-steel">Paying with</p>
                            <div className="mt-2 text-left space-y-1">
                                <p className="font-serif text-lg text-portola-green">
                                    <span className="font-bold capitalize">{selectedAccount.subtype.replace('_', ' ')}</span> ending in {selectedAccount.mask}
                                </p>
                            </div>
                        </div>
                        {error && <p className="text-sm text-center text-alert">{error}</p>}
                        <div className="p-4 border-2 border-dashed border-pebble rounded-md space-y-4">
                        {!showPartialInput ? (
                            <div className="space-y-3">
                                <Button variant="success" size="lg" className="w-full" onClick={() => handlePay(nextPaymentAmount.toString())} disabled={isProcessing}>
                                    {isProcessing ? 'Processing...' : `Pay Next Payment (${formatCurrency(nextPaymentAmount)})`}
                                </Button>
                                <Button variant="outline" size="lg" className="w-full" onClick={() => setShowPartialInput(true)} disabled={isProcessing}>
                                    Pay Other Amount
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <DollarAmountInput label="Payment Amount (USD)" value={partialAmount} onChange={(val) => setPartialAmount(val)} size="large" />
                                <Button variant="success" size="lg" className="w-full mt-2" onClick={() => handlePay(partialAmount)} disabled={!partialAmount || parseFloat(partialAmount) <= 0 || isProcessing}>
                                    {isProcessing ? 'Processing...' : 'Submit Payment'}
                                </Button>
                            </div>
                        )}
                        </div>
                         <Button variant="ghost" size="sm" className="w-full" onClick={() => {setShowPartialInput(false); setView('select_account')}}>
                            Change Account
                        </Button>
                    </div>
                );
            case 'add_account':
                return <AddNewAccountFlow onAccountAdded={fetchAccounts} />;
            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Pay with Bank Account (ACH)">
            {renderContent()}
            {error && view !== 'confirm_payment' && (
                 <p className="text-center text-alert mt-4">{error}</p>
            )}
        </Modal>
    );
}