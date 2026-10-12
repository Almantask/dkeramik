'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LANDING_ONLY } from '@/lib/site-config';

/** Wraps every page; in landing-only mode it drops the chrome and hides all routes but "/". */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hidden = LANDING_ONLY && pathname !== '/';

  useEffect(() => {
    if (hidden) router.replace('/');
  }, [hidden, router]);

  if (LANDING_ONLY) {
    return hidden ? null : <main>{children}</main>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
