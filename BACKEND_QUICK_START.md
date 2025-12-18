# 🚀 Backend Integration - Quick Guide

Backend এর সাথে connect করার simple guide।

---

## 📝 Step 1: Environment Setup

`.env` file এ configure করুন:

```bash
PUBLIC_API_URL=http://localhost:3000
PUBLIC_SHOP_ID=shop_demo_12345
PUBLIC_API_KEY=your_api_key_here
PUBLIC_USE_MOCK_DATA=false
```

---

## 🧪 Step 2: Start Server & Test

```bash
npm run dev
```

Browser console (F12) এ check করুন:

**Success:**

```
[API] Calling: /api/storefront/v1/theme
[API] Success: /api/storefront/v1/theme
```

**Using Mock:**

```
[Mock] Using mock theme
```

→ `.env` এ `PUBLIC_USE_MOCK_DATA=false` set করুন

---

## 🔧 Step 3: Backend Developer Setup

Backend developer কে share করুন:

- **API_DOCUMENTATION.md** - API specs
- **BACKEND_RESPONSE_EXAMPLES.json** - Response examples
- **src/lib/types.ts** - Type definitions

### Required Endpoints:

```
GET  /api/storefront/v1/init              # Shop config
GET  /api/storefront/v1/theme             # Theme data
GET  /api/storefront/v1/products          # Product list
GET  /api/storefront/v1/products/:handle  # Single product
POST /api/storefront/v1/cart              # Create cart
POST /api/storefront/v1/cart/add          # Add to cart
```

### Response Format:

```json
{
  "success": true,
  "data": {}
}
```

---

## 🐛 Common Issues

**CORS Error?**
→ Backend এ CORS enable করুন

**API 404?**
→ Backend server running আছে কিনা check করুন

**Still using mock data?**
→ `.env` file check করুন এবং server restart করুন

---

**Solution:** Backend এ CORS enable করতে হবে:

```javascript
// Backend (Node.js/Express example)
app.use(
  cors({
    origin: "http://localhost:4321", // Your frontend URL
    credentials: true,
  })
);
```

#### ❌ Problem: "API returns 404"

**Solution:** Check করুন:

1. Backend server চলছে কিনা
2. API URL সঠিক আছে কিনা
3. Endpoint path মিলছে কিনা

#### ❌ Problem: "Still using mock data"

**Solution:**

1. `.env` file এ `PUBLIC_USE_MOCK_DATA=false` set করেছেন কিনা
2. Development server restart করুন: `Ctrl+C` → `npm run dev`

---

## ✨ Step 5: Verify Everything Works

### Checklist:

- [ ] Browser console এ `[API] Calling:` messages দেখা যাচ্ছে
- [ ] `[Mock]` messages নেই (real API use হচ্ছে)
- [ ] Network tab এ API requests দেখা যাচ্ছে
- [ ] Products load হচ্ছে backend থেকে
- [ ] Theme configuration backend থেকে আসছে

### Network Tab Check:

1. Browser DevTools খুলুন (F12)
2. Network tab এ যান
3. Filter করুন: `XHR` or `Fetch`
4. Refresh করুন page

আপনি এরকম requests দেখতে পাবেন:

```
GET /api/storefront/v1/theme       200 OK
GET /api/storefront/v1/init        200 OK
GET /api/storefront/v1/products    200 OK
```

---

## 🎯 What's Next?

### Phase 1: Basic Integration ✅

- [x] Theme loading from backend
- [x] Shop configuration
- [x] Product listing

### Phase 2: Advanced Features

## 📱 Different Environments

**Local:**

```bash
PUBLIC_API_URL=http://localhost:3000
PUBLIC_USE_MOCK_DATA=false
```

**Production:**

```bash
PUBLIC_API_URL=https://api.zatiq.com
PUBLIC_SHOP_ID=shop_live_xxx
PUBLIC_USE_MOCK_DATA=false
```

---

**Happy Coding! 🚀**
