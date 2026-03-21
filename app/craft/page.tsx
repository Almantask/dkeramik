import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

export default async function CraftPage() {
  const filePath = path.join(process.cwd(), 'content', 'craft.mdx');
  const source = fs.readFileSync(filePath, 'utf8');
  
  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
  });

  return (
    <div className="bg-clay-50 min-h-screen">
      {/* Hero */}
      <div className="bg-clay-100 border-b border-clay-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-clay-700 mb-4">
            The Craft
          </h1>
          <p className="text-clay-600 leading-relaxed max-w-2xl mx-auto">
            From raw earth to finished piece, each creation passes through patient hands
            and transformative fire.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-clay max-w-none">
          <div className="[&>h1]:font-playfair [&>h1]:text-4xl [&>h1]:text-clay-700 [&>h1]:mb-8 [&>h2]:font-playfair [&>h2]:text-2xl [&>h2]:text-clay-600 [&>h2]:mt-12 [&>h2]:mb-4 [&>p]:text-clay-600 [&>p]:leading-relaxed [&>p]:mb-4 [&>strong]:text-clay-700 [&>strong]:font-semibold [&>em]:italic [&>hr]:border-clay-200 [&>hr]:my-12">
            {content}
          </div>
        </div>
      </div>

      {/* Process Icons */}
      <div className="bg-clay-100 py-16 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '🏺', label: 'Centering' },
              { icon: '🎨', label: 'Shaping' },
              { icon: '🔥', label: 'Firing' },
              { icon: '✨', label: 'Finishing' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-3">{step.icon}</div>
                <p className="text-clay-600 font-nunito text-sm">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
