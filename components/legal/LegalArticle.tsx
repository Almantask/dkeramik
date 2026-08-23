'use client';

import { useLanguage } from '@/lib/i18n';

export function LegalArticle({
  titleKey,
  bodyKey,
}: {
  titleKey: 'termsTitle' | 'returnsTitle' | 'privacyTitle';
  bodyKey: 'termsBody' | 'returnsBody' | 'privacyBody';
}) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-clay-50">
      <article className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-playfair text-3xl text-clay-700 mb-8">{t.legal[titleKey]}</h1>
        {t.legal[bodyKey].map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-clay-600 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </article>
    </div>
  );
}
