'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { getToken } from '../_lib/auth';
import { useAuthStore } from '../_store/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    if (getToken()) {
      fetchMe();
    } else {
      useAuthStore.setState({ isInitialized: true });
    }
  }, [fetchMe]);

  return <>{children}</>;
}
