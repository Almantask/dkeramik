import type { Metadata } from 'next';
import ClassicHome from '@/components/home/ClassicHome';
import BloomingLanding from '@/components/landing/BloomingLanding';
import { LANDING_ONLY } from '@/lib/site-config';

export const metadata: Metadata = LANDING_ONLY ? { title: 'DKeramik - Laukiam kol pražys' } : {};

export default function Home() {
  return LANDING_ONLY ? <BloomingLanding /> : <ClassicHome />;
}
