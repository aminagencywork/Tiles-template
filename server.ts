import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import ImageKit from "imagekit";
import { siteConfig } from "./src/config/siteConfig";

dotenv.config();

const PRODUCTS_FILE = path.join(process.cwd(), "products.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize ImageKit
let imagekit: ImageKit | null = null;
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(UPLOADS_DIR));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = siteConfig.adminPassword;

    if (password === adminPassword) {
      res.json({ success: true, token: "admin-token-mock" }); // Simple mock token
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  // Get Products
  app.get("/api/products", (req, res) => {
    try {
      const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to load products" });
    }
  });

  // Add Product
  app.post("/api/products", (req, res) => {
    try {
      const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
      const newProduct = {
        id: Date.now(),
        ...req.body,
      };
      products.push(newProduct);
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
      res.json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Failed to save product" });
    }
  });

  // Delete Product
  app.delete("/api/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      console.log('DELETE request for product ID:', id);
      const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
      console.log('Total products before delete:', products.length);
      
      const filteredProducts = products.filter((p: any) => p.id.toString() !== id.toString());
      console.log('Total products after filter:', filteredProducts.length);
      
      if (products.length === filteredProducts.length) {
        console.warn('Product not found for deletion:', id);
        return res.status(404).json({ error: "Product not found" });
      }

      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filteredProducts, null, 2));
      console.log('Product deleted successfully:', id);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Upload Image
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      if (imagekit) {
        const fileContent = fs.readFileSync(req.file.path);
        const uploadRes = await imagekit.upload({
          file: fileContent,
          fileName: req.file.filename,
          folder: "/products",
        });
        // Remove local file after upload to ImageKit
        fs.unlinkSync(req.file.path);
        return res.json({ imageUrl: uploadRes.url });
      }
      
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("ImageKit upload error:", error);
      // Fallback to local if ImageKit fails
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
