import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import type { PaymentMethod } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
// import type { RootState, AppDispatch } from '../store/store';
// import { fetchActivities } from '../store/activitySlice';
import { Modal } from './Modal';
import { Button } from './Button';
import { DollarAmountInput } from './DollarAmountInput';
import { cn } from '../utils';

const stripePromise = loadStripe('pk_test_51RkuoX2L6IuYsTbLbuy2fakRTrnfy59opAXnOqa3EhXDm1vg0rfFlIukpZjZUq3XCrVFe2daXdpUWzxU8NEHm1bz00tJjAaRWC');

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

const CardRow = ({ pm, isSelected, onSelect }: { pm: PaymentMethod; isSelected: boolean; onSelect: () => void; }) => (
    <div
        onClick={onSelect}
        className={cn(
            "flex items-center justify-between p-3 border-2 rounded-md cursor-pointer transition-colors duration-200",
            isSelected ? "border-grass bg-cotton" : "border-pebble hover:border-dried-thyme"
        )}
    >
        <div>
            <p className="font-serif text-portola-green">
                <span className="font-bold uppercase">{pm.card?.brand}</span> ending in {pm.card?.last4}
            </p>
            <p className="text-xs text-steel">Expires {pm.card?.exp_month}/{pm.card?.exp_year}</p>
        </div>
        {isSelected && <div className="w-5 h-5 rounded-full bg-grass flex items-center justify-center text-cloud">✓</div>}
    </div>
);

export function CardPaymentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
    // const dispatch: AppDispatch = useDispatch();
    // const { nextPaymentAmount } = useSelector((state: RootState) => state.loan);
    const nextPaymentAmount = 100.00; // Placeholder
    const [view, setView] = useState<'select_card' | 'add_card' | 'confirm_payment' | 'success'>('select_card');
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedCard, setSelectedCard] = useState<PaymentMethod | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPartialInput, setShowPartialInput] = useState(false);
    const [partialAmount, setPartialAmount] = useState('');

    const fetchPaymentMethods = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/stripe/payment-methods');
            setPaymentMethods(data);
            if (data.length > 0) {
                setSelectedCard(data[0]);
            } else {
                setView('add_card');
            }
        } catch (err) {
            console.error("Could not fetch payment methods", err);
            setError("Could not load your saved cards.");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchPaymentMethods();
        }
    }, [isOpen]);

    const handlePay = async (amount: string) => {
        if (!selectedCard) return;

        setIsProcessing(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3001/api/stripe/create-payment-intent', {
                amount: parseFloat(amount).toFixed(2),
                payment_method: selectedCard.id,
            });

            if (response.data.status === 'succeeded' || response.data.status === 'processing') {
                setView('success');
                // dispatch(fetchActivities());
                setTimeout(() => handleClose(), 2000);
            } else {
                setError('Payment failed. Please try another card.');
            }
        } catch (err) {
            setError('Could not process payment.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCardAdded = () => {
        fetchPaymentMethods();
        setView('select_card');
    };

    const handleClose = () => {
        setView('select_card');
        setShowPartialInput(false);
        setPartialAmount('');
        setError(null);
        setSelectedCard(null);
        onClose();
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const renderContent = () => {
        switch (view) {
            case 'success':
                return (
                    <div className="text-center p-8">
                        <h3 className="font-serif text-lg text-grass">✅ Payment Sent!</h3>
                        <p className="text-sm text-steel mt-2">
                            Your payment is processing. You can track the final status in the Activity section.
                        </p>
                    </div>
                );
            case 'select_card':
                return (
                    <div className="space-y-4">
                        <p className="text-sm font-sans text-steel">Select a card to pay with:</p>
                        {paymentMethods.map(pm => (
                            <CardRow key={pm.id} pm={pm} isSelected={selectedCard?.id === pm.id} onSelect={() => setSelectedCard(pm)} />
                        ))}
                        <Button variant="primary" className="w-full" disabled={!selectedCard} onClick={() => setView('confirm_payment')}>
                            Continue
                        </Button>
                        <hr />
                        <Button variant="outline" className="w-full" onClick={() => setView('add_card')}>
                            Add a New Card
                        </Button>
                    </div>
                );
            case 'confirm_payment':
                if (!selectedCard) {
                    setView('select_card');
                    return null;
                }
                return (
                     <div className="space-y-4">
                        <div className="p-4 border border-pebble rounded-md bg-sand">
                            <p className="font-sans text-sm text-steel">Paying with</p>
                            <div className="mt-2 text-left space-y-1">
                                <p className="font-serif text-lg text-portola-green">
                                    <span className="font-bold uppercase">{selectedCard.card?.brand}</span> ending in {selectedCard.card?.last4}
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
                         <Button variant="ghost" size="sm" className="w-full" onClick={() => {setShowPartialInput(false); setView('select_card')}}>
                            Change Card
                        </Button>
                    </div>
                );
            case 'add_card':
                return <AddNewCardForm onCardAdded={handleCardAdded} onCancel={() => setView('select_card')} />;
            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Pay with Credit/Debit Card">
            <Elements stripe={stripePromise}>
                {renderContent()}
            </Elements>
        </Modal>
    );
}