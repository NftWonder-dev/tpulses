# TPulses - Next.js Website

Modern e-commerce website for digital audio products, powered by Next.js, Tailwind CSS, and Sanity CMS.

## 🎨 Design Features

- **Cyberpunk/Technical Aesthetic** - Dark backgrounds with cyan/magenta neon accents
- **Glass Morphism** - Blur effects and transparent cards
- **Custom Typography** - Space Grotesk, Space Mono, Inter
- **Smooth Animations** - Hover effects, transitions, and scroll animations
- **Fully Responsive** - Mobile-first design

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **CMS:** Sanity.io
- **Icons:** Lucide React
- **Fonts:** Google Fonts (Space Grotesk, Space Mono, Inter)

## 📁 Project Structure

```
tpulses-nextjs/
├── src/
│   ├── app/
│   │   ├── collections/
│   │   │   ├── [slug]/
│   │   │   │   └── page.js          # Single collection page
│   │   │   └── page.js              # All collections
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.js          # Product detail page
│   │   ├── layout.js                # Root layout
│   │   ├── page.js                  # Homepage
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.js        # Header/Nav
│   │   │   └── Footer.js            # Footer
│   │   └── ui/
│   │       ├── CollectionCard.js    # Collection card
│   │       └── ProductCard.js       # Product card
│   └── lib/
│       ├── sanity.js                # Sanity client config
│       └── queries.js               # GROQ queries
├── .env.local                       # Environment variables
├── tailwind.config.js               # Tailwind configuration
├── next.config.js                   # Next.js configuration
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env.local` file is already set up with your Sanity project ID:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=ji82q30h
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Add Content in Sanity

Make sure your Sanity Studio is running and has content:

```bash
cd ../digital-store-cms
npm run dev
```

Add collections, categories, and products through Sanity Studio at http://localhost:3333

## 📄 Pages

### Homepage (`/`)
- Hero section with animated elements
- Theory/About section
- Collections grid
- Technical specifications

### Collections Page (`/collections`)
- Grid view of all collections
- Links to individual collection pages

### Collection Detail (`/collections/[slug]`)
- Collection header with emoji and description
- Grid of categories within the collection
- Product counts

### Product Detail (`/products/[slug]`)
- Full product information
- Price and purchase button
- Technical specifications
- Image/video preview area
- Tags and metadata

## 🎯 Key Components

### Navigation
- Fixed header with blur effect
- Logo with gradient background
- Navigation links
- Shopping cart icon
- CTA button

### CollectionCard
- Glass morphism effect
- Hover animations
- Image with gradient overlay
- Product count badge

### ProductCard
- Clean product listing
- Price display
- Collection badge
- Add to cart button

## 🎨 Styling

### Colors
```css
--cyan: #00f3ff
--magenta: #ff00ff
--deep-bg: #0a0a12
--footer-bg: #05050a
```

### Typography
- **Headings:** Space Grotesk (bold, tracking-tighter)
- **Technical Text:** Space Mono (uppercase, tracking-widest)
- **Body:** Inter (light, regular)

### Effects
- Grid background pattern
- Vertical gradient lines
- Glass morphism cards
- Neon glow effects
- Smooth transitions

## 🔗 Integration Points

### Sanity CMS
All content is dynamically loaded from Sanity:
- Collections
- Categories  
- Sub-packs
- Products

The queries are defined in `src/lib/queries.js`

### LemonSqueezy (Future)
Payment integration placeholder in:
- Product detail pages
- Cart functionality
- Checkout flow

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will auto-deploy on every push to main branch.

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

## 🔧 Customization

### Adding New Collections
1. Create in Sanity Studio
2. They automatically appear on the site

### Modifying Styles
- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.js`
- Component styles: Use Tailwind utility classes

### Adding Pages
Create new files in `src/app/` following Next.js App Router conventions

## 📱 Responsive Breakpoints

- Mobile: default
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)

## 🎬 Animations

- Pulse animation on hero badge
- Slow spin on hero circles (60s)
- Card hover effects (translateY, border glow)
- Smooth color transitions
- Icon animations

## 💡 Tips

- Always add content in Sanity first
- Use the `slug` field for URL-friendly names
- Upload images through Sanity for automatic optimization
- Test responsive design on multiple devices
- Use the product `order` field to control display order

## 🐛 Troubleshooting

**Images not loading?**
- Check Sanity project ID in `.env.local`
- Verify images are uploaded in Sanity
- Check `next.config.js` image domains

**Content not appearing?**
- Ensure Sanity Studio has published content
- Check browser console for errors
- Verify GROQ queries in `src/lib/queries.js`

**Styling issues?**
- Run `npm run dev` to rebuild Tailwind
- Check for typos in className
- Verify custom fonts are loading

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Sanity.io](https://www.sanity.io/docs)
- [Lucide Icons](https://lucide.dev)

## 🎉 Next Steps

1. ✅ Add content to Sanity CMS
2. ✅ Test all pages locally
3. 🔲 Set up LemonSqueezy for payments
4. 🔲 Add email delivery system
5. 🔲 Deploy to Vercel
6. 🔲 Connect custom domain
7. 🔲 Set up analytics

---

Built with ❤️ for TPulses Audio Laboratories
