/* ecommerce showcase (REQ-QUAL-58, tier S2, default scene photo).
   Composes public entries directly (contract §3.3): a product detail page with a
   photo rail, option controls, a prominent add-to-cart Button, a cart Sheet and Toast. */
import * as React from 'react';
import {
  Breadcrumbs,
  Button,
  Field,
  NumberField,
  Pagination,
  RadioGroup,
  Select,
  Sheet,
  Toast,
  useToast,
} from 'aura-glass';
import { AppShell } from 'aura-glass/app-shell';
import { CarouselRail } from 'aura-glass/media';
import {
  BREADCRUMBS,
  CART,
  COLOURS,
  COPY,
  DELIVERY,
  GALLERY,
  RELATED,
  REVIEWS,
  SHIPPING,
  SHOWCASE_EPOCH,
  formatPrice,
} from './copy';
import styles from './ecommerce.module.css';

export interface EcommerceProps {
  /** Fixed epoch (REQ-QUAL-59 determinism); the delivery estimate derives from it. */
  now?: number;
}

/** Fragment: the cart Sheet. */
export function EcommerceCartSheet({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const subtotal = CART.reduce((s, i) => s + i.price * i.quantity, 0);
  return (
    <Sheet.Root
      side="end"
      {...(open !== undefined ? { open } : { defaultOpen: true })}
      {...(onOpenChange ? { onOpenChange: (o: boolean) => onOpenChange(o) } : {})}
    >
      <Sheet.Portal>
        <Sheet.Backdrop />
        <Sheet.Popup>
          <Sheet.Header>
            <Sheet.Title>{COPY.cartTitle}</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <ul className={styles.cartList}>
              {CART.map((i) => (
                <li key={i.id} className={styles.cartItem}>
                  <span>{i.name}</span>
                  <span>× {i.quantity}</span>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className={styles.totals}>
              <div className={styles.totalRow}>
                <dt>{COPY.subtotal}</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>{COPY.shipping}</dt>
                <dd>{formatPrice(SHIPPING)}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>{COPY.total}</dt>
                <dd>{formatPrice(subtotal + SHIPPING)}</dd>
              </div>
            </dl>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close>{COPY.continueShopping}</Sheet.Close>
            <Button prominent>{COPY.checkout}</Button>
          </Sheet.Footer>
        </Sheet.Popup>
      </Sheet.Portal>
    </Sheet.Root>
  );
}

/** Fragment: the product detail block (gallery + options + add to cart). */
export function EcommerceProductDetail({ now = SHOWCASE_EPOCH, onAdded }: EcommerceProps & { onAdded?: () => void }) {
  const toast = useToast();
  const arrives = new Date(now + 6 * 86_400_000).toISOString().slice(0, 10);
  const slides = GALLERY.map((g) => ({
    id: g.id,
    label: g.alt,
    children: <img className={styles.photo} src={g.src} alt={g.alt} width={960} height={960} />,
  }));
  return (
    <section className={styles.product} aria-labelledby="ec-product">
      <CarouselRail.Root label={COPY.galleryLabel} slides={slides} slidesPerView={1} />
      <div className={styles.buyBox}>
        <h1 id="ec-product">{COPY.productName}</h1>
        <p className={styles.price}>{formatPrice(COPY.productPrice)}</p>
        <p>{COPY.productBlurb}</p>
        <Field.Root>
          <Field.Label>{COPY.colourLabel}</Field.Label>
          <Select.Root defaultValue="fog">
            <Select.Trigger placeholder="Fog grey" />
            <Select.Content>
              {COLOURS.map((c) => (
                <Select.Item key={c.value} value={c.value} label={c.label} />
              ))}
            </Select.Content>
          </Select.Root>
        </Field.Root>
        <NumberField label={COPY.quantityLabel} defaultValue={1} min={1} max={8} />
        <fieldset className={styles.fieldset}>
          <legend>{COPY.deliveryLabel}</legend>
          <RadioGroup.Root defaultValue="standard" aria-label={COPY.deliveryLabel}>
            {DELIVERY.map((d) => (
              <RadioGroup.Item key={d.value} value={d.value}>{d.label}</RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </fieldset>
        <p>Order today, standard delivery arrives by {arrives}.</p>
        <Button
          prominent
          size="lg"
          onClick={() => {
            toast.add({ title: COPY.added, description: COPY.addedBody, intent: 'success' });
            onAdded?.();
          }}
        >
          {COPY.addToCart}
        </Button>
      </div>
    </section>
  );
}

function Toasts() {
  const toast = useToast();
  return (
    <Toast.Viewport>
      {toast.toasts.map((t) => (
        <Toast.Root key={t.id} toast={t}>
          <Toast.Title>{t.title}</Toast.Title>
          <Toast.Description>{t.description}</Toast.Description>
          <Toast.Close>Dismiss</Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

/** Fragment wrapper with its own toast provider. */
export function EcommerceProductFragment() {
  return (
    <Toast.Provider>
      <EcommerceProductDetail />
      <Toasts />
    </Toast.Provider>
  );
}

export function Ecommerce({ now = SHOWCASE_EPOCH }: EcommerceProps) {
  const [cartOpen, setCartOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  return (
    <Toast.Provider>
      <AppShell.SkipLink href="#ec-main">{COPY.skip}</AppShell.SkipLink>
      <header className={styles.header}>
        <p className={styles.store}>{COPY.store}</p>
        <nav aria-label="Store">
          <Button variant="clear" onClick={() => setCartOpen(true)}>
            Cart ({CART.reduce((n, i) => n + i.quantity, 0)})
          </Button>
        </nav>
      </header>
      <main id="ec-main" tabIndex={-1} className={styles.page}>
        <Breadcrumbs.Root>
          {BREADCRUMBS.map((b) => (
            <Breadcrumbs.Item key={b.href}>
              <Breadcrumbs.Link href={b.href}>{b.label}</Breadcrumbs.Link>
            </Breadcrumbs.Item>
          ))}
          <Breadcrumbs.Current>{COPY.productName}</Breadcrumbs.Current>
        </Breadcrumbs.Root>
        <EcommerceProductDetail now={now} onAdded={() => setCartOpen(true)} />
        <section className={styles.related} aria-labelledby="ec-related">
          <h2 id="ec-related">{COPY.relatedHeading}</h2>
          <ul className={styles.relatedList}>
            {RELATED.map((r) => (
              <li key={r.id} className={styles.relatedItem}>
                <img className={styles.photo} src={r.image} alt="" width={960} height={960} />
                <h3>{r.name}</h3>
                <p>{formatPrice(r.price)}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.reviews} aria-labelledby="ec-reviews">
          <h2 id="ec-reviews">{COPY.reviewsHeading}</h2>
          <ul className={styles.reviewList}>
            {REVIEWS.map((r) => (
              <li key={r.id}>
                <h3>
                  {r.author} — {r.rating} of 5
                </h3>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
          <Pagination.Root aria-label="Review pages" page={page} pageCount={6} onPageChange={setPage} />
        </section>
      </main>
      <EcommerceCartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <Toasts />
    </Toast.Provider>
  );
}
