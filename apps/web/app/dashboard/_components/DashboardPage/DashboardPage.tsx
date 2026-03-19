'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../_store/auth.store';
import {
  ActionRow,
  Avatar,
  AvatarWrapper,
  Card,
  OnlineDot,
  PrimaryButton,
  Root,
  SecondaryButton,
  StatCard,
  StatLabel,
  StatValue,
  StatsRow,
  SteamId,
  Username,
} from './DashboardPage.styled';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  if (!user) return null;

  return (
    <Root>
      <Card>
        <AvatarWrapper>
          <Avatar src={user.avatar} alt={user.username} />
          <OnlineDot />
        </AvatarWrapper>

        <Username>{user.username}</Username>
        <SteamId>Steam ID: {user.steamId}</SteamId>

        <StatsRow>
          <StatCard>
            <StatValue>{user.balance}</StatValue>
            <StatLabel>Balance</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>—</StatValue>
            <StatLabel>Games played</StatLabel>
          </StatCard>
        </StatsRow>

        <ActionRow>
          <PrimaryButton onClick={() => router.push('/lobby')}>Play now</PrimaryButton>
          <SecondaryButton onClick={logout}>Sign out</SecondaryButton>
        </ActionRow>
      </Card>
    </Root>
  );
}
