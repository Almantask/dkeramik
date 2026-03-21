import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';

const journalSlugs = ['home-rituals', 'warmth-of-clay', 'handmade-details'];

export async function generateStaticParams() {
  return journalSlugs.map((slug) => ({
    slug,
  }));
}

export default async function JournalEntryPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content', 'journal', `${params.slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return <div>Article not found</div>;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  
  const { content, frontmatter } = await compileMDX<{
    title: string;
    date: string;
    excerpt: string;
  }>({
    source,
    options: { parseFrontmatter: true },
  });

  return (
    <div className="bg-clay-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Link */}
        <Link 
          href="/journal"
          className="text-clay-500 hover:text-clay-600 text-sm mb-8 inline-block transition-colors"
        >
          ← Back to Journal
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <p className="text-clay-500 text-xs uppercase tracking-wider mb-2">
            {frontmatter.date}
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl text-clay-700 leading-tight mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-clay-600 text-lg leading-relaxed italic">
            {frontmatter.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="[&>h1]:font-playfair [&>h1]:text-3xl [&>h1]:text-clay-700 [&>h1]:mb-6 [&>h1]:mt-12 [&>h2]:font-playfair [&>h2]:text-2xl [&>h2]:text-clay-600 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:font-playfair [&>h3]:text-xl [&>h3]:text-clay-600 [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:text-clay-600 [&>p]:leading-relaxed [&>p]:mb-5 [&>strong]:text-clay-700 [&>strong]:font-semibold [&>em]:italic [&>ul]:text-clay-600 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>li]:mb-2 [&>hr]:border-clay-200 [&>hr]:my-10">
            {content}
          </div>
        </article>
      </div>
    </div>
  );
}
