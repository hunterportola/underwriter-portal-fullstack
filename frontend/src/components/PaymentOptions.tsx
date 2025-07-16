import React from 'react';

interface PaymentOptionsProps {
  onSelectACH: () => void;
  onSelectCard: () => void;
  onSelectStablecoin: () => void;
}

function ChevronRightIcon() {
  return (
    <svg className="w-5 h-5 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function PaymentOptionRow({ title, description, onClick, children }: { title: string; description: string; onClick: () => void; children: React.ReactNode; }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-md border-2 border-pebble hover:border-grass hover:bg-cotton transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        {children}
        <div className="text-left">
          <p className="font-serif font-semibold text-portola-green">{title}</p>
          <p className="font-sans text-sm text-steel">{description}</p>
        </div>
      </div>
      <ChevronRightIcon />
    </button>
  );
}

export function PaymentOptions({ onSelectACH, onSelectCard, onSelectStablecoin }: PaymentOptionsProps) {
  return (
    <div className="w-full space-y-4">
      <PaymentOptionRow 
        title="Bank Account (ACH)" 
        description="Connect your bank account via Plaid"
        onClick={onSelectACH}
      >
        <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center border border-pebble"><p className="font-bold font-mono text-portola-green">ACH</p></div>
      </PaymentOptionRow>
      
      <PaymentOptionRow 
        title="Credit or Debit Card" 
        description="Pay with Visa, Mastercard, or Amex via Stripe"
        onClick={onSelectCard}
      >
        <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center border border-pebble"><svg className="w-6 h-6 text-portola-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div>
      </PaymentOptionRow>

      <PaymentOptionRow 
        title="Stablecoin (USDC)" 
        description="Pay directly from your crypto wallet"
        onClick={onSelectStablecoin}
      >
        <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center border border-pebble"><svg className="w-6 h-6 text-portola-green" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.333 8.333a1 1 0 112 0 1 1 0 01-2 0zm1.41-1.423a.75.75 0 011.06 0l.94.94a.75.75 0 11-1.06 1.06l-.94-.94a.75.75 0 010-1.06zm3.523-.007a.75.75 0 011.06 0l.94.94a.75.75 0 11-1.06 1.06l-.94-.94a.75.75 0 010-1.06zM9 12a1 1 0 112 0 1 1 0 01-2 0z" /></svg></div>
      </PaymentOptionRow>
    </div>
  );
}