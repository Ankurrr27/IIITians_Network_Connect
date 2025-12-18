import "./config/env.js";   // ✅ FIRST LINE, NO EXCEPTIONS
console.log(
  "ENV CHECK:",
  process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING"
);


import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import placementRoutes from "./routes/placement.routes.js";
import userRoutes from "./routes/user.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import clubRoutes from "./routes/club.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.send("Backend running"));

app.use("/api/users", userRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/placements", placementRoutes);

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
