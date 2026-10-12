import { Card } from 'aura-glass';

export default function CardMinimal() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Monthly report</Card.Title>
        <Card.Description>October 2026</Card.Description>
      </Card.Header>
      <Card.Body>Revenue grew 12% over September.</Card.Body>
      <Card.Footer>Updated 2 hours ago</Card.Footer>
    </Card>
  );
}
