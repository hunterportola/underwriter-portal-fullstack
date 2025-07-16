import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { CardManagement } from './CardManagement';

export function CardDetailsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card details</CardTitle>
      </CardHeader>
      <CardContent>
        <CardManagement />
      </CardContent>
    </Card>
  );
}