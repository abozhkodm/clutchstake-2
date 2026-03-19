import type { Metadata } from 'next';
import { DashboardPage } from './_components/DashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard — ClutchStake',
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
