import { Grid } from 'aura-glass';

export default function GridMinimal() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap={2}>
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
    </Grid>
  );
}
