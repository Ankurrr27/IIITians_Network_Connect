import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "colleges",
    format: async (req, file) => {
      // If the file is HEIC, convert it to JPG for browser compatibility
      if (file.mimetype === "image/heic" || file.originalname.toLowerCase().endsWith(".heic")) {
        return "jpg";
      }
      return undefined; // Let Cloudinary handle other formats naturally
    },
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

export const upload = multer({ storage });
