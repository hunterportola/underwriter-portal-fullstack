import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { BankManagement } from './BankManagement'; // <-- Import the new component

export function BankDetailsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank details</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Replace the old content with the new management component */}
        <BankManagement />
      </CardContent>
    </Card>
  );
}