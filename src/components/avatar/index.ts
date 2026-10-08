/* Avatar remains a contract seed until its lane delivers; exports frozen (CMP_MODULES, §4.6). */
import { createSeedCompound } from '../../contracts/seed';

export const Avatar = createSeedCompound('avatar', ['Root','Image','Fallback']);
export { AvatarGroup } from './AvatarGroup';
export type { AvatarGroupProps } from './AvatarGroup';
