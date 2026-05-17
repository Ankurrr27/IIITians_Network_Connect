import jwt from "jsonwebtoken";

export default function adminAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  if (!process.env.JWT_SECRET)
    return res.status(500).json({ message: "JWT_SECRET not configured" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    req.adminRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
