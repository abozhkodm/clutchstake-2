import type { Metadata } from 'next';
import { AuthPage } from './_components/AuthPage';

export const metadata: Metadata = {
  title: 'Sign In — ClutchStake',
  description: 'Sign in with Steam to start playing ClutchStake.',
};

export default function AuthRoute() {
  return <AuthPage />;
}
