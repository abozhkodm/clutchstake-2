# ClutchStake — План реализации

> Живой документ. Обновляется после каждой сессии.
> Формат лога: `[YYYY-MM-DD] Описание` + статус задачи.

---

## Лог сессий

### 2026-03-19 — Сессия 2
**Что сделали:**
- `PrismaModule` — глобальный PrismaService (`OnModuleInit/Destroy`)
- `UsersModule` — `findById`, `findBySteamId`, `createOrUpdate`
- `AuthModule` — Steam OpenID вручную (без passport-steam, совместимо с Fastify), JWT через `@nestjs/jwt` + `passport-jwt`
- `JwtAuthGuard` + `@Public()` декоратор + `@CurrentUser()` декоратор
- `WalletModule` — баланс, депозит, история транзакций
- `GamesModule` — CRUD игровых комнат (`GET/POST/DELETE`)
- `RoundsModule` — старт раунда + BullMQ delayed job (`round-timer`)
- `BettingModule` — ставка на пул, переключение с расчётом fee, preview fee
- `RedisModule` — глобальный IoRedis сервис, кеш состояния раундов
- `JobsModule` — `RoundTimerProcessor` + `PrizeDistributionProcessor` (BullMQ WorkerHost)
- Обновлён `AppModule` — все модули + `BullModule.forRootAsync` через Redis URL
- Собраны `packages/shared` в CJS (добавлен `tsconfig.json`, `build` скрипт)
- Исправлен tsconfig API (`incremental: false`, `isolatedModules: false`)
- Миграция БД `phase2_initial` применена
- API стартует: `http://localhost:3001/api`, Swagger: `/api/docs`

**Остановились на:**
> Фаза 2 полностью завершена. Следующий шаг — **Фаза 3: Real-time UI**.

**Что нужно сделать в следующей сессии:**
1. `NotificationsModule` — WebSocket Gateway (NestJS + Socket.io)
2. Интеграция WebSocket в `BettingModule` и `RoundsModule` (emit событий)
3. Фронтенд: страница `/game/[id]` — основной игровой UI
4. Компонент `GameMap` — визуализация CS2-карты с маркерами пулов
5. Компонент `PoolCard (A/B/C)` — счётчики, ставки, кнопка выбора
6. Компонент `BetPanel` — ваша ставка, кнопки переключения
7. Компонент `GameTimer` — обратный отсчёт раунда
8. `FeeCalculator` на фронте — динамический расчёт стоимости переключения

---

### 2026-03-19 — Сессия 1
**Что сделали:**
- Проанализировали whitepaper (`docs/ClutchStake.docx`)
- Определили tech stack и архитектуру
- Создали этот план (`docs/plan.md`)
- Настроили `docker-compose.yml` (PostgreSQL + Redis) + `.env.example`
- Заменили ESLint → Biome в `apps/web` и корне монорепо (`biome.json`)
- Создали `packages/shared` — Zod-схемы, enums, константы, утилиты расчёта комиссий и призов
- Создали `apps/api` — NestJS + Fastify bootstrap, Swagger, health endpoint
- Настроили `prisma/schema.prisma` — все модели и enum'ы
- Удалили `apps/docs` (boilerplate, не нужен)
- Перевели весь фронт на Emotion: `packages/ui` (Button/Card/Code → folder-based + `.styled.ts`), `apps/web` (EmotionProvider, globals.css, landing page)
- Мигрировали монорепо с npm → pnpm (`pnpm-workspace.yaml`, `workspace:*`, `.npmrc`)

**Остановились на:**
> Фаза 1 полностью завершена. Следующий шаг — **Фаза 2: Core Game** (бэкенд-модули).

**Что нужно сделать в следующей сессии:**
1. `AuthModule` — Steam OAuth + JWT (нужно до Wallet, т.к. всё завязано на userId)
2. `PrismaModule` — shared сервис БД для всех модулей
3. `WalletModule` — баланс пользователя, пополнение токенов
4. `GamesModule` — CRUD комнат, смена статусов
5. `RoundsModule` — старт/финиш раунда
6. `BettingModule` — ставка на пул, переключение, расчёт комиссии
7. BullMQ jobs: `round-timer`, `prize-distribution`
8. Redis кеш игрового состояния

---

## Суть проекта

P2E-игра на ставках: игроки выбирают один из трёх пулов (A / B / C site на CS2-карте) и ставят токены.
**Побеждает пул с наименьшим количеством игроков.** Раунды: 5 / 10 / 15 минут.
Можно переключаться между пулами за нарастающую комиссию.
Все события логируются в блокчейн TRON (провабл фейрнес).

---

## Tech Stack

### Frontend
| Инструмент | Роль |
|------------|------|
| Next.js 16+ | Основной фреймворк |
| Emotion | CSS-in-JS стили |
| TanStack Query | Серверное состояние + WebSocket |
| React Hook Form | Формы |
| Zod 4 | Валидация схем |
| Biome | Линтер + форматтер |

### Backend
| Инструмент | Роль |
|------------|------|
| NestJS + Fastify | HTTP-сервер |
| PostgreSQL | Основная БД |
| Prisma ORM | Работа с БД + миграции |
| Redis | Кеш, Pub/Sub, rate limit |
| BullMQ | Очереди (таймеры, выплаты) |
| Swagger | Документация API |
| Pino | Логирование |

### Инфраструктура
- Docker Compose — PostgreSQL + Redis
- Turborepo — монорепо

---

## Структура монорепо

```
clutchstake/
├── apps/
│   ├── web/          ← Next.js 16 frontend
│   ├── api/          ← NestJS + Fastify backend
│   └── docs/         ← документационный сайт
├── packages/
│   ├── shared/       ← Zod-схемы, общие типы, константы
│   ├── ui/           ← shared Emotion-компоненты
│   └── typescript-config/
├── docker-compose.yml
└── turbo.json
```

---

## Frontend — страницы

| Роут | Описание |
|------|----------|
| `/` | Landing / главная |
| `/auth/steam` | Редирект на Steam OAuth |
| `/lobby` | Список активных игровых комнат |
| `/game/[id]` | Игровой экран (основной UI) |
| `/profile` | Профиль, история ставок |
| `/wallet` | Депозит / вывод (крипта + CS2 скины) |

## Frontend — ключевые компоненты

- **GameMap** — визуализация CS2-карты, маркеры игроков по пулам
- **PoolCard (A/B/C)** — кол-во игроков, сумма ставок, кнопка выбора
- **BetPanel** — "Your bet", Max stake, кнопки переключения пулов
- **GameTimer** — обратный отсчёт раунда + "Next penalty in"
- **FeeCalculator** — динамический расчёт стоимости переключения пула
- **LiveChat** — глобальный чат через WebSocket
- **TransactionHistory** — лента всех событий
- **WalletBalance** — баланс в хедере

---

## Backend — модули NestJS

```
src/
├── auth/           ← Steam OAuth, JWT, сессии
├── users/          ← профили пользователей
├── wallet/         ← баланс, депозиты, выводы
├── games/          ← комнаты, параметры, состояние
├── rounds/         ← жизненный цикл раунда
├── betting/        ← ставки, переключение пулов, комиссии
├── distribution/   ← расчёт и выплата призов
├── chat/           ← глобальный чат (WS Gateway)
├── transactions/   ← лог всех событий
├── blockchain/     ← TRON интеграция
├── skins/          ← CS2 скины (third-party API)
├── notifications/  ← WebSocket Gateway (real-time)
└── common/         ← guards, interceptors, pipes
```

## Backend — BullMQ очереди

| Очередь | Назначение |
|---------|-----------|
| `round-timer` | Планирование конца раунда (delayed job) |
| `prize-distribution` | Расчёт и выплата призов после раунда |
| `blockchain-tx` | Запись событий в TRON |
| `penalty-escalation` | Обновление комиссии переключения каждую минуту |
| `skin-deposit` | Обработка входящих скин-депозитов |

## Backend — Redis

- Кеш игрового состояния (игроки по пулам, суммы ставок) — O(1) read для WS
- Pub/Sub для горизонтального масштабирования WebSocket
- Rate limiting API
- JWT blacklist

---

## База данных — Prisma модели

```prisma
User         — steamId, username, avatar, balance
GameRoom     — duration, betType, status, createdAt
Round        — gameRoomId, winnerPool, startedAt, endedAt
Stake        — userId, roundId, pool, amount, originalPool, switchFee
Transaction  — userId, type, amount, status, txHash, createdAt
ChatMessage  — userId, content, createdAt
```

**Pool** enum: `A | B | C`
**RoundStatus**: `WAITING | ACTIVE | FINISHED`
**TransactionType**: `DEPOSIT | WITHDRAWAL | STAKE | PRIZE | FEE | REFUND`

---

## Игровая механика — алгоритмы

### Комиссия переключения пула

```
baseFee = originalStake * 0.1
fee(minute) = baseFee * (1.1 ^ minute)
fee(последние 2 мин) = originalStake * 0.5   // flat rate
```

### Распределение призов

```
Победитель (наименьший пул):
  + пропорциональная доля от самого большого пула
  + ставки среднего пула - 10% (платформе)

Платформа получает:
  + 10% от среднего пула всегда
  + всё при ничье (рефанд игрокам двух равных пулов, третий → treasury)
```

### Win condition

1. Считаем кол-во игроков в каждом пуле в момент окончания раунда
2. Пул с наименьшим кол-вом → победитель
3. Ничья двух пулов → полный рефанд этим двум, весь третий → платформа

---

## Фазы разработки

### ✅ Фаза 1 — Foundation (выполнена: 2026-03-19)
- [x] Monorepo setup (Turborepo) — уже был
- [x] Next.js 16 в `apps/web` — уже был
- [x] `docker-compose.yml` — PostgreSQL 16 + Redis 7 с healthcheck
- [x] `.env.example` с переменными для БД, Redis, JWT, Steam
- [x] Biome вместо ESLint/Prettier (`biome.json` в корне)
- [x] `packages/shared` — Zod-схемы (User, GameRoom, Stake, Transaction, Chat), enums, константы, утилиты расчёта комиссии и призов
- [x] `apps/api` — NestJS + Fastify, Swagger, CORS, health endpoint
- [x] `prisma/schema.prisma` — все модели: User, GameRoom, Round, Stake, Transaction, ChatMessage + все enums
- [x] Удалён `apps/docs` (не нужен)
- [x] Фронт переведён на Emotion: `packages/ui` (folder-based компоненты), `apps/web` (EmotionProvider, landing page)
- [x] Миграция npm → pnpm (`pnpm-workspace.yaml`, `workspace:*`)

### ✅ Фаза 2 — Core Game (выполнена: 2026-03-19)
- [x] `PrismaModule` — глобальный shared DB сервис
- [x] `UsersModule` — профили пользователей
- [x] `AuthModule` — Steam OpenID + JWT (без passport-steam)
- [x] `WalletModule` — баланс, пополнение, история транзакций
- [x] `GamesModule` — CRUD комнат
- [x] `RoundsModule` — жизненный цикл раунда + BullMQ delayed job
- [x] `BettingModule` — ставки, переключение, расчёт комиссии, preview
- [x] `RedisModule` — кеш игрового состояния (пулы, суммы)
- [x] BullMQ: `round-timer` + `prize-distribution` процессоры
- [x] Миграция БД применена


### Фаза 3 - Frontend Base
- [ ] Setu

### ⏳ Фаза 4 — Real-time UI
- [ ] WebSocket Gateway (NestJS)
- [ ] GameMap компонент + real-time апдейты
- [ ] Live Chat
- [ ] Transaction History feed
- [ ] FeeCalculator на фронте

### ⏳ Фаза 5 — Integrations
- [ ] CS2 skins deposit
- [ ] TRON blockchain logging
- [ ] Crypto deposit (USDT TRC-20)
- [ ] PWA конфигурация (mobile)

### ⏳ Фаза 6 — Polish
- [ ] Admin панель
- [ ] Responsible gambling (лимиты, self-exclusion)
- [ ] Swagger документация финализация
- [ ] E2E тесты

---

## Docker Compose

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: clutchstake
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis_data:/data]

volumes:
  postgres_data:
  redis_data:
```

---

## Внешние интеграции

| Интеграция | Назначение |
|-----------|-----------|
| **Steam OpenID** | Авторизация пользователей |
| **TRON blockchain** | Депозиты, провабл фейрнес, лог событий |
| **CS2 Skins API** | Приём/оценка скинов (SteamApis / Buff163) |
| **Crypto gateway** | USDT приём (TRC-20) |

---

## Полезные ссылки

- Miro user flow: https://miro.com/welcomeonboard/TW0zckE2YlVVYWV2ODZNaUhZU1Z5emVWMXc2SWxqVk1la0sycUNRR3B3c1JISkZhaXpyY1dBZTdBaVpnYy9BZEdQY1MxUlFEaE9yMkl2Sm5WQXUzQnZnRkFRZFVhM1hYZ3ppdWpUVTVXTU41a1dNSFBJTG4wSC95NnJjZVJVYlhBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=53931400475
- Оригинальный whitepaper: `docs/ClutchStake.docx`
