import { ImageList } from 'aura-glass';

const PHOTOS = ['glacier', 'harbour', 'desert'];

export default function ImageListMinimal() {
  return (
    <ImageList cols={3}>
      {PHOTOS.map((p) => (
        <ImageList.Item key={p}>
          <img src={`https://picsum.photos/seed/${p}/300/200`} alt={p} />
        </ImageList.Item>
      ))}
    </ImageList>
  );
}
