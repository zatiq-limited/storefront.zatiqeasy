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
  global: loadJSON("global.json"),
  homepage: loadJSON("homepage.json"),
  product: loadJSON("product.json"),
  category: loadJSON("category.json"),
  cart: loadJSON("cart.json"),
};

// Custom API routes
app.get("/api/storefront/v1/init", (req, res) => {
  res.json(db.theme_init);
});

app.get("/api/storefront/v1/theme", (req, res) => {
  res.json(db.global);
});

app.get("/api/storefront/v1/page/home", (req, res) => {
  res.json(db.homepage);
});

app.get("/api/storefront/v1/products/:handle", (req, res) => {
  res.json(db.product);
});

app.get("/api/storefront/v1/collections/:handle", (req, res) => {
  res.json(db.category);
});

app.get("/api/storefront/v1/cart", (req, res) => {
  res.json(db.cart);
});

// Direct access routes (for debugging)
app.get("/theme_init", (req, res) => res.json(db.theme_init));
app.get("/global", (req, res) => res.json(db.global));
app.get("/homepage", (req, res) => res.json(db.homepage));
app.get("/product", (req, res) => res.json(db.product));
app.get("/category", (req, res) => res.json(db.category));
app.get("/cart", (req, res) => res.json(db.cart));

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 JSON Server is running on http://localhost:${PORT}`);
  console.log(`\n📚 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/init`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/theme`);
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/page/home`);
  console.log(
    `   GET  http://localhost:${PORT}/api/storefront/v1/products/:handle`
  );
  console.log(
    `   GET  http://localhost:${PORT}/api/storefront/v1/collections/:handle`
  );
  console.log(`   GET  http://localhost:${PORT}/api/storefront/v1/cart`);
  console.log(`\n✨ Press Ctrl+C to stop\n`);
});
