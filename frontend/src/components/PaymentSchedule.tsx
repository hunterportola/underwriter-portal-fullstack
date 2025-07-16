// Define the shape of a single scheduled payment
interface ScheduledPayment {
  id: string;
  date: string;
  paymentAmount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

// Create some dummy data for the payment schedule
const dummySchedule: ScheduledPayment[] = [
  { id: '1', date: '2025-01-15', paymentAmount: 625.30, principal: 555.30, interest: 70.00, remainingBalance: 6444.70 },
  { id: '2', date: '2025-02-15', paymentAmount: 625.30, principal: 560.85, interest: 64.45, remainingBalance: 5883.85 },
  { id: '3', date: '2025-03-15', paymentAmount: 625.30, principal: 566.46, interest: 58.84, remainingBalance: 5317.39 },
  { id: '4', date: '2025-04-15', paymentAmount: 625.30, principal: 572.12, interest: 53.18, remainingBalance: 4745.27 },
  { id: '5', date: '2025-05-15', paymentAmount: 625.30, principal: 577.84, interest: 47.46, remainingBalance: 4167.43 },
  { id: '6', date: '2025-06-15', paymentAmount: 625.30, principal: 583.62, interest: 41.68, remainingBalance: 3583.81 },
  { id: '7', date: '2025-07-15', paymentAmount: 625.30, principal: 589.46, interest: 35.84, remainingBalance: 2994.35 },
  { id: '8', date: '2025-08-15', paymentAmount: 625.30, principal: 595.35, interest: 29.95, remainingBalance: 2399.00 },
  { id: '9', date: '2025-09-15', paymentAmount: 625.30, principal: 601.30, interest: 24.00, remainingBalance: 1797.70 },
  { id: '10', date: '2025-10-15', paymentAmount: 625.30, principal: 607.31, interest: 17.99, remainingBalance: 1190.39 },
  { id: '11', date: '2025-11-15', paymentAmount: 625.30, principal: 613.38, interest: 11.92, remainingBalance: 577.01 },
  { id: '12', date: '2025-12-15', paymentAmount: 625.30, principal: 619.51, interest: 5.79, remainingBalance: 0.00 },
];

// Helper function to format numbers as currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function PaymentSchedule() {
  return (
    <div className="w-full text-sm">
      {/* Header Row */}
      <div className="grid grid-cols-5 gap-4 px-3 py-2 font-sans text-steel border-b border-pebble">
        <div>Date</div>
        <div className="text-right">Payment</div>
        <div className="text-right">Principal</div>
        <div className="text-right">Interest</div>
        <div className="text-right">Balance</div>
      </div>
      {/* Data Rows */}
      <div className="max-h-96 overflow-y-auto">
        {dummySchedule.map((payment) => (
          // --- UPDATED FONT STYLE ---
          <div key={payment.id} className="grid grid-cols-5 gap-4 px-3 py-3 font-sans text-charcoal border-b border-sand last:border-b-0">
            <div className="text-left">{payment.date}</div>
            <div className="text-right">{formatCurrency(payment.paymentAmount)}</div>
            <div className="text-right">{formatCurrency(payment.principal)}</div>
            <div className="text-right text-steel">{formatCurrency(payment.interest)}</div>
            <div className="text-right">{formatCurrency(payment.remainingBalance)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}