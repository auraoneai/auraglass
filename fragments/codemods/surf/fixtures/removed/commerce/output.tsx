// TODO(aura-glass 5): removed in 5.0 (registry item 'commerce-cart'), see #dep-s0804
// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassSmartShoppingCart } from 'aura-glass';

export const Cart = ({ items }) => <GlassSmartShoppingCart items={items} />;
