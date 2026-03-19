'use client';

import { Root } from './Button.styled';
import type { ButtonProps } from './Button.types';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...rest
}: ButtonProps) {
  return (
    <Root variant={variant} size={size} fullWidth={fullWidth} {...rest}>
      {children}
    </Root>
  );
}
