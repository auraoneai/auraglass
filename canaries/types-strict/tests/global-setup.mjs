import { fileURLToPath } from 'node:url';
import { consumerInstall } from '../../_shared/consumer-install.mjs';

export default function globalSetup() {
  consumerInstall(fileURLToPath(new URL('..', import.meta.url)));
}
