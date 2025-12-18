# 🚀 ZATIQ STOREFRONT - QUICK START GUIDE

## প্রজেক্ট সম্পর্কে

এই প্রজেক্টটি একটি **Dynamic E-commerce Storefront** যা:

✅ **Backend API** থেকে theme configuration fetch করে  
✅ **Automatically components render** করে  
✅ **Static data** দিয়ে development এ কাজ করে  
✅ **Production এ real API** integrate করা যাবে

---

## 📁 গুরুত্বপূর্ণ Files

| File                            | কী করে                             |
| ------------------------------- | ---------------------------------- |
| `src/lib/component-registry.ts` | সব components কে map করে           |
| `src/data/mock-theme.ts`        | Theme configuration (static)       |
| `src/data/mock-products.ts`     | Product data (static)              |
| `src/lib/api-client.ts`         | API calls (TODO comments দেখুন)    |
| `API_DOCUMENTATION.md`          | Backend developer এর জন্য API docs |

---

## 🎯 কীভাবে কাজ করে

### 1. Component Registry

```typescript
// headless-components থেকে সব components import
import { Hero1, Navbar1, ProductCards1 } from "@headless-components";

// Registry তে map করা
export const ZATIQ_COMPONENTS = {
  "hero-1": Hero1,
  "navbar-1": Navbar1,
  "product-card-1": ProductCards1,
};
```

### 2. Theme Configuration

```typescript
// API থেকে এই format এ data আসবে
{
  templates: {
    index: {
      sections: [
        { type: 'hero-1', settings: {...} },
        { type: 'product-card-1', settings: {...} }
      ]
    }
  }
}
```

### 3. Dynamic Rendering

```typescript
// ComponentRenderer automatically component খুঁজে render করে
<ComponentRenderer section={{ type: "hero-1", settings }} />
```

---

## 🔧 Development Setup

### Step 1: Install

```bash
pnpm install
```

### Step 2: Run

```bash
pnpm dev
```

### Step 3: Open Browser

```
http://localhost:4321
```

**এখন আপনি দেখতে পাবেন:**

- ✅ Homepage with Hero, Categories, Products
- ✅ Dynamic component rendering
- ✅ Global Header/Footer
- ✅ All static data working

---

## 📝 Backend Integration (TODO)

যখন Backend API ready হবে:

### Step 1: Environment Variables

```env
PUBLIC_API_URL=https://api.zatiq.com
PUBLIC_SHOP_ID=your_shop_id
```

### Step 2: Update API Client

`src/lib/api-client.ts` file এ:

```typescript
// এই function টি update করুন
export async function getTheme(shopId: string) {
  // Remove this ❌
  // return mockTheme;

  // Add this ✅
  const response = await fetch(
    `${API_BASE_URL}/api/storefront/v1/theme?shopId=${shopId}`
  );
  return response.json();
}
```

### Step 3: Test

```bash
pnpm dev
# API থেকে real data আসবে
```

---

## 🎨 Theme Customization

`src/data/mock-theme.ts` file এ customize করুন:

```typescript
designSystem: {
  colors: {
    primary: "#2563eb",    // আপনার primary color
    secondary: "#1f2937",  // আপনার secondary color
    accent: "#f59e0b"      // আপনার accent color
  },
  fonts: {
    heading: "Poppins",    // Heading font
    body: "Inter"          // Body font
  }
}
```

**Automatically CSS variables এ convert হবে!**

---

## 📄 Available Routes

| URL                              | Page           | Data Source                         |
| -------------------------------- | -------------- | ----------------------------------- |
| `/`                              | Homepage       | `mock-theme.ts` → `templates.index` |
| `/products/classic-white-tshirt` | Product Detail | `mock-products.ts`                  |
| `/collections/womens`            | Collection     | `mock-products.ts`                  |
| `/cart`                          | Cart           | Empty cart (static)                 |
| `/search?q=shirt`                | Search         | Filter from `mock-products.ts`      |

---

## 🧩 নতুন Component যোগ করা

### Step 1: Component তৈরি করুন

`headless-components` প্রজেক্টে নতুন component বানান

### Step 2: Registry তে Add করুন

```typescript
// src/lib/component-registry.ts
import { MyNewComponent } from "@headless-components/MyNewComponent";

export const ZATIQ_COMPONENTS = {
  // ... existing components
  "my-new-component-1": MyNewComponent,
};
```

### Step 3: Theme Data তে Use করুন

```typescript
// src/data/mock-theme.ts
sections: [
  {
    id: "new_section",
    type: "my-new-component-1", // ← আপনার component
    enabled: true,
    settings: {
      title: "Hello World",
      // ... your settings
    },
  },
];
```

**Done! Component render হবে!** 🎉

---

## 🐛 Common Issues

### Issue 1: Component not rendering

**Solution:** Check করুন component registry তে আছে কিনা

```typescript
// src/lib/component-registry.ts এ check করুন
console.log(ZATIQ_COMPONENTS["your-component-type"]);
```

### Issue 2: Import error

**Solution:** tsconfig.json এ path alias check করুন

```json
{
  "paths": {
    "@headless-components/*": ["../headless-components/src/components/*"]
  }
}
```

### Issue 3: Styles not working

**Solution:** Tailwind CSS global.css import করা আছে কিনা check করুন

---

## 📚 Documentation

- **API Endpoints:** `API_DOCUMENTATION.md`
- **Full README:** `README.md`
- **Type Definitions:** `src/lib/types.ts`

---

## ✅ Checklist

Development শুরু করার আগে:

- [ ] `pnpm install` done
- [ ] `pnpm dev` চলছে
- [ ] Browser এ `http://localhost:4321` open করেছেন
- [ ] Homepage render হচ্ছে
- [ ] Components দেখা যাচ্ছে

Backend Integration এর জন্য:

- [ ] `API_DOCUMENTATION.md` পড়েছেন
- [ ] Environment variables setup করেছেন
- [ ] `src/lib/api-client.ts` এ TODO comments দেখেছেন
- [ ] Backend team কে API format জানিয়েছেন

---

## 💡 Pro Tips

1. **Development Mode:** Component not found হলে error message দেখাবে - এটি normal
2. **Mock Data:** Development এর জন্য mock data freely modify করতে পারবেন
3. **Type Safety:** TypeScript error ignore করবেন না - এগুলো আপনাকে protect করবে
4. **API Format:** Backend developer কে `API_DOCUMENTATION.md` share করুন

---

**Happy Coding! 🚀**

Questions? Check `README.md` or contact the team.
