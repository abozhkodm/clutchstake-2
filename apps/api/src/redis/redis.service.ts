import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface RoundPoolState {
  count: number;
  total: number;
}

export interface RoundCacheState {
  poolA: RoundPoolState;
  poolB: RoundPoolState;
  poolC: RoundPoolState;
}

const ROUND_STATE_TTL_SECONDS = 60 * 60; // 1 hour

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis(this.config.getOrThrow<string>('REDIS_URL'));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  private roundKey(roundId: string) {
    return `round:${roundId}:state`;
  }

  async getRoundState(roundId: string): Promise<RoundCacheState> {
    const raw = await this.client.get(this.roundKey(roundId));
    if (!raw) {
      return {
        poolA: { count: 0, total: 0 },
        poolB: { count: 0, total: 0 },
        poolC: { count: 0, total: 0 },
      };
    }
    return JSON.parse(raw) as RoundCacheState;
  }

  async setRoundState(roundId: string, state: RoundCacheState): Promise<void> {
    await this.client.set(this.roundKey(roundId), JSON.stringify(state), 'EX', ROUND_STATE_TTL_SECONDS);
  }

  async addBetToPool(roundId: string, pool: 'A' | 'B' | 'C', amount: number): Promise<RoundCacheState> {
    const state = await this.getRoundState(roundId);
    const key = `pool${pool}` as keyof RoundCacheState;
    state[key].count += 1;
    state[key].total += amount;
    await this.setRoundState(roundId, state);
    return state;
  }

  async switchBetPool(
    roundId: string,
    fromPool: 'A' | 'B' | 'C',
    toPool: 'A' | 'B' | 'C',
    amount: number,
  ): Promise<RoundCacheState> {
    const state = await this.getRoundState(roundId);
    const fromKey = `pool${fromPool}` as keyof RoundCacheState;
    const toKey = `pool${toPool}` as keyof RoundCacheState;

    state[fromKey].count = Math.max(0, state[fromKey].count - 1);
    state[fromKey].total = Math.max(0, state[fromKey].total - amount);
    state[toKey].count += 1;
    state[toKey].total += amount;

    await this.setRoundState(roundId, state);
    return state;
  }

  async deleteRoundState(roundId: string): Promise<void> {
    await this.client.del(this.roundKey(roundId));
  }
}
