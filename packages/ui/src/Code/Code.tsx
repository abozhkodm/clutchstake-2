import { Root } from './Code.styled';
import type { CodeProps } from './Code.types';

export function Code({ children }: CodeProps) {
  return <Root>{children}</Root>;
}
