import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

export default async function AboutPage() {
  const filePath = path.join(process.cwd(), 'content', 'about.mdx');
  const source = fs.readFileSync(filePath, 'utf8');
  
  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
  });

  return (
    <div className="bg-clay-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-clay max-w-none">
          <div className="[&>h1]:font-playfair [&>h1]:text-4xl [&>h1]:text-clay-700 [&>h1]:mb-8 [&>h2]:font-playfair [&>h2]:text-2xl [&>h2]:text-clay-600 [&>h2]:mt-12 [&>h2]:mb-4 [&>p]:text-clay-600 [&>p]:leading-relaxed [&>p]:mb-4 [&>strong]:text-clay-700 [&>strong]:font-semibold [&>em]:italic [&>hr]:border-clay-200 [&>hr]:my-12">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
