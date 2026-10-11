// registry/blocks/commerce-cart/ProductCard.tsx — SURF-585 (AC-SURF-26).
// Product tile on Card (content-raised; no material prop, SC-24). Price is
// formatted with Intl.NumberFormat against the provider locale + currency.
// The add control is >=24x24 px (>=44x44 under pointer:coarse).
import { Badge, Button, Card } from 'aura-glass';
import { formatMoney } from './format-money';

export interface ProductCardProps {
  title: string;
  price: { amount: number; currency: string };
  image?: { src: string; alt: string };
  badge?: string;
  href?: string;
  onAddToCart?: () => void;
  /** BCP-47 tag, e.g. 'en-US' */
  locale?: string;
}

export function ProductCard({
  title,
  price,
  image,
  badge,
  href,
  onAddToCart,
  locale = 'en-US',
}: ProductCardProps) {
  const addStyle = {
    minWidth: 24,
    minHeight: 24,
    ['@media (pointer: coarse)' as string]: undefined,
  } as const;
  return (
    <Card.Root data-ag-part="root" data-variant="content-raised">
      <article data-ag-part="article">
        {image ? (
          <img data-ag-part="image" src={image.src} alt={image.alt} />
        ) : null}
        <Card.Body>
          <Card.Title data-ag-part="title">
            {href ? <a href={href} data-ag-part="title-link">{title}</a> : title}
          </Card.Title>
          {badge ? <Badge data-ag-part="badge">{badge}</Badge> : null}
          <span data-ag-part="price">{formatMoney(price.amount, price.currency, locale)}</span>
          {onAddToCart ? (
            <Button
              data-ag-part="add"
              aria-label={`add ${title} to cart`}
              style={{ minWidth: addStyle.minWidth, minHeight: addStyle.minHeight }}
              onClick={onAddToCart}
            >
              Add to cart
            </Button>
          ) : null}
        </Card.Body>
      </article>
    </Card.Root>
  );
}

export default ProductCard;
