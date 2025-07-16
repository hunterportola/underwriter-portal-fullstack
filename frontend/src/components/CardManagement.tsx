import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { PaymentMethod } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button } from './Button';

const stripePromise = loadStripe('pk_test_51RkuoX2L6IuYsTbLbuy2fakRTrnfy59opAXnOqa3EhXDm1vg0rfFlIukpZjZUq3XCrVFe2daXdpUWzxU8NEHm1bz00tJjAaRWC');

// --- Reusable UI Components ---
const AddNewCardForm = ({ onCardAdded, onCancel }: { onCardAdded: () => void; onCancel: () => void; }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        try {
            const { data } = await axios.post('http://localhost:3001/api/stripe/create-setup-intent');
            const { error: setupError } = await stripe.confirmCardSetup(data.clientSecret, {
                payment_method: { card: cardElement },
            });

            if (setupError) {
                setError(setupError.message || 'An error occurred.');
            } else {
                onCardAdded();
            }
        } catch (err) {
            setError('Could not connect to the server.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border-2 border-dashed border-pebble rounded-md">
            <p className="text-sm text-steel">Add and save a new card.</p>
            <div className="p-4 bg-sand border border-pebble rounded-md">
                <CardElement />
            </div>
            {error && <p className="text-xs text-center text-alert">{error}</p>}
            <div className="flex gap-4">
                <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" className="w-full" disabled={isProcessing || !stripe}>
                    {isProcessing ? 'Saving...' : 'Save Card'}
                </Button>
            </div>
        </form>
    );
};

const SavedCardRow = ({ pm, onDelete }: { pm: PaymentMethod; onDelete: () => void; }) => (
    <div className="flex items-center justify-between p-3 border-2 border-pebble rounded-md">
        <div>
            <p className="font-serif text-portola-green">
                <span className="font-bold uppercase">{pm.card?.brand}</span> ending in {pm.card?.last4}
            </p>
            <p className="text-xs text-steel">Expires {pm.card?.exp_month}/{pm.card?.exp_year}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>Remove</Button>
    </div>
);


// --- Main Management Component ---
export function CardManagement() {
    const [view, setView] = useState<'list' | 'add'>('list');
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchPaymentMethods = async () => {
        setError(null);
        try {
            const { data } = await axios.get('http://localhost:3001/api/stripe/payment-methods');
            setPaymentMethods(data);
        } catch (err) {
            setError("Could not load your saved cards.");
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchPaymentMethods();
        }
    }, [view]);
    
    const handleDelete = async (paymentMethodId: string) => {
        try {
            await axios.delete(`http://localhost:3001/api/stripe/payment-methods/${paymentMethodId}`);
            fetchPaymentMethods(); // Refresh the list after deleting
        } catch (err) {
            setError("Failed to remove card. Please try again.");
        }
    };

    const handleCardAdded = () => {
        setView('list');
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="space-y-4">
                {view === 'list' ? (
                    <>
                        {paymentMethods.length > 0 ? (
                            paymentMethods.map(pm => (
                                <SavedCardRow key={pm.id} pm={pm} onDelete={() => handleDelete(pm.id)} />
                            ))
                        ) : (
                            <p className="text-center text-steel p-4">You have no saved cards.</p>
                        )}
                        {error && <p className="text-xs text-center text-alert">{error}</p>}
                        <Button variant="outline" className="w-full" onClick={() => setView('add')}>
                            Add New Card
                        </Button>
                    </>
                ) : (
                    <AddNewCardForm onCardAdded={handleCardAdded} onCancel={() => setView('list')} />
                )}
            </div>
        </Elements>
    );
}