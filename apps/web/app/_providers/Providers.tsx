'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { EmotionProvider } from './EmotionProvider';
import { QueryProvider } from './QueryProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <EmotionProvider>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </EmotionProvider>
  );
}
