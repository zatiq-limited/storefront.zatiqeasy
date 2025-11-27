import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load JSON files directly from src/data/api-responses
const loadJSON = (filename) => {
  const filePath = path.join(__dirname, "src/data/api-responses", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const db = {
  theme_init: loadJSON("theme_init.json"),
  theme: loadJSON("theme.json"),
  homepage: loadJSON("homepage.json"),
  products: loadJSON("products.json"),
  product: loadJSON("product.json"),
  category: loadJSON("category.json"),
  productsPage: loadJSON("products-page.json"),
  productDetailsPage: loadJSON("product-details-page.json"),
  collectionsPage: loadJSON("collections-page.json"),
  collectionDetailsPage: loadJSON("collection-details-page.json"),
  about: loadJSON("about.json"),
  checkoutPage: loadJSON("checkout-page.json"),
  order: loadJSON("order.json"),
  promoCode: loadJSON("promo-code.json"),
  contact: loadJSON("contact.json"),
  orderSuccess: loadJSON("order-success.json"),
};

// Custom API routes
app.get("/api/storefront/v1/init", (req, res) => {
  res.json(db.theme_init);
});

app.get("/api/storefront/v1/theme", (req, res) => {
  res.json(db.theme);
});

app.get("/api/storefront/v1/page/home", (req, res) => {
  res.json(db.homepage);
});

// Products page endpoint (sections + products combined)
app.get("/api/storefront/v1/page/products", (req, res) => {
  const { page = 1, per_page = 20, category, search, sort } = req.query;

  // Combine page sections with products data
  const productsPageData = db.productsPage;
  const productsData = db.products;

  // Merge products into the response
  const response = {
    success: true,
    data: {
      ...productsPageData.data,
      products: productsData.data.products,
      pagination: productsData.data.pagination,
      // Pass query params for components to use
      filters: {
        page: parseInt(page),
        category: category || null,
        search: search || null,
        sort: sort || "featured",
      },
    },
  };

  res.json(response);
});

// Collections page endpoint (sections + collections combined)
app.get("/api/storefront/v1/page/collections", (req, res) => {
  // Combine page sections with category data (collections)
  const collectionsPageData = db.collectionsPage;
  const categoryData = db.category;

  // Merge collections into the response
  const response = {
    success: true,
    data: {
      ...collectionsPageData.data,
      collections: categoryData.data.categories, // Using category data as collections
    },
  };

  res.json(response);
});

// About page endpoint
app.get("/api/storefront/v1/page/about", (req, res) => {
  res.json(db.about);
});

// Checkout page endpoint (sections + order + payment methods combined)
app.get("/api/storefront/v1/page/checkout", (_req, res) => {
  const checkoutPageData = db.checkoutPage;
  const orderData = db.order;

  // Merge order into the checkout page response
  const response = {
    success: true,
    data: {
      ...checkoutPageData.data,
      order: orderData.data.order,
    },
  };

  res.json(response);
});

// Promo code validation endpoint
app.get("/api/promo-code", (req, res) => {
  const { code } = req.query;

  // In real backend, validate the code against database
  // For now, return mock data
  if (code === "WELCOME10") {
    res.json(db.promoCode);
  } else {
    res.json({
      success: false,
      data: {
        promo_code: {
          applicable: false,
          message: "Invalid promo code",
        },
      },
    });
  }
});
// Contact page endpoint
app.get("/api/storefront/v1/page/contact", (req, res) => {
  res.json(db.contact);
});

// Order Success page endpoint
app.get("/api/storefront/v1/page/order-success", (req, res) => {
  res.json(db.orderSuccess);
});

// Product list endpoint with query support
app.get("/api/storefront/v1/products", (req, res) => {
  const { page = 1, per_page = 20, category, search, sort } = req.query;
  // Return products list (in real backend, this would filter/paginate)
  res.json(db.products);
});

// Single product detail endpoint
app.get("/api/storefront/v1/products/:handle", (req, res) => {
  const { handle } = req.params;
  // Return single product detail (in real backend, this would find by handle)
  res.json(db.product);
});

// Collections list endpoint
app.get("/api/storefront/v1/collections", (req, res) => {
  res.json(db.category);
});

// Single collection detail endpoint
app.get("/api/storefront/v1/collections/:handle", (req, res) => {
  const { handle } = req.params;
  // Return single collection with products (in real backend, this would find by handle)
  res.json(db.collectionDetailsPage);
});

app.get("/api/storefront/v1/cart", (req, res) => {
  res.json(db.cart);
});

// Product details page sections endpoint
app.get("/api/storefront/v1/page/product-details", (req, res) => {
  res.json(db.productDetailsPage);
});

// Direct access routes (for debugging)
app.get("/theme_init", (req, res) => res.json(db.theme_init));
app.get("/homepage", (req, res) => res.json(db.homepage));
app.get("/products", (req, res) => res.json(db.products));
app.get("/product", (req, res) => res.json(db.product));
app.get("/category", (req, res) => res.json(db.category));
app.get("/products-page", (req, res) => res.json(db.productsPage));
app.get("/collections-page", (req, res) => res.json(db.collectionsPage));

// Direct access routes (for debugging)
app.get("/about", (_req, res) => res.json(db.about));
app.get("/checkout", (_req, res) => res.json(db.checkoutPage));
app.get("/order", (_req, res) => res.json(db.order));
app.get("/promo-code", (_req, res) => res.json(db.promoCode));
app.get("/contact", (req, res) => res.json(db.contact));
app.get("/order-success", (req, res) => res.json(db.orderSuccess));

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 JSON Server is running on http://localhost:${PORT}`);
  console.log(`\n📚 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/init`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/theme`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/home`);
  console.log(
    `   GET  http://localhost:${PORT}/api/storefront/v1/products                    - List all products`
  );
  console.log(
    `   GET  http://localhost:${PORT}/api/storefront/v1/products/:handle             - Single product detail`
  );
  console.log(
    `   GET  http://localhost:${PORT}/api/storefront/v1/collections                  - List all collections`
  );
  console.log(
    `   GET  http://localhost:${PORT}/api/storefront/v1/collections/:handle          - Single collection detail`
  );
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/cart`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/products           - Products page sections`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/collections        - Collections page sections`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/about              - About page sections`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/checkout           - Checkout page sections`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/contact            - Contact page sections`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/order-success      - Order success page sections`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/product-details    - Product details page sections`);
  console.log(`   GET  http://localhost:${PORT}/api/promo-code?code=WELCOME10              - Validate promo code`);
  console.log(`\n✨ Press Ctrl+C to stop\n`);
});
