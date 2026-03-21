import Link from 'next/link';
import CeramicBackground from '@/components/ui/CeramicBackground';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-clay-50">
        <CeramicBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="font-playfair text-4xl md:text-6xl text-clay-700 leading-tight mb-8 text-left">
            Homes become true homes when they are filled with{' '}
            <span className="text-clay-500">heartfelt details</span>.
          </h1>
          <div className="flex gap-4 flex-wrap">
            <Link href="/collection">
              <Button>Explore Collection</Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary">Our Story</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="leading-loose text-clay-600 space-y-6">
          <p>
            We believe in the quiet power of <strong className="text-clay-700">beautiful, everyday objects</strong>.
            The bowl that holds your morning ritual. The mug that fits perfectly in your hands.
            The vase that makes a single flower feel like an occasion.
          </p>
          <p>
            These aren't just dishes. They're <strong className="text-clay-700">the details that transform
            a house into a home</strong>—one small moment of beauty at a time.
          </p>
          <p className="text-lg font-playfair italic text-clay-500 text-center py-8">
            "Homes are created little by little—detail by detail."
          </p>
          <p>
            Every piece we create is shaped by hand, fired with care, and made to be{' '}
            <strong className="text-clay-700">used and loved</strong>. Not tucked away for special occasions,
            but woven into the fabric of daily life.
          </p>
          <p>
            Because the most special moments are often the <strong className="text-clay-700">ordinary ones</strong>
            —when we pause long enough to notice them.
          </p>
        </div>
      </section>

      {/* Invitation */}
      <section className="bg-clay-100 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl text-clay-700 mb-6">
            An Invitation
          </h2>
          <p className="text-clay-600 leading-relaxed mb-8">
            We invite you to slow down. To choose pieces that speak to you. To build a home
            filled with objects that carry meaning—made slowly, with intention, by human hands.
          </p>
          <p className="font-playfair text-xl text-clay-500 italic">
            Take it in your hands and feel the warmth of clay.
          </p>
        </div>
      </section>

      {/* Brand Mark */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-48 h-48 mx-auto"
          >
            <ellipse cx="100" cy="110" rx="70" ry="15" fill="#e8d5c0" opacity="0.5" />
            <path
              d="M 50 90 Q 50 130, 100 140 Q 150 130, 150 90 L 145 90 Q 145 125, 100 133 Q 55 125, 55 90 Z"
              fill="#d4b896"
            />
            <ellipse cx="100" cy="90" rx="45" ry="10" fill="#c19572" />
            <path
              d="M 65 90 Q 65 100, 100 103 Q 135 100, 135 90"
              fill="#f5ebe0"
            />
          </svg>
          <p className="font-playfair text-clay-600 mt-6 text-lg">DKeramik</p>
          <p className="text-clay-500 text-sm mt-2">Handcrafted with care</p>
        </div>
      </section>
    </div>
  );
}

