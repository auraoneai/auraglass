import { Sparkline } from 'aura-glass/data';

export default function SparklineMinimal() {
  return <Sparkline data={[2, 5, 3, 8, 6, 9, 4, 12]} label="Weekly signups" showLastPoint />;
}
