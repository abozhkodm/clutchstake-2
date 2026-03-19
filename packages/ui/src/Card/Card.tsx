import { Body, Root, Title } from './Card.styled';
import type { CardProps } from './Card.types';

export function Card({ title, children, accent }: CardProps) {
  return (
    <Root accent={accent}>
      <Title>{title}</Title>
      <Body>{children}</Body>
    </Root>
  );
}
