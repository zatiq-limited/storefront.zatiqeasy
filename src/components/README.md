# Component Library - Import Guide

## 📦 All 45 Components Available

### How to Import Components

Astro components must be imported directly in your `.astro` pages. Here's how:

```astro
---
// In your .astro page file
import Hero1 from '../components/Hero/Hero1.astro';
import Navbar1 from '../components/Navbar/Navbar1.astro';
import ProductCards1 from '../components/ProductCards/ProductCards1.astro';
---

<Navbar1 settings={{ logoImage: "/assets/nav/nav1.png" }} />
<Hero1 settings={{ title: "Welcome" }} />
<ProductCards1 settings={{ products: [...] }} />
```

### Or Use the TemplateRenderer

```astro
---
import TemplateRenderer from '../components/TemplateRenderer.astro';

const template = {
  sections: [
    { type: "Navbar1", order: 1 },
    { type: "Hero1", order: 2 },
  ]
};

const instance = {
  settings: {
    Navbar1: { /* settings */ },
    Hero1: { /* settings */ }
  }
};
---

<TemplateRenderer template={template} instance={instance} />
```

## 📋 Component Reference

### AnnouncementBar (3)
- `./AnnouncementBar/AnnouncementBar1.astro` - Gradient banner with icon
- `./AnnouncementBar/AnnouncementBar2.astro` - Contact info with social links
- `./AnnouncementBar/AnnouncementBar3.astro` - Email/phone contact bar

### Navbar (4)
- `./Navbar/Navbar1.astro` - Simple navbar with search
- `./Navbar/Navbar2.astro` - Navbar with dropdowns
- `./Navbar/Navbar3.astro` - Multi-level category navbar
- `./Navbar/Navbar4.astro` - Minimalist navbar

### Hero (4)
- `./Hero/Hero1.astro` - Fashion hero with slider
- `./Hero/Hero2.astro` - Split hero with image
- `./Hero/Hero3.astro` - Centered hero with CTA
- `./Hero/Hero4.astro` - Full-width hero banner

### StaticBanner (5)
- `./StaticBanner/StaticBanner1.astro` - Single banner
- `./StaticBanner/StaticBanner2.astro` - Split banner (2 cols)
- `./StaticBanner/StaticBanner3.astro` - Triple banner
- `./StaticBanner/StaticBanner4.astro` - Grid banner
- `./StaticBanner/StaticBanner5.astro` - Card-based banners

### Category (6)
- `./Category/Category1.astro` - 3-column categories
- `./Category/Category2.astro` - 2-column categories
- `./Category/Category3.astro` - Side-by-side layout
- `./Category/Category4.astro` - 7-column circular icons
- `./Category/Category5.astro` - 6-column circular icons
- `./Category/Category6.astro` - Rounded category cards

### ProductCards (8)
- `./ProductCards/ProductCards1.astro` - Basic product grid
- `./ProductCards/ProductCards2.astro` - Hover overlay cards
- `./ProductCards/ProductCards3.astro` - Minimal cards
- `./ProductCards/ProductCards4.astro` - Cards with quick view
- `./ProductCards/ProductCards5.astro` - Featured products
- `./ProductCards/ProductCards6.astro` - Rating-based cards
- `./ProductCards/ProductCards7.astro` - Color variant cards
- `./ProductCards/ProductCards8.astro` - Detailed product cards

### SpecialOffersSlider (5)
- `./SpecialOffersSlider/SpecialOffersSlider1.astro` - Product grid slider
- `./SpecialOffersSlider/SpecialOffersSlider2.astro` - Countdown timer slider
- `./SpecialOffersSlider/SpecialOffersSlider3.astro` - Artistic product display
- `./SpecialOffersSlider/SpecialOffersSlider4.astro` - Dual promo cards
- `./SpecialOffersSlider/SpecialOffersSlider5.astro` - Full-width banner slider

### Badges (3)
- `./Badges/Badges1.astro` - Icon badges
- `./Badges/Badges2.astro` - Image-based badges
- `./Badges/Badges3.astro` - Circular icon badges

### Reviews (3)
- `./Reviews/Reviews1.astro` - Product review slider
- `./Reviews/Reviews2.astro` - Testimonial carousel
- `./Reviews/Reviews3.astro` - Customer quote cards

### Brands (3)
- `./Brands/Brands1.astro` - Simple logo grid
- `./Brands/Brands2.astro` - Logos with descriptions
- `./Brands/Brands3.astro` - Complex brand grid

### Footers (2)
- `./Footers/Footers1.astro` - Newsletter footer
- `./Footers/Footers2.astro` - Contact-focused footer

### System Components
- `./SectionRenderer.astro` - Dynamic section router
- `./TemplateRenderer.astro` - Template orchestrator

## 💡 Quick Examples

### Example 1: Simple Page
```astro
---
import Navbar1 from '../components/Navbar/Navbar1.astro';
import Hero1 from '../components/Hero/Hero1.astro';
import Footers1 from '../components/Footers/Footers1.astro';
import '../styles/global.css';
---

<html>
  <head><title>My Page</title></head>
  <body>
    <Navbar1 />
    <Hero1 settings={{ title: "Welcome!" }} />
    <Footers1 />
  </body>
</html>
```

### Example 2: Using TemplateRenderer
```astro
---
import TemplateRenderer from '../components/TemplateRenderer.astro';
import '../styles/global.css';

const pageTemplate = {
  sections: [
    { type: "AnnouncementBar1", order: 1 },
    { type: "Navbar1", order: 2 },
    { type: "Hero1", order: 3 },
    { type: "ProductCards1", order: 4 },
    { type: "Footers1", order: 5 },
  ]
};
---

<html>
  <head><title>Template Page</title></head>
  <body>
    <TemplateRenderer template={pageTemplate} />
  </body>
</html>
```

## 📚 Documentation

See:
- `QUICK_START.md` - Getting started guide
- `MIGRATION_COMPLETE.md` - Full documentation
- `EXECUTIVE_SUMMARY.md` - Overview

## ✅ All Components Migrated

Total: **45 components** (90 files: 45 .tsx + 45 .astro)

Each component accepts standardized props:
```typescript
{
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}
```
