# The Brief

A Next.js + Sanity CMS powered explainer website. Complex topics, simply explained.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Sanity credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A Sanity.io account and project

## 🔧 Sanity Setup

1. Create a new Sanity project at [sanity.io](https://sanity.io)
2. Copy your project ID
3. Update `.env.local` with your credentials
4. Deploy the Sanity studio:
   ```bash
   cd sanity
   npm install
   npx sanity deploy
   ```

## 📁 Project Structure

```
the-brief/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── explainer/    # Explainer pages
│   │   ├── about/        # About page
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Homepage
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ExplainerCard.tsx
│   │   └── CategoryFilter.tsx
│   └── lib/
│       └── sanity.ts     # Sanity client
├── sanity/               # Sanity CMS studio
│   ├── schemas/          # Content schemas
│   └── sanity.config.ts
├── public/               # Static assets
└── ...config files
```

## 🎨 Features

- **Next.js 14** with App Router
- **Sanity CMS** for content management
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **Responsive design** for all devices
- **SEO optimized** with metadata
- **Category filtering** on homepage
- **Portable Text** for rich content

## 📝 Content Types

### Explainer
- Title and slug
- Category (Politics, Technology, Business, Science, Health, Culture)
- Summary (max 200 chars)
- Rich text content
- Key takeaways list
- Reading time
- Publish date
- Featured flag

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Target domain: `the-brief-demo.vercel.app`

### Sanity Studio

```bash
cd sanity
npx sanity deploy
```

## 📄 License

MIT
