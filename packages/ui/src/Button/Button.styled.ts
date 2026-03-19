import styled from '@emotion/styled';
import type { ButtonSize, ButtonVariant } from './Button.types';

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    background: #6c47ff;
    color: #ffffff;
    border: 1.5px solid transparent;
    &:hover:not(:disabled) { background: #7d5cff; }
    &:active:not(:disabled) { background: #5a3be0; }
  `,
  secondary: `
    background: transparent;
    color: #c8c8d8;
    border: 1.5px solid #3a3a4e;
    &:hover:not(:disabled) { border-color: #6c47ff; color: #ffffff; }
    &:active:not(:disabled) { border-color: #5a3be0; }
  `,
  ghost: `
    background: transparent;
    color: #a0a0b8;
    border: 1.5px solid transparent;
    &:hover:not(:disabled) { background: rgba(108, 71, 255, 0.1); color: #ffffff; }
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: `font-size: 12px; padding: 6px 12px; border-radius: 6px;`,
  md: `font-size: 14px; padding: 10px 20px; border-radius: 8px;`,
  lg: `font-size: 16px; padding: 14px 28px; border-radius: 10px;`,
};

export const Root = styled.button<{ variant: ButtonVariant; size: ButtonSize; fullWidth: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ variant }) => variantStyles[variant]}
  ${({ size }) => sizeStyles[size]}
`;
