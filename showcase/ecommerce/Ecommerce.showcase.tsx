/* ecommerce showcase (REQ-QUAL-58, tier S2, default scene photo).
   Composes public entries directly (contract §3.3): a product detail page with a
   photo rail, option controls, a prominent add-to-cart Button, a cart Sheet and Toast.
   Material roles: the TopBar, Sheet and Toast are the glass layers over the scene;
   page content sits on content-raised Cards, photos in content-sunken frames. */
import * as React from 'react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Field,
  Fieldset,
  Heading,
  NumberField,
  Pagination,
  RadioGroup,
  Rating,
  Select,
  Separator,
  Sheet,
  Stack,
  Surface,
  Text,
  Toast,
  useToast,
} from 'aura-glass';
import { AppShell, TopBar } from 'aura-glass/app-shell';
import { CarouselRail } from 'aura-glass/media';
import {
  BREADCRUMBS,
  CART,
  COLOUR_LABELS,
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

const CART_COUNT = CART.reduce((n, i) => n + i.quantity, 0);

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
                  <Surface layer="content" content="content-sunken" className={styles.cartThumb}>
                    <img className={styles.photo} src={i.image} alt="" width={960} height={960} />
                  </Surface>
                  <div className={styles.cartText}>
                    <Text weight="medium">{i.name}</Text>
                    <Text type="caption" muted>
                      {i.variant} · Qty {i.quantity}
                    </Text>
                  </div>
                  <Text weight="medium">{formatPrice(i.price * i.quantity)}</Text>
                </li>
              ))}
            </ul>
            <Separator />
            <dl className={styles.totals}>
              <div className={styles.totalRow}>
                <Text render={<dt />} muted>{COPY.subtotal}</Text>
                <Text render={<dd />}>{formatPrice(subtotal)}</Text>
              </div>
              <div className={styles.totalRow}>
                <Text render={<dt />} muted>{COPY.shipping}</Text>
                <Text render={<dd />}>{formatPrice(SHIPPING)}</Text>
              </div>
              <div className={styles.totalRow}>
                <Text render={<dt />} weight="semibold">{COPY.total}</Text>
                <Text render={<dd />} weight="semibold">{formatPrice(subtotal + SHIPPING)}</Text>
              </div>
            </dl>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close render={<Button variant="clear" />} aria-label={undefined}>
              {COPY.continueShopping}
            </Sheet.Close>
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
      <div className={styles.galleryCell}>
        <Surface layer="content" content="content-sunken" className={styles.gallery}>
          <CarouselRail.Root label={COPY.galleryLabel} slides={slides} slidesPerView={1} />
        </Surface>
      </div>
      <div className={styles.buyBox}>
        <div className={styles.titleBlock}>
          <Heading level={1} size="title-1" id="ec-product">
            {COPY.productName}
          </Heading>
          <Stack direction="row" align="center" gap={2} wrap>
            <Rating value={4.5} allowHalf readOnly aria-label="Rated 4.5 out of 5" />
            <Text type="caption" muted>{COPY.reviewSummary}</Text>
          </Stack>
        </div>
        <Text size="lg" weight="semibold" className={styles.price}>
          {formatPrice(COPY.productPrice)}
        </Text>
        <Text muted>{COPY.productBlurb}</Text>
        <Separator />
        <Field.Root>
          <Field.Label>{COPY.colourLabel}</Field.Label>
          <Select.Root defaultValue="fog" items={COLOUR_LABELS}>
            <Select.Trigger placeholder="Choose upholstery" />
            <Select.Content>
              {COLOURS.map((c) => (
                <Select.Item key={c.value} value={c.value} label={c.label} />
              ))}
            </Select.Content>
          </Select.Root>
        </Field.Root>
        <NumberField label={COPY.quantityLabel} defaultValue={1} min={1} max={8} />
        <Fieldset legend={COPY.deliveryLabel}>
          <RadioGroup.Root defaultValue="standard" aria-label={COPY.deliveryLabel}>
            {DELIVERY.map((d) => (
              <RadioGroup.Item key={d.value} value={d.value}>{d.label}</RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </Fieldset>
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
        <div className={styles.notes}>
          <Text type="caption">{COPY.inStock}</Text>
          <Text type="caption" muted>
            Order today, standard delivery arrives by {arrives}. {COPY.shippingNote}
          </Text>
        </div>
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

/** Fragment wrapper with its own toast provider: the product block on its content card. */
export function EcommerceProductFragment() {
  return (
    <Toast.Provider>
      <Card.Root className={styles.card}>
        <EcommerceProductDetail />
      </Card.Root>
      <Toasts />
    </Toast.Provider>
  );
}

export function Ecommerce({ now = SHOWCASE_EPOCH }: EcommerceProps) {
  const [cartOpen, setCartOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  return (
    <Toast.Provider>
      <AppShell.Root defaultSidebar="collapsed">
        <AppShell.SkipLink href="#ec-main">{COPY.skip}</AppShell.SkipLink>
        <TopBar.Root>
          <TopBar.Leading>
            <TopBar.Title>{COPY.store}</TopBar.Title>
          </TopBar.Leading>
          <TopBar.Trailing>
            <nav aria-label="Store">
              <Button variant="clear" onClick={() => setCartOpen(true)} aria-label={`${COPY.cart}, ${CART_COUNT} items`}>
                {COPY.cart} <Badge count={CART_COUNT} />
              </Button>
            </nav>
          </TopBar.Trailing>
        </TopBar.Root>
        <AppShell.Main id="ec-main" tabIndex={-1}>
          <div className={styles.page}>
            <Card.Root className={styles.card}>
              <Breadcrumbs.Root>
                {BREADCRUMBS.map((b) => (
                  <Breadcrumbs.Item key={b.href}>
                    <Breadcrumbs.Link href={b.href}>{b.label}</Breadcrumbs.Link>
                  </Breadcrumbs.Item>
                ))}
                <Breadcrumbs.Current>{COPY.productName}</Breadcrumbs.Current>
              </Breadcrumbs.Root>
              <EcommerceProductDetail now={now} onAdded={() => setCartOpen(true)} />
            </Card.Root>
            <Card.Root className={styles.card} render={<section aria-labelledby="ec-related" />}>
              <Heading level={2} size="title-3" id="ec-related">
                {COPY.relatedHeading}
              </Heading>
              <ul className={styles.relatedList}>
                {RELATED.map((r) => (
                  <li key={r.id} className={styles.relatedItem}>
                    <Surface layer="content" content="content-sunken" className={styles.frame}>
                      <img className={styles.photo} src={r.image} alt="" width={960} height={960} />
                    </Surface>
                    <Heading level={3} size="sm">{r.name}</Heading>
                    <Text muted>{formatPrice(r.price)}</Text>
                  </li>
                ))}
              </ul>
            </Card.Root>
            <Card.Root className={styles.card} render={<section aria-labelledby="ec-reviews" />}>
              <Stack direction="row" align="baseline" gap={3} wrap>
                <Heading level={2} size="title-3" id="ec-reviews">
                  {COPY.reviewsHeading}
                </Heading>
                <Text type="caption" muted>{COPY.reviewSummary}</Text>
              </Stack>
              <ul className={styles.reviewList}>
                {REVIEWS.map((r, i) => (
                  <li key={r.id} className={styles.review}>
                    {i > 0 ? <Separator /> : null}
                    <Stack direction="row" align="center" gap={3} wrap>
                      <Rating value={r.rating} readOnly aria-label={`${r.rating} out of 5`} />
                      <Heading level={3} size="sm">{r.author}</Heading>
                      <Text type="caption" muted>{r.date}</Text>
                    </Stack>
                    <Text>{r.text}</Text>
                  </li>
                ))}
              </ul>
              <Pagination.Root aria-label="Review pages" page={page} pageCount={6} onPageChange={setPage} />
            </Card.Root>
          </div>
        </AppShell.Main>
      </AppShell.Root>
      <EcommerceCartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <Toasts />
    </Toast.Provider>
  );
}
