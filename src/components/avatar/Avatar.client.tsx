/* CMP-310/CMP-422: Avatar on BU Avatar (Root/Image/Fallback). Root accepts
   src + required alt (dev warning when missing on a src'd avatar) + name →
   initials fallback with aria-label, and auto-composes the parts when no
   children are given; parts [root, image, fallback]; root SizeProps. */
'use client';
import * as React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cn } from '../../internal/index';

export interface AvatarRootProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'prefix'> {
  src?: string;
  /** Required whenever `src` is set (dev-warned otherwise). */
  alt?: string;
  /** Full name used to derive initials for the fallback. */
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  /** ms before the fallback appears while the image loads (BU). */
  delay?: number;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? '';
  const b = parts.length > 1 ? parts[parts.length - 1]![0] : '';
  return (a + b).toUpperCase() || '?';
}

function Root({
  src,
  alt,
  name,
  size = 'md',
  delay,
  children,
  className,
  ref,
  ...rest
}: AvatarRootProps & { ref?: React.Ref<HTMLSpanElement> | undefined }) {
  if (process.env.NODE_ENV !== 'production' && src && alt === undefined) {
    console.error('[aura-glass] Avatar: `alt` is required whenever `src` is provided.');
  }
  return (
    <BaseAvatar.Root
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-size={size}
      aria-label={name && !src ? name : rest['aria-label']}
      className={cn('ag-avatar', className)}
    >
      {children ?? (
        <>
          {src ? <Image src={src} alt={alt ?? ''} /> : null}
          <Fallback delay={delay}>{name ? initials(name) : null}</Fallback>
        </>
      )}
    </BaseAvatar.Root>
  );
}

function Image(props: React.ComponentProps<typeof BaseAvatar.Image>) {
  return <BaseAvatar.Image data-ag-part="image" keepMounted {...props} />;
}

function Fallback(props: React.ComponentProps<typeof BaseAvatar.Fallback>) {
  return <BaseAvatar.Fallback data-ag-part="fallback" {...props} />;
}

export const Avatar = { Root, Image, Fallback };
