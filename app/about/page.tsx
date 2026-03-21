'use client';

import CeramicBackground from '@/components/ui/CeramicBackground';
import { useLanguage } from '@/lib/i18n';

export default function AboutPage() {
  const { language, t } = useLanguage();
  const a = t.about;

  const isLt = language === 'lt';

  return (
    <div className="relative bg-clay-50 min-h-screen">
      <CeramicBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Headline */}
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-clay-600 leading-tight mb-3">
          {a.headline}
        </h1>
        <p className="font-playfair italic text-clay-400 text-lg mb-14">
          {a.subheadline}
        </p>

        <div className="space-y-12 text-clay-600 leading-loose">

          {/* Section 1 */}
          <section>
            <h2 className="font-playfair text-2xl text-clay-600 mb-4">{a.section1Heading}</h2>
            <p className="mb-4">{a.section1Body}</p>
            <p className="font-semibold text-clay-700">{a.section1Bold}</p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-playfair text-2xl text-clay-600 mb-4">{a.section2Heading}</h2>
            <p>
              {a.section2Body}
              <strong className="font-semibold text-clay-700">{a.section2Bold1}</strong>
              {isLt
                ? ' – ryto kava, bendras valgis, viena gėlė, sakanti „pastebėjau grožį šiandien". Ne tobulumas, o '
                : ' — the morning coffee, the shared meal, the single flower that says "I noticed beauty today." Not perfection, but '}
              <strong className="font-semibold text-clay-700">{a.section2Bold2}</strong>
              {isLt
                ? '. Ne vienodumas, o charakteris.'
                : '. Not uniformity, but character.'}
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-playfair text-2xl text-clay-600 mb-4">{a.section3Heading}</h2>
            <p>
              {a.section3Body}
              <strong className="font-semibold text-clay-700">{a.section3Bold}</strong>
              {isLt
                ? ', nešantis kūrimo žymių – nedideli glazūros skirtumai, švelni asimetrija, žmogaus prisilietimo pėdsakas. Tai nėra defektas. Tai '
                : ', carrying the marks of the making — slight variations in glaze, gentle asymmetry, the trace of human touch. This is not a flaw. This is '}
              <strong className="font-semibold text-clay-700">
                {isLt ? 'rankų darbo grožis' : 'the beauty of handmade'}
              </strong>.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-playfair text-2xl text-clay-600 mb-4">{a.section4Heading}</h2>
            <p>
              {a.section4Body}
              <strong className="font-semibold text-clay-700">{a.section4Bold}</strong>
              {isLt ? '. Jie gali šnabždėti.' : '. They can whisper.'}
            </p>
          </section>

          {/* Closing */}
          <p className="border-t border-clay-200 pt-8 font-playfair italic text-clay-500 text-lg">
            {a.closing}
          </p>
        </div>
      </div>
    </div>
  );
}
