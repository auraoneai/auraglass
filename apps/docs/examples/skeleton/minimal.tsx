import { Skeleton } from 'aura-glass';

export default function SkeletonMinimal() {
  return <Skeleton shape="text" lines={3} style={{ width: 240 }} />;
}
