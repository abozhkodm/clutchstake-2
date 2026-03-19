'use client';

import { Button } from '@repo/ui/Button';
import {
  Actions,
  Badge,
  Root,
  StatDivider,
  StatItem,
  StatLabel,
  StatValue,
  StatsRow,
  Subtitle,
  Title,
} from './LandingHero.styled';

const STATS = [
  { value: '15 min', label: 'Max round' },
  { value: '3', label: 'Pools' },
  { value: '10%', label: 'Platform fee' },
  { value: 'TRON', label: 'Blockchain' },
];

export function LandingHero() {
  return (
    <Root>
      <Badge>⚡ P2E Betting Game</Badge>

      <Title>
        Pick your site.
        <br />
        <span>Win the clutch.</span>
      </Title>

      <Subtitle>
        Stake tokens on A, B, or C site. The least-picked pool takes the prize.
        Switch pools mid-game — if you dare.
      </Subtitle>

      <Actions>
        <Button size="lg" variant="primary">
          Enter Lobby
        </Button>
        <Button size="lg" variant="secondary">
          How it works
        </Button>
      </Actions>

      <StatsRow>
        {STATS.map((stat, i) => (
          <>
            <StatItem key={stat.label}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
            {i < STATS.length - 1 && <StatDivider key={`divider-${i}`} />}
          </>
        ))}
      </StatsRow>
    </Root>
  );
}
