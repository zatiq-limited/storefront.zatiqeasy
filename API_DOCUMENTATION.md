# ZATIQ STOREFRONT - API ENDPOINTS DOCUMENTATION

> **জরুরি নোট:** এই document টি Backend Developer এর জন্য তৈরি করা হয়েছে।  
> বর্তমানে প্রজেক্ট static data দিয়ে কাজ করছে। API integration এর জন্য `src/lib/api-client.ts` file এ TODO comment গুলো দেখুন।

## Base URL

```
Production: https://api.zatiq.com
Development: http://localhost:3000
```

## Authentication

সব API request এ following headers লাগবে:

```
X-Shop-Id: {shopId}
X-API-Key: {apiKey}
```

Cart operations এর জন্য:

```
X-Cart-Token: {cartToken}
```

---

## 1. Shop & Theme Configuration

### Get Shop Configuration

```http
GET /api/storefront/v1/init
```

**Query Parameters:**

- `shopId` (required): Shop identifier

**Response:**

```json
{
  "success": true,
  "data": {
    "shop": {
      "id": "shop_12345",
      "name": "Demo Store",
      "domain": "demo.zatiq.com",
      "locale": "en-US",
      "currency": {
        "code": "USD",
        "symbol": "$",
        "format": "${amount}"
      },
      "contact": { ... },
      "social": { ... }
    },
    "session": {
      "cartId": "cart_abc123",
      "customerId": null,
      "cartCount": 0
    }
  }
}
```

### Get Active Theme

```http
GET /api/storefront/v1/theme
```

**Query Parameters:**

- `shopId` (required): Shop identifier

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "theme_zatiq_modern_v3",
    "name": "Modern Theme",
    "version": "3.2.1",
    "globalSections": {
      "announcement": { ... },
      "header": { ... },
      "footer": { ... }
    },
    "templates": {
      "index": { ... },
      "product": { ... },
      "collection": { ... }
    },
    "designSystem": { ... }
  }
}
```

### Get Page Template

```http
GET /api/storefront/v1/page/:pageType
```

**Path Parameters:**

- `pageType`: 'index' | 'product' | 'collection' | 'cart'

**Response:**

```json
{
  "success": true,
  "data": {
    "template": {
      "name": "Homepage",
      "layout": "default",
      "sections": [
        {
          "id": "section_hero",
          "type": "hero-1",
          "enabled": true,
          "settings": { ... },
          "blocks": [ ... ]
        }
      ]
    },
    "pageData": { ... }
  }
}
```

---

## 2. Products

### List Products

```http
GET /api/storefront/v1/products
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `collection` (optional): Filter by collection handle
- `sort` (optional): 'price_asc' | 'price_desc' | 'title' | 'created'
- `tag` (optional): Filter by tag

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_001",
        "handle": "classic-tshirt",
        "title": "Classic T-Shirt",
        "description": "...",
        "price": 29.99,
        "compareAtPrice": 39.99,
        "images": ["url1", "url2"],
        "variants": [ ... ],
        "tags": ["new", "sale"],
        "vendor": "Brand Name",
        "type": "T-Shirts"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "hasNext": true
    }
  }
}
```

### Get Single Product

```http
GET /api/storefront/v1/products/:handle
```

**Path Parameters:**

- `handle`: Product URL handle

**Response:**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": "prod_001",
      "handle": "classic-tshirt",
      "title": "Classic T-Shirt",
      "description": "...",
      "price": 29.99,
      "variants": [
        {
          "id": "var_001",
          "title": "Small / Blue",
          "price": 29.99,
          "sku": "TS-S-BLU",
          "available": true,
          "options": {
            "Size": "Small",
            "Color": "Blue"
          }
        }
      ],
      "images": [ ... ],
      "metafields": { ... }
    }
  }
}
```

### Get Featured Products

```http
GET /api/storefront/v1/products/featured
```

**Query Parameters:**

- `limit` (optional): Number of products (default: 8)

**Response:** Same structure as List Products

### Get Product Recommendations

```http
GET /api/storefront/v1/products/recommendations
```

**Query Parameters:**

- `productId` (required): Product ID
- `limit` (optional): Number of recommendations (default: 4)

**Response:** Same structure as List Products

---

## 3. Collections

### List Collections

```http
GET /api/storefront/v1/collections
```

**Response:**

```json
{
  "success": true,
  "data": {
    "collections": [
      {
        "id": "col_001",
        "handle": "womens",
        "title": "Women's Collection",
        "description": "...",
        "image": "url",
        "productsCount": 45
      }
    ]
  }
}
```

### Get Collection with Products

```http
GET /api/storefront/v1/collections/:handle
```

**Path Parameters:**

- `handle`: Collection URL handle

**Query Parameters:**

- `page`, `limit`, `sort`: Same as products list

**Response:**

```json
{
  "success": true,
  "data": {
    "collection": {
      "id": "col_001",
      "handle": "womens",
      "title": "Women's Collection",
      "description": "...",
      "image": "url"
    },
    "products": [ ... ],
    "pagination": { ... }
  }
}
```

### Get Collection Filters

```http
GET /api/storefront/v1/collections/:handle/filters
```

**Response:**

```json
{
  "success": true,
  "data": {
    "filters": [
      {
        "id": "price",
        "label": "Price",
        "type": "range",
        "min": 0,
        "max": 500
      },
      {
        "id": "size",
        "label": "Size",
        "type": "list",
        "values": ["XS", "S", "M", "L", "XL"]
      }
    ]
  }
}
```

---

## 4. Cart Operations

### Get Cart

```http
GET /api/storefront/v1/cart
```

**Headers:**

- `X-Cart-Token`: Cart session token

**Response:**

```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "cart_abc123",
      "items": [
        {
          "id": "line_001",
          "variantId": "var_001",
          "productId": "prod_001",
          "title": "Classic T-Shirt",
          "variant": "Small / Blue",
          "quantity": 2,
          "price": 29.99,
          "linePrice": 59.98,
          "image": "url"
        }
      ],
      "itemCount": 2,
      "subtotal": 59.98,
      "total": 59.98
    }
  }
}
```

### Add to Cart

```http
POST /api/storefront/v1/cart/add
```

**Request Body:**

```json
{
  "variantId": "var_001",
  "quantity": 1
}
```

**Response:** Updated cart object

### Update Cart Item

```http
PUT /api/storefront/v1/cart/update
```

**Request Body:**

```json
{
  "lineItemId": "line_001",
  "quantity": 3
}
```

**Response:** Updated cart object

### Remove from Cart

```http
DELETE /api/storefront/v1/cart/remove
```

**Request Body:**

```json
{
  "lineItemId": "line_001"
}
```

**Response:** Updated cart object

---

## 5. Search

### Search Products

```http
GET /api/storefront/v1/search
```

**Query Parameters:**

- `q` (required): Search query
- `limit` (optional): Results limit (default: 20)

**Response:**

```json
{
  "success": true,
  "data": {
    "results": {
      "products": [ ... ],
      "collections": [ ... ],
      "pages": [ ... ]
    },
    "totalResults": 15
  }
}
```

### Get Search Suggestions

```http
GET /api/storefront/v1/search/suggestions
```

**Query Parameters:**

- `q` (required): Partial search query

**Response:**

```json
{
  "success": true,
  "data": {
    "suggestions": ["t-shirt", "t-shirt blue", "t-shirt classic"]
  }
}
```

---

## 6. Customer & Account

### Get Customer Data

```http
GET /api/storefront/v1/customer
```

**Headers:**

- `Authorization`: Bearer {customerToken}

**Response:**

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cust_001",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890"
    }
  }
}
```

### Get Order History

```http
GET /api/storefront/v1/customer/orders
```

**Headers:**

- `Authorization`: Bearer {customerToken}

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_001",
        "orderNumber": "1001",
        "createdAt": "2024-01-15T10:30:00Z",
        "status": "fulfilled",
        "total": 159.98,
        "items": [ ... ]
      }
    ]
  }
}
```

---

## 7. Content Pages

### Get Content Page

```http
GET /api/storefront/v1/pages/:handle
```

**Path Parameters:**

- `handle`: Page URL handle (e.g., 'about', 'contact')

**Response:**

```json
{
  "success": true,
  "data": {
    "page": {
      "id": "page_001",
      "handle": "about",
      "title": "About Us",
      "content": "HTML content...",
      "seo": { ... }
    }
  }
}
```

---

## Error Responses

সব API error এই format এ return করবে:

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found",
    "details": {}
  }
}
```

**Common Error Codes:**

- `SHOP_NOT_FOUND`: Shop doesn't exist
- `PRODUCT_NOT_FOUND`: Product not found
- `COLLECTION_NOT_FOUND`: Collection not found
- `INVALID_VARIANT`: Invalid product variant
- `CART_ERROR`: Cart operation failed
- `AUTHENTICATION_REQUIRED`: Customer login required
- `RATE_LIMIT_EXCEEDED`: Too many requests

---

## Implementation Notes

1. **Caching**: সব GET requests cacheable। Response এ `Cache-Control` headers আসবে।

2. **Rate Limiting**:

   - Anonymous: 100 requests/minute
   - Authenticated: 300 requests/minute

3. **Pagination**:

   - Default page size: 20
   - Max page size: 100

4. **Image URLs**:

   - সব image URLs CDN থেকে serve হবে
   - Format: `https://cdn.zatiq.com/shops/{shopId}/products/{image}`

5. **Webhooks** (Optional):
   - Cart updates
   - Order creation
   - Product availability changes

---

## Testing

Development environment:

```
BASE_URL=http://localhost:3000
SHOP_ID=shop_demo_12345
API_KEY=test_key_12345
```

Mock data file: `src/data/mock-theme.ts`, `src/data/mock-products.ts`

---

**Questions?** Contact: backend-team@zatiq.com
