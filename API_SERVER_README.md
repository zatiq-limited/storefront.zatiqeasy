# Zatiq Storefront API Server 🚀

Mock API server for the Zatiq storefront using Express.js to serve all API responses.

## 📦 What's Included

### Server Files

- **`server.js`** - Custom Express server with API routes
- **`db.json`** - Merged database containing all API responses
- **`routes.json`** - Route mapping configuration (reference)
- **`server-middleware.js`** - Custom middleware (reference)

### Dependencies Installed

- `express` (v5.1.0) - Web server framework
- `cors` (v2.8.5) - Enable CORS for development
- `json-server` (v1.0.0-beta.3) - JSON database (optional)

---

## 🚀 Quick Start

### Start API Server

```bash
pnpm run api
```

✅ Server runs on: `http://localhost:3001`

### Start Both API and Astro Dev Server

```bash
pnpm run dev:all
```

- API Server: `http://localhost:3001`
- Astro Dev: `http://localhost:4321`

---

## 📡 Available Endpoints

All endpoints are available at `http://localhost:3001`

| Endpoint                                 | Method | Description                                              |
| ---------------------------------------- | ------ | -------------------------------------------------------- |
| `/api/storefront/v1/init`                | GET    | Shop config & theme initialization                       |
| `/api/storefront/v1/theme`               | GET    | Global sections (header, footer, announcement)           |
| `/api/storefront/v1/page/home`           | GET    | Homepage sections and content                            |
| `/api/storefront/v1/products/:handle`    | GET    | Product details (replace `:handle` with product slug)    |
| `/api/storefront/v1/collections/:handle` | GET    | Collection data (replace `:handle` with collection slug) |
| `/api/storefront/v1/cart`                | GET    | Shopping cart data                                       |

---

## 💡 Usage Examples

### In Your Astro Components

```typescript
// Fetch shop initialization
const initResponse = await fetch(
  "http://localhost:3001/api/storefront/v1/init"
);
const { success, data } = await initResponse.json();
console.log(data.shop); // Shop info
console.log(data.theme); // Theme design tokens

// Fetch homepage data
const homepageResponse = await fetch(
  "http://localhost:3001/api/storefront/v1/page/home"
);
const homepage = await homepageResponse.json();
console.log(homepage.data.sections); // All homepage sections

// Fetch product details
const productResponse = await fetch(
  "http://localhost:3001/api/storefront/v1/products/classic-white-shirt"
);
const product = await productResponse.json();
console.log(product.data.product); // Product details

// Fetch collection
const collectionResponse = await fetch(
  "http://localhost:3001/api/storefront/v1/collections/womens"
);
const collection = await collectionResponse.json();
console.log(collection.data.collection); // Collection info
```

### Test with Browser

Simply open these URLs in your browser:

- http://localhost:3001/api/storefront/v1/init
- http://localhost:3001/api/storefront/v1/theme
- http://localhost:3001/api/storefront/v1/page/home
- http://localhost:3001/api/storefront/v1/products/any-product
- http://localhost:3001/api/storefront/v1/cart

### Test with curl

```bash
# Test shop initialization
curl http://localhost:3001/api/storefront/v1/init

# Test global theme
curl http://localhost:3001/api/storefront/v1/theme

# Test homepage
curl http://localhost:3001/api/storefront/v1/page/home

# Test product (any handle works)
curl http://localhost:3001/api/storefront/v1/products/classic-white-shirt

# Test collection (any handle works)
curl http://localhost:3001/api/storefront/v1/collections/womens
```

---

## 🔄 Update API Data

To modify API responses:

### 1. Edit Source JSON Files

Edit files in `src/data/api-responses/`:

- `theme_init.json` - Shop initialization data
- `global.json` - Header, footer, announcement bar
- `homepage.json` - Homepage sections and content
- `product.json` - Product details
- `category.json` - Collection/category data
- `cart.json` - Shopping cart data

### 2. Rebuild Database

Run this command to merge all JSON files into `db.json`:

```bash
node -e "const fs=require('fs');const path=require('path');const files=fs.readdirSync('src/data/api-responses').filter(f=>f.endsWith('.json'));const db={};files.forEach(f=>{const k=f.replace('.json','');db[k]=JSON.parse(fs.readFileSync(path.join('src/data/api-responses',f),'utf8'))});fs.writeFileSync('db.json',JSON.stringify(db,null,2));"
```

### 3. Restart Server

```bash
# Stop server (Ctrl+C)
pnpm run api
```

---

## ✨ Features

✅ Custom API URLs matching backend structure  
✅ CORS enabled for cross-origin requests  
✅ Clean JSON response format  
✅ Path parameters support (`:handle`)  
✅ Organized data in separate JSON files  
✅ Easy to update and maintain

---

## 📝 Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

---

## 🛠️ Troubleshooting

### Port Already in Use

If port 3001 is already taken, edit `server.js` and change:

```javascript
const PORT = 3001; // Change to another port like 3002
```

### Server Not Starting

Make sure dependencies are installed:

```bash
pnpm install
```

### CORS Issues

CORS is already enabled in `server.js`. If you still face issues, check your browser console.

---

## 🎯 Next Steps

1. ✅ Server is running
2. Create API client utility in `src/lib/api-client.ts`
3. Fetch data in your Astro pages
4. Build dynamic components using API data
5. Replace with real backend when ready

Happy coding! 🎉
