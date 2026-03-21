import JournalCard from '@/components/ui/JournalCard';

const journalEntries = [
  {
    slug: 'home-rituals',
    title: 'Home Rituals: The Objects That Shape Our Days',
    excerpt: 'How the simple act of reaching for a handmade mug can transform an ordinary morning into a moment of mindfulness.',
    date: 'March 15, 2024',
  },
  {
    slug: 'warmth-of-clay',
    title: 'The Warmth of Clay: Why Handmade Matters',
    excerpt: 'In a world of mass production, choosing handmade is an act of quiet resistance—and profound connection.',
    date: 'February 28, 2024',
  },
  {
    slug: 'handmade-details',
    title: 'Handmade Details: Building a Home That Feels Like You',
    excerpt: 'Your home doesn\'t need to be perfect. It needs to be filled with things that make you feel something.',
    date: 'March 8, 2024',
  },
];

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-playfair text-4xl md:text-5xl text-clay-700 mb-4">
            Journal
          </h1>
          <p className="text-clay-600 leading-relaxed max-w-2xl mx-auto">
            Thoughts on making, living with intention, and the quiet beauty of handmade things.
          </p>
        </div>

        {/* Journal Entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {journalEntries.map((entry) => (
            <JournalCard key={entry.slug} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
