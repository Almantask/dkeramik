'use client';

import CeramicBackground from '@/components/ui/CeramicBackground';
import { useLanguage } from '@/lib/i18n';

// Simple inline SVG icons for the process steps
const processIcons = [
  // Centering — concentric circles
  <svg key="center" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <circle cx="20" cy="20" r="3" /><circle cx="20" cy="20" r="8" /><circle cx="20" cy="20" r="14" />
  </svg>,
  // Shaping — hands
  <svg key="shape" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M 10 28 Q 10 18, 15 15 L 15 10 Q 15 8, 17 8 Q 19 8, 19 10 L 19 18 Q 21 16, 23 16 Q 25 16, 25 18 L 25 28 Q 25 33, 18 33 Q 11 33, 10 28" />
  </svg>,
  // Firing — flame
  <svg key="fire" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M 20 32 Q 10 28, 12 20 Q 14 14, 18 10 Q 16 16, 20 18 Q 18 12, 22 8 Q 26 14, 24 20 Q 28 16, 26 24 Q 28 20, 30 22 Q 30 30, 20 32" />
  </svg>,
  // Finishing — sparkle
  <svg key="finish" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <line x1="20" y1="6" x2="20" y2="14" /><line x1="20" y1="26" x2="20" y2="34" />
    <line x1="6" y1="20" x2="14" y2="20" /><line x1="26" y1="20" x2="34" y2="20" />
    <line x1="10" y1="10" x2="16" y2="16" /><line x1="24" y1="24" x2="30" y2="30" />
    <line x1="30" y1="10" x2="24" y2="16" /><line x1="16" y1="24" x2="10" y2="30" />
  </svg>,
];

export default function CraftPage() {
  const { t } = useLanguage();
  const c = t.craft;

  return (
    <div className="relative bg-clay-50 min-h-screen">
      <CeramicBackground />

      {/* Hero */}
      <div className="relative z-10 bg-clay-100 border-b border-clay-200 py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 text-center">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-clay-600 mb-4">
            {c.headline}
          </h1>
          <p className="text-clay-600 leading-relaxed max-w-xl mx-auto">{c.subheadline}</p>
        </div>
      </div>

      {/* Intro */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 py-14">
        <p className="text-clay-600 leading-loose text-base">{c.intro}</p>
      </div>

      {/* Steps */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-16">
        <div className="space-y-10">
          {c.steps.map((step, idx) => (
            <div key={idx} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-clay-400 mt-1">
                <span className="font-playfair text-2xl text-clay-300">{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <h3 className="font-playfair text-xl text-clay-600 mb-2">{step.title}</h3>
                <p className="text-clay-600 leading-loose">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process icons summary */}
      <div className="relative z-10 bg-clay-100 py-14 mt-4">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {c.processLabels.map((label, idx) => (
              <div key={idx} className="text-center text-clay-400">
                <div className="flex justify-center mb-3">{processIcons[idx]}</div>
                <p className="font-nunito text-sm text-clay-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closing */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 py-14 text-center">
        <p className="font-playfair italic text-clay-500 text-xl">{c.closing}</p>
      </div>
    </div>
  );
}
