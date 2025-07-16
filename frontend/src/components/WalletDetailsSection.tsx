import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { WalletManagement } from './WalletManagement';

export function WalletDetailsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Details</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Replace the old content with our new management component */}
        <WalletManagement />
      </CardContent>
    </Card>
  );
}