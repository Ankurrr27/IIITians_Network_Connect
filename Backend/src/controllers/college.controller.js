import College from "../models/College.model.js";
import cloudinary from "../config/cloudinary.js";

function normalizeClubLinks(input = []) {
  let normalizedInput = input;

  if (typeof normalizedInput === "string") {
    try {
      normalizedInput = JSON.parse(normalizedInput);
    } catch {
      normalizedInput = [];
    }
  }

  if (
    normalizedInput &&
    typeof normalizedInput === "object" &&
    !Array.isArray(normalizedInput)
  ) {
    normalizedInput = Object.values(normalizedInput);
  }

  if (!Array.isArray(normalizedInput)) return [];

  return normalizedInput
    .map((item) => ({
      name: (item?.name || "").trim(),
      url: (item?.url || "").trim(),
    }))
    .filter((item) => item.name && item.url);
}

export const createCollege = async (req, res) => {
  try {
    const college = await College.create({
      name: req.body.name,
      website: req.body.website,
      clubLink: req.body.clubLink,
      clubLinks: normalizeClubLinks(req.body.clubLinks),
      description: req.body.description,
    });
    res.status(201).json(college);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const allowedFields = ["name", "description", "website", "clubLink"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.clubLinks !== undefined) {
      updates.clubLinks = normalizeClubLinks(req.body.clubLinks);
    }

    const college = await College.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollegeLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Logo file is required" });
    }

    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    if (college.logo?.public_id) {
      await cloudinary.uploader.destroy(college.logo.public_id);
    }

    college.logo = {
      public_id: req.file.filename,
      url: req.file.path,
    };

    await college.save();

    res.status(200).json({
      message: "College logo updated successfully",
      logo: college.logo,
    });
  } catch (error) {
    console.error("updateCollegeLogo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCollegePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Photo file is required" });
    }

    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    if (college.photo?.public_id) {
      await cloudinary.uploader.destroy(college.photo.public_id);
    }

    college.photo = {
      public_id: req.file.filename,
      url: req.file.path,
    };

    await college.save();

    res.status(200).json({
      message: "College photo updated successfully",
      photo: college.photo,
    });
  } catch (error) {
    console.error("updateCollegePhoto error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addCollegeGallery = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    let captions = req.body.captions || req.body.caption || "";
    if (typeof captions === "string") {
      captions = [captions];
    }

    const images = req.files.map((file, index) => ({
      public_id: file.filename,
      url: file.path,
      caption: (Array.isArray(captions) ? captions[index] : captions) || captions[0] || "",
    }));

    const college = await College.findByIdAndUpdate(
      req.params.id,
      { $push: { gallery: { $each: images } } },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    console.error("addCollegeGallery error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCollegeGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const targetImage = college.gallery.find((img) => img.url === imageUrl);
    if (targetImage && targetImage.public_id) {
      await cloudinary.uploader.destroy(targetImage.public_id);
    }

    college.gallery = college.gallery.filter((img) => img.url !== imageUrl);
    await college.save();

    res.json(college);
  } catch (error) {
    console.error("deleteCollegeGalleryImage error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCollegeLogo = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    if (!college.logo || !college.logo.url) {
      return res.status(404).json({ message: "Logo not available" });
    }

    return res.redirect(college.logo.url);
  } catch (error) {
    console.error("getCollegeLogo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
