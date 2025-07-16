// Define the shape of a single transaction
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

// Create some dummy data for the transaction history
const dummyTransactions: Transaction[] = [
  { id: '1', date: '2025-06-15', description: 'Scheduled Payment', amount: 250.00, type: 'credit' },
  { id: '2', date: '2025-05-15', description: 'Scheduled Payment', amount: 250.00, type: 'credit' },
  { id: '3', date: '2025-04-15', description: 'Scheduled Payment', amount: 250.00, type: 'credit' },
  { id: '4', date: '2025-03-15', description: 'Scheduled Payment', amount: 250.00, type: 'credit' },
];

// Helper function to format numbers as currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export function TransactionHistory() {
  return (
    <div className="w-full">
      <div className="flow-root">
        <ul className="-my-4 divide-y divide-sand">
          {dummyTransactions.map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between py-4">
              <div>
                {/* --- UPDATED FONT STYLE --- */}
                <p className="text-sm font-sans font-medium text-portola-green">
                  {transaction.description}
                </p>
                <p className="text-xs font-sans text-steel">
                  {transaction.date}
                </p>
              </div>
              {/* --- UPDATED FONT STYLE --- */}
              <p className={`text-sm font-sans ${transaction.type === 'credit' ? 'text-grass' : 'text-charcoal'}`}>
                {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}