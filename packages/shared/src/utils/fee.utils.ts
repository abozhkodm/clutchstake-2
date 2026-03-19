import {
  FINAL_TWO_MINUTES_THRESHOLD,
  SWITCH_FEE_BASE_MULTIPLIER,
  SWITCH_FEE_FINAL_TWO_MINUTES_FLAT,
  SWITCH_FEE_PER_MINUTE_MULTIPLIER,
} from '../constants';

/**
 * Calculate the fee for switching pools mid-game.
 *
 * baseFee = originalStake * 0.1
 * fee(minute) = baseFee * (1.1 ^ minutesElapsed)
 * fee(last 2 min) = originalStake * 0.5 (flat)
 */
export function calculateSwitchFee(
  originalStake: number,
  minutesElapsed: number,
  totalDurationMinutes: number,
): number {
  const minutesRemaining = totalDurationMinutes - minutesElapsed;

  if (minutesRemaining <= FINAL_TWO_MINUTES_THRESHOLD) {
    return originalStake * SWITCH_FEE_FINAL_TWO_MINUTES_FLAT;
  }

  const baseFee = originalStake * SWITCH_FEE_BASE_MULTIPLIER;
  return baseFee * Math.pow(SWITCH_FEE_PER_MINUTE_MULTIPLIER, minutesElapsed);
}

/**
 * Calculate prize distribution after round ends.
 * Returns amounts for each party: winners, platform, refunds.
 */
export function calculatePrizeDistribution(pools: {
  poolA: { playerCount: number; totalStaked: number };
  poolB: { playerCount: number; totalStaked: number };
  poolC: { playerCount: number; totalStaked: number };
}): {
  winnerPool: 'A' | 'B' | 'C' | 'TIE';
  winnersShare: number;
  platformShare: number;
  refundPool: 'A' | 'B' | 'C' | null;
} {
  const ranked = [
    { pool: 'A' as const, ...pools.poolA },
    { pool: 'B' as const, ...pools.poolB },
    { pool: 'C' as const, ...pools.poolC },
  ].sort((a, b) => a.playerCount - b.playerCount);

  const [smallest, middle, largest] = ranked as [typeof ranked[0], typeof ranked[0], typeof ranked[0]];

  // Tie between two smallest pools
  if (smallest.playerCount === middle.playerCount) {
    return {
      winnerPool: 'TIE',
      winnersShare: 0,
      platformShare: largest.totalStaked,
      refundPool: null,
    };
  }

  const platformShare = middle.totalStaked * 0.1;
  const winnersShare = largest.totalStaked + (middle.totalStaked - platformShare);

  return {
    winnerPool: smallest.pool,
    winnersShare,
    platformShare,
    refundPool: null,
  };
}
