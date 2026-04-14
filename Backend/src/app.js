import express from "express";
import cors from "cors";
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

const app = express();

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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

app.use(express.json());

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

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    err.statusCode || (err.message === "Not allowed by CORS" ? 403 : 500);
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
});

export default app;
