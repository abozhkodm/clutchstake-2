'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import type { ReactNode } from 'react';

const cache = createCache({ key: 'cs' });

export function EmotionProvider({ children }: { children: ReactNode }) {
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
