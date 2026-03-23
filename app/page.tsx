'use client';

import Link from 'next/link';
import CeramicBackground from '@/components/ui/CeramicBackground';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n';

export default function Home() {
  const { t } = useLanguage();
  const h = t.home;

  // Split headline on \n for line breaks
  const headlineLines = h.headline.split('\n');

  return (
    <div className="relative bg-clay-50 min-h-screen">
      {/* Full-page ceramic background pattern (very low opacity) */}
      <CeramicBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">

        {/* ── Hero headline ───────────────────────────────────────────── */}
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-clay-600 leading-tight mb-14">
          {headlineLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        {/* ── Intro story ─────────────────────────────────────────────── */}
        <div className="space-y-7 text-clay-600 leading-loose text-base">

          {/* Paragraph 1 — words bolded */}
          <p>
            {h.introParagraph1Part1}
            <strong className="font-semibold text-clay-700">{h.introBold1}</strong>
            {h.introParagraph1Part2}
            <strong className="font-semibold text-clay-700">{h.introBold2}</strong>
            {h.introParagraph1Part3}
            <strong className="font-semibold text-clay-700">{h.introBold3}</strong>
            {h.introParagraph1Part4}
            <strong className="font-semibold text-clay-700">{h.introBold4}</strong>
            {h.introParagraph1Part5}
          </p>

          {/* Paragraph 2 */}
          <p>{h.introParagraph2}</p>

          {/* Paragraph 3 — DKeramik bolded */}
          <p>
            {h.introParagraph3Part1}
            <strong className="font-semibold text-clay-700">{h.introParagraph3Bold}</strong>
            {h.introParagraph3Part2}
          </p>

          {/* Paragraph 4 */}
          <p>{h.introParagraph4}</p>
        </div>

        {/* ── Signature statement ──────────────────────────────────────── */}
        <p className="mt-10 font-semibold text-clay-700 leading-snug text-base">
          {h.signature}
        </p>

        {/* ── Invitation ───────────────────────────────────────────────── */}
        <p className="mt-4 font-semibold italic text-clay-700 leading-snug text-base">
          {h.invitation}
        </p>

        {/* ── Closing line ─────────────────────────────────────────────── */}
        <p className="mt-7 text-clay-600 leading-loose text-base">
          {h.closing}
        </p>

        {/* ── CTAs ─────────────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/portfolio">
            <Button>{h.ctaPortfolio}</Button>
          </Link>
          <Link href="/about">
            <Button variant="secondary">{h.ctaAbout}</Button>
          </Link>
        </div>

        {/* ── Brand mark ───────────────────────────────────────────────── */}
        <div className="mt-20 flex flex-col items-center">
          {/* Hand-drawn bowl illustration */}
          <svg
            viewBox="0 0 160 120"
            xmlns="http://www.w3.org/2000/svg"
            className="w-28 h-20"
            aria-hidden="true"
          >
            {/* Bowl body */}
            <path
              d="M 28 38 Q 26 70, 80 82 Q 134 70, 132 38"
              fill="none"
              stroke="#a67c52"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Bowl rim */}
            <line
              x1="22"
              y1="38"
              x2="138"
              y2="38"
              stroke="#a67c52"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Stand */}
            <line
              x1="80"
              y1="82"
              x2="80"
              y2="100"
              stroke="#a67c52"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="58"
              y1="100"
              x2="102"
              y2="100"
              stroke="#a67c52"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Brand name */}
          <p className="font-playfair text-clay-600 text-xl mt-3 tracking-wide">
            DKeramik
          </p>
        </div>
      </div>
    </div>
  );
}
