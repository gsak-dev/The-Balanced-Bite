// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import paymentRoute from "./routes/payment.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/users.js";
import ordersRoute from "./routes/orders.js";
import productsRoute from "./routes/products.js"; // ✅ FIXED: import instead of require
import db from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// ----------------------
// 🌐 Middleware
// ----------------------
app.use(cors());
app.use(express.json());

// ----------------------
// 🧩 API Routes
// ----------------------
app.use("/api/payment", paymentRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", ordersRoute);
app.use("/api/products", productsRoute); // ✅ FIXED: uses import

// ----------------------
// 🧁 Serve Frontend (public folder outside backend)
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

// Root route (homepage)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Stripe redirect pages
app.get("/success.html", (req, res) =>
  res.sendFile(path.join(publicPath, "success.html"))
);
app.get("/cancel.html", (req, res) =>
  res.sendFile(path.join(publicPath, "cancel.html"))
);

// ----------------------
// 🧠 Test DB connection route
// ----------------------
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS current_time");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Database test failed:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ----------------------
// 🚀 Start Server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));