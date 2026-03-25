'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-clay-100 border-t border-clay-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-xl text-clay-600 font-semibold mb-4">
              DKeramik
            </h3>
            <p className="text-clay-600 text-sm leading-relaxed">
              {t.common.handcraftedWith}
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="font-nunito text-xs font-semibold text-clay-700 mb-4 uppercase tracking-widest">
              {t.footer.exploreHeading}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/portfolio"
                  className="text-clay-600 hover:text-clay-500 text-sm transition-colors"
                >
                  {t.footer.links.portfolio}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-clay-600 hover:text-clay-500 text-sm transition-colors"
                >
                  {t.footer.links.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="text-clay-600 hover:text-clay-500 text-sm transition-colors"
                >
                  {t.footer.links.journal}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-nunito text-xs font-semibold text-clay-700 mb-4 uppercase tracking-widest">
              {t.footer.contactHeading}
            </h4>
            <p className="text-clay-600 text-sm leading-relaxed mb-3">
              {t.footer.contactPrompt}
            </p>
            <a
              href={`mailto:${t.footer.contactEmail}`}
              className="text-clay-600 hover:text-clay-500 text-sm transition-colors underline"
            >
              {t.footer.contactEmail}
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-clay-200 text-center">
          <p className="text-clay-600 text-sm italic leading-relaxed whitespace-pre-line">
            {t.footer.tagline}
          </p>
          <p className="text-clay-500 text-xs mt-2">
            © {year} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
