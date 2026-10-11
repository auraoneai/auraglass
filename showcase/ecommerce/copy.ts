/* ecommerce copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59). */
import chair from './assets/atlas-chair.avif';
import chairSide from './assets/atlas-chair-side.avif';
import lamp from './assets/nimbus-lamp.avif';
import mug from './assets/vega-mug.avif';
import tote from './assets/orbit-tote.avif';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

export const COPY = {
  store: 'Harbor & Pine',
  skip: 'Skip to product',
  productName: 'Atlas lounge chair',
  productPrice: 499,
  productBlurb:
    'Solid ash frame, wool-blend upholstery and a seat angled at 12° for long reading sessions. Ships flat in one box; assembly takes about 20 minutes.',
  colourLabel: 'Upholstery',
  quantityLabel: 'Quantity',
  deliveryLabel: 'Delivery',
  addToCart: 'Add to cart',
  cartTitle: 'Your cart',
  checkout: 'Check out',
  continueShopping: 'Continue shopping',
  added: 'Added to cart',
  addedBody: 'Atlas lounge chair · Fog grey',
  relatedHeading: 'Pairs well with',
  reviewsHeading: 'Customer reviews',
  galleryLabel: 'Product photos',
  subtotal: 'Subtotal',
  shipping: 'Shipping',
  total: 'Total',
  cart: 'Cart',
  reviewSummary: '4.5 out of 5 · 128 reviews',
  inStock: 'In stock · ships from Portland',
  shippingNote: 'Free standard delivery and 100-day returns.',
} as const;

export const BREADCRUMBS = [
  { href: '#home', label: 'Home' },
  { href: '#living', label: 'Living room' },
  { href: '#seating', label: 'Seating' },
] as const;

export const GALLERY = [
  { id: 'front', src: chair, alt: 'Atlas lounge chair, front view' },
  { id: 'side', src: chairSide, alt: 'Atlas lounge chair, side view showing the seat angle' },
] as const;

export const COLOURS = [
  { value: 'fog', label: 'Fog grey' },
  { value: 'moss', label: 'Moss green' },
  { value: 'clay', label: 'Clay' },
  { value: 'ink', label: 'Ink blue' },
] as const;

export const DELIVERY = [
  { value: 'standard', label: 'Standard — 5 to 7 business days, free' },
  { value: 'express', label: 'Express — 2 business days, $29' },
  { value: 'pickup', label: 'Collect from the Portland store, free' },
] as const;

export const RELATED = [
  { id: 'lamp', name: 'Nimbus floor lamp', price: 89.5, image: lamp },
  { id: 'mug', name: 'Vega stoneware mug', price: 24, image: mug },
  { id: 'tote', name: 'Orbit canvas tote', price: 38, image: tote },
] as const;

export const CART = [
  { id: 'atlas', name: 'Atlas lounge chair', variant: 'Fog grey', quantity: 1, price: 499, image: chair },
  { id: 'lamp', name: 'Nimbus floor lamp', variant: 'Brass', quantity: 2, price: 89.5, image: lamp },
  { id: 'mug', name: 'Vega stoneware mug', variant: 'Speckled white', quantity: 1, price: 24, image: mug },
] as const;

export const SHIPPING = 12;

export const REVIEWS = [
  { id: 'r1', author: 'Dana K.', date: '2026-02-21', rating: 5, text: 'Sturdy, the wool is softer than expected, and it took me 15 minutes to assemble.' },
  { id: 'r2', author: 'Marcus T.', date: '2026-02-14', rating: 4, text: 'Great reading chair. The seat is a little low if you are over six feet.' },
  { id: 'r3', author: 'Ines R.', date: '2026-02-09', rating: 5, text: 'Second one for the studio. Fog grey hides wear well.' },
  { id: 'r4', author: 'Owen P.', date: '2026-01-30', rating: 4, text: 'Arrived two days early. Cushion firmed up after a week of use.' },
  { id: 'r5', author: 'Priya S.', rating: 5, text: 'The oak legs match our dining table exactly. No wobble on a tiled floor.' },
  { id: 'r6', author: 'Henrik L.', rating: 3, text: 'Comfortable, but the armrests are narrower than the photos suggest.' },
  { id: 'r7', author: 'Chloe M.', rating: 5, text: 'Replacement cover arrived within a week when our dog chewed a corner.' },
  { id: 'r8', author: 'Samuel A.', rating: 4, text: 'Solid build. Box was heavy for one person, so plan for help on delivery day.' },
] as const;

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

/** Select item labels keyed by value, so the trigger shows "Fog grey", not "fog". */
export const COLOUR_LABELS: Record<string, string> = Object.fromEntries(COLOURS.map((c) => [c.value, c.label]));
