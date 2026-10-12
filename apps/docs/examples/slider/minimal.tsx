import { Slider } from 'aura-glass';

export default function SliderMinimal() {
  return <Slider.Root aria-label="Brightness" defaultValue={70} min={0} max={100} />;
}
