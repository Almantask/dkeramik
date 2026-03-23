# DKeramik - Ceramics Portfolio Website

A beautiful, static Next.js 14 website showcasing handcrafted ceramic pieces. Built with TypeScript, Tailwind CSS, and MDX for content management.

## 🎨 Features

- **Next.js 14 App Router** with TypeScript
- **Static Export** for optimal performance and hosting flexibility
- **Tailwind CSS** with custom clay color palette
- **MDX Support** for rich content pages
- **Responsive Design** with mobile-first approach
- **Google Fonts** (Playfair Display for headings, Nunito for body)
- **Jest + React Testing Library** for comprehensive testing
- **Accessible** and semantic HTML

## 🎯 Design Philosophy

DKeramik embodies a warm, minimalist aesthetic inspired by artisanal ceramics:

- **Color Palette**: Soft warm terracotta tones (clay-50 to clay-900)
- **Typography**: Elegant serif headings (Playfair Display) + humanist sans-serif body (Nunito)
- **Layout**: Lots of whitespace, editorial left-aligned composition
- **Details**: Subtle ceramic line-art SVG patterns, understated CTAs

## 📁 Project Structure

```
dkeramik/
├── app/                          # Next.js App Router pages
│   ├── about/                    # About page
│   ├── collection/               # Product collection
│   │   └── [slug]/              # Individual product pages
│   ├── contact/                  # Contact page
│   ├── craft/                    # Craft process page
│   ├── journal/                  # Blog/journal
│   │   └── [slug]/              # Individual journal entries
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Main navigation
│   │   └── Footer.tsx           # Site footer
│   └── ui/
│       ├── Button.tsx           # Reusable button component
│       ├── CeramicBackground.tsx # SVG background pattern
│       ├── JournalCard.tsx      # Journal entry card
│       └── ProductCard.tsx      # Product card
├── content/
│   ├── journal/                 # MDX journal entries
│   │   ├── handmade-details.mdx
│   │   ├── home-rituals.mdx
│   │   └── warmth-of-clay.mdx
│   ├── about.mdx               # About page content
│   ├── craft.mdx               # Craft process content
│   └── products.ts             # Product data
├── __tests__/                  # Jest tests
├── jest.config.js              # Jest configuration
├── next.config.mjs             # Next.js config (static export)
├── tailwind.config.ts          # Tailwind with clay palette
└── tsconfig.json               # TypeScript config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production (static export)
npm run build
```

### Development

Open [http://localhost:3000](http://localhost:3000) to view the site in development mode.

### Testing

All components and pages have comprehensive tests:

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

### Building

The site builds to a static export in the `out/` directory:

```bash
npm run build
```

This generates static HTML files for all pages, ready to deploy to any static hosting service.

## 🎨 Design System

### Color Palette

```css
clay-50:  #fdf8f5  /* warm off-white background */
clay-100: #f5ebe0  /* blush beige */
clay-200: #e8d5c0  /* pale nude */
clay-300: #d4b896  /* dusty peach */
clay-400: #c19572  /* muted terracotta */
clay-500: #a67c52  /* cinnamon clay (primary) */
clay-600: #8b6340  /* deeper clay */
clay-700: #6b4c30  /* text color */
clay-800: #4a3420
clay-900: #2d1f12
```

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Nunito (sans-serif)
- **Line height**: Generous spacing (leading-relaxed, leading-loose)

## 📄 Pages

1. **Home** (`/`) - Hero with brand philosophy and invitation
2. **About** (`/about`) - Founder story and philosophy (from MDX)
3. **Collection** (`/collection`) - Product grid with category filtering
4. **Product Details** (`/collection/[slug]`) - Individual product pages
5. **Craft** (`/craft`) - Process and methodology (from MDX)
6. **Journal** (`/journal`) - Blog/journal article listing
7. **Journal Entry** (`/journal/[slug]`) - Individual articles (from MDX)
8. **Contact** (`/contact`) - Contact information and social links

## 🧪 Testing

The project includes comprehensive tests for:

- Components (Header, Footer, Button, ProductCard)
- Pages (Home page)
- User interactions (clicks, form submissions)
- Accessibility and semantic HTML

All tests use Jest and React Testing Library.

## 📦 Deployment

The site is built as a static export and can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

Simply run `npm run build` and deploy the contents of the `out/` directory.

## 🛠️ Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **MDX** - Markdown with JSX for rich content
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing

## 📝 Content Management

Content is managed through:

- **MDX files** in `content/` directory for long-form content (About, Craft, Journal)
- **TypeScript data file** (`content/products.ts`) for product catalog
- Easy to edit and version control

## 🎯 Brand Voice

The site embodies a warm, poetic, human voice:

- Focuses on **ritual, meaning, and intentionality**
- Celebrates **imperfection and handmade variation**
- Emphasizes **slow, mindful living**
- Uses **emotional, evocative language**

Key phrases:
- "Homes become true homes when they are filled with heartfelt details."
- "Homes are created little by little—detail by detail."
- "Take it into your hands and feel the warmth of clay."

## 📄 License

See LICENSE file for details.

---

Built with ❤️ and Next.js 14
