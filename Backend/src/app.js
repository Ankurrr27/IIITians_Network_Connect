import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import placementRoutes from "./routes/placement.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import clubRoutes from "./routes/club.routes.js";
import eventRoutes from "./routes/event.routes.js";
import teamMemberRoutes from "./routes/teamMember.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import alumniRoutes from "./routes/alumni.routes.js";
import discussRoutes from "./routes/discuss.routes.js";
import discussAccountRoutes from "./routes/discussAccount.routes.js";
import appNotificationRoutes from "./routes/appNotification.routes.js";
import siteStatsRoutes from "./routes/siteStats.routes.js";
import adminLogRoutes from "./routes/adminLog.routes.js";

const app = express();

// Set trust proxy for Render/Vercel to correctly identify client IPs
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://iiitiansnetwork.in",
  "https://www.iiitiansnetwork.in",
  "http://iiitiansnetwork.in",
  "http://www.iiitiansnetwork.in",
  "https://iiitians-network-connect.vercel.app",
  "https://iiitians-network-connect.onrender.com",
  "https://iiitiansconnect.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// ✅ CORS must run FIRST — so all responses (including 429/404/500) have correct headers
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log CORS failure for debugging
        console.warn("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cache-Control",
      "Pragma",
    ],
    optionsSuccessStatus: 200,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 1000 : 5000, // limit each IP (much higher in dev)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT TRIGGERED] IP: ${req.ip} path: ${req.originalUrl}`);
    res.status(options.statusCode).json({ message: "Too many requests from this IP, please try again after 15 minutes", status: 429 });
  }
});

app.use("/api/", limiter);


// 🚀 PERFORMANCE & SECURITY MIDDLEWARE (after CORS)
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin resource sharing (CORS handles this)
  })
);
app.use(compression()); // Gzip/Brotli payload compression

app.use(express.json({ limit: "10kb" })); // Prevent large JSON payload attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/colleges", collegeRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/team", teamMemberRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/discuss", discussRoutes);
app.use("/api/discuss-accounts", discussAccountRoutes);
app.use("/api/app-notifications", appNotificationRoutes);
app.use("/api/site-stats", siteStatsRoutes);
app.use("/api/admin-logs", adminLogRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handle Multer/Cloudinary errors that use http_code instead of statusCode
  const statusCode =
    err.http_code || 
    err.statusCode || 
    (err.message === "Not allowed by CORS" ? 403 : 500);

  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message || "An unexpected error occurred";

  if (statusCode >= 500) {
    console.error("Server Error:", err);
  } else {
    console.warn("Request Error:", {
      statusCode,
      message: err.message,
      path: req.path
    });
  }

  res.status(statusCode).json({ 
    message,
    status: statusCode >= 500 ? "error" : "fail"
  });
});

export default app;
