# Quick Start Guide

## 🚀 Getting Started with Migrated Components

### Prerequisites

```bash
cd c:\A\Zatiq\storefront.zatiqeasy
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

Visit:
- **Component Showcase**: http://localhost:4321/components-showcase
- **Example Home**: http://localhost:4321/example-home

## 📖 Usage Patterns

### Pattern 1: Theme-Driven (Recommended)

Create dynamic pages using the TemplateRenderer system:

```astro
---
// src/pages/my-page.astro
import TemplateRenderer from '../components/TemplateRenderer.astro';

const template = {
  sections: [
    { type: "Navbar1", order: 1 },
    { type: "Hero1", order: 2 },
    { type: "ProductCards1", order: 3 },
  ]
};

const instance = {
  settings: {
    Navbar1: { logoImage: "/assets/nav/nav1.png" },
    Hero1: { title: "SUMMER SALE" },
  }
};
---

<TemplateRenderer template={template} instance={instance} />
```

### Pattern 2: Direct Import

Use components directly in your pages:

```astro
---
// src/pages/custom-page.astro
import Hero1 from '../components/Hero/Hero1.astro';
import ProductCards1 from '../components/ProductCards/ProductCards1.astro';
---

<Hero1 settings={{ title: "NEW ARRIVALS" }} />
<ProductCards1 settings={{ products: [...] }} />
```

### Pattern 3: Section Renderer

Dynamically render sections based on data:

```astro
---
import SectionRenderer from '../components/SectionRenderer.astro';

const sections = [
  { type: "Hero1", settings: { title: "Welcome" } },
  { type: "Category1", settings: { maxWidth: "1200px" } },
];
---

{sections.map(section => (
  <SectionRenderer section={section} />
))}
```

## 🎨 Customization Examples

### Navbar with Custom Settings

```typescript
const navbarSettings = {
  logoImage: "/assets/nav/my-logo.png",
  cartCount: 5,
  navLinks: ["Home", "Shop", "About", "Contact"],
  searchPlaceholder: "Search our store...",
  menuIcon: "/assets/menu_icon.svg"
};
```

### Hero with Custom Content

```typescript
const heroSettings = {
  subtitle: "New Collection 2025",
  title: "WINTER\nFASHION",
  description: "Discover the latest trends",
  buttonText: "Shop Now",
  heroImage: "/assets/hero/my-hero.png",
  bgGradientFrom: "#DAD4EC",
  bgGradientTo: "#F3E7E9"
};
```

### Product Cards with Custom Data

```typescript
const productSettings = {
  products: [
    {
      id: 1,
      image: "https://example.com/product1.jpg",
      discount: "30% Off",
      category: "Electronics",
      title: "Wireless Headphones",
      subtitle: "Noise Cancelling - Premium Sound",
      salePrice: "99.99",
      originalPrice: "149.99"
    },
    // ... more products
  ]
};
```

## 📦 Available Components

### Navigation (7 components)
- AnnouncementBar1-3: Top promotional bars
- Navbar1-4: Full navigation headers

### Content (23 components)
- Hero1-4: Hero/banner sections
- StaticBanner1-5: Static promotional banners
- Category1-6: Category navigation/showcases
- ProductCards1-8: Product display grids

### Features (11 components)
- SpecialOffersSlider1-5: Offer carousels
- Badges1-3: Trust badges/features
- Reviews1-3: Customer testimonials
- Brands1-3: Brand showcases

### Footer (2 components)
- Footers1-2: Complete page footers

### System (2 components)
- TemplateRenderer: Page orchestrator
- SectionRenderer: Section router

## 🎯 Common Tasks

### Create a New Page

1. Create file in `src/pages/`:

```astro
---
// src/pages/shop.astro
import TemplateRenderer from '../components/TemplateRenderer.astro';
import '../styles/global.css';

const template = {
  sections: [
    { type: "Navbar1", order: 1 },
    { type: "Category1", order: 2 },
    { type: "ProductCards1", order: 3 },
    { type: "Footers1", order: 4 },
  ]
};

const instance = {
  settings: {
    Navbar1: { /* your settings */ },
    ProductCards1: { /* your settings */ },
  }
};
---

<html>
  <head>
    <title>Shop</title>
  </head>
  <body>
    <TemplateRenderer template={template} instance={instance} />
  </body>
</html>
```

2. Visit: http://localhost:4321/shop

### Customize Component Styling

Components use Tailwind CSS. To customize:

1. Override via settings:
```typescript
{
  bgColor: "#FF0000",
  maxWidth: "1200px",
  textColor: "#000000"
}
```

2. Or add custom CSS in `src/styles/global.css`

### Add Custom Fonts

Fonts are already configured. Use utility classes:

```astro
<div class="font-montserrat">Montserrat Text</div>
<div class="font-poppins">Poppins Text</div>
<div class="font-volkhov">Volkhov Text</div>
```

## 🔍 Debugging

### Component Not Rendering?

1. Check console for errors
2. Verify component type in SectionRenderer mapping
3. Ensure assets exist in `/public/assets`

### Images Not Loading?

1. Verify path starts with `/assets/...`
2. Check file exists in `public/assets/`
3. Ensure filename case matches exactly

### Styling Issues?

1. Import global.css: `import '../styles/global.css'`
2. Check Tailwind classes are valid
3. Verify font utilities are available

## 📚 Next Steps

1. ✅ Browse `/components-showcase` to see all components
2. ✅ Study `/example-home` for template pattern
3. ✅ Create your first custom page
4. ✅ Customize component settings
5. ✅ Build your theme configuration
6. ✅ Deploy to production!

## 🆘 Need Help?

- Check `MIGRATION_COMPLETE.md` for detailed documentation
- Inspect component source in `src/components/`
- Review example pages in `src/pages/`

---

Happy Building! 🎉
