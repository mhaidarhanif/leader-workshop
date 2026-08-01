import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'rounded-full border border-transparent bg-primary px-3 py-1 text-base text-primary-foreground',
        secondary:
          'rounded-full border border-transparent bg-secondary px-3 py-1 text-base text-secondary-foreground',
        outline: 'rounded-full border border-border px-3 py-1 text-base text-foreground',
        success:
          'rounded-md border border-transparent bg-primary/15 px-2.5 py-0.5 text-sm text-primary',
        muted:
          'rounded-md border border-transparent bg-muted px-2.5 py-0.5 text-sm text-muted-foreground',
        rank: 'rounded-md border border-border bg-card px-2 py-0.5 font-mono text-sm tabular-nums',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
