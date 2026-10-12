import { FileUpload } from 'aura-glass';

export default function FileUploadMinimal() {
  return <FileUpload accept="image/*" multiple maxCount={5} />;
}
