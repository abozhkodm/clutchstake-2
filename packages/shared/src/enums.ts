export enum Pool {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum RoundStatus {
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  STAKE = 'STAKE',
  PRIZE = 'PRIZE',
  FEE = 'FEE',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum BetType {
  ONE_USDT = 'ONE_USDT',
  FIVE_USDT = 'FIVE_USDT',
  CUSTOM = 'CUSTOM',
}

export enum GameDuration {
  FIVE = 5,
  TEN = 10,
  FIFTEEN = 15,
}
