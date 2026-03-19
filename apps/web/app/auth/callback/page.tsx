'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { setToken } from '../../_lib/auth';
import { useAuthStore } from '../../_store/auth.store';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.replace('/auth');
      return;
    }

    setToken(token);

    fetchMe().then(() => {
      router.replace('/dashboard');
    });
  }, [searchParams, router, fetchMe]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '15px',
        fontFamily: 'var(--font-geist-sans)',
      }}
    >
      Signing you in…
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
