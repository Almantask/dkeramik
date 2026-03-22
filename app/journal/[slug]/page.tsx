import { lt } from '@/lib/i18n';
import JournalEntry from './JournalEntry';

// generateStaticParams must live in a server component
export function generateStaticParams() {
  return lt.journal.entries.map((entry) => ({ slug: entry.slug }));
}

// In Next.js 15, params is a Promise — the page must be async to await it
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params;
  return <JournalEntry slug={slug} />;
}
