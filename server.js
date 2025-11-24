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
  res.json(db.category);
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
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/product-details    - Product details page sections`);
  console.log(`\n✨ Press Ctrl+C to stop\n`);
});
