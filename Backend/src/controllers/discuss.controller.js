import Discuss from "../models/discuss.model.js";
import DiscussAccount from "../models/discussAccount.model.js";
import cloudinary from "../config/cloudinary.js";

const writableFields = [
  "title",
  "description",
  "type",
  "collegeName",
  "clubName",
    "contactName",
    "contactEmail",
    "contactPhone",
    "actionLink",
    "status",
];

export const createDiscussPost = async (req, res) => {
  try {
    const account = await DiscussAccount.findById(req.discussAccountId);
    if (!account) {
      return res.status(404).json({ message: "Discuss account not found" });
    }

    const isPrivilegedRole = ["club_manager", "publisher"].includes(account.role);
    const shouldAutoApprove = account.isAuthorized && isPrivilegedRole;

    const uploadedPhotos = (req.files || []).map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));

    const post = await Discuss.create({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type || "announcement",
      collegeName: account.collegeName,
      clubName: account.clubName,
      contactName: account.contactName,
      contactEmail: account.email,
      contactPhone: account.contactPhone,
      actionLink: req.body.actionLink,
      banner: uploadedPhotos[0]
        ? uploadedPhotos[0]
        : req.file
        ? {
            public_id: req.file.filename,
            url: req.file.path,
          }
        : undefined,
      photos: uploadedPhotos,
      account: account._id,
      accountRole: account.role,
      isAuthorisedPost: account.isAuthorized,
      badgeLabel: account.badgeLabel,
      status: shouldAutoApprove ? "approved" : "pending",
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getApprovedDiscussPosts = async (req, res) => {
  try {
    const posts = await Discuss.find({ status: "approved" }).sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDiscussPosts = async (req, res) => {
  try {
    const posts = await Discuss.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDiscussPost = async (req, res) => {
  try {
    const updates = {};

    writableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.file || (req.files && req.files.length > 0)) {
      const existingPost = await Discuss.findById(req.params.id);

      if (!existingPost) {
        return res.status(404).json({ message: "Discuss post not found" });
      }

      if (existingPost.banner?.public_id) {
        await cloudinary.uploader.destroy(existingPost.banner.public_id);
      }

      if (Array.isArray(existingPost.photos)) {
        await Promise.all(
          existingPost.photos
            .filter((photo) => photo?.public_id)
            .map((photo) => cloudinary.uploader.destroy(photo.public_id))
        );
      }

      const uploadedPhotos = (req.files || []).map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));

      if (uploadedPhotos.length > 0) {
        updates.photos = uploadedPhotos;
        updates.banner = uploadedPhotos[0];
      } else if (req.file) {
        updates.banner = {
          public_id: req.file.filename,
          url: req.file.path,
        };
        updates.photos = [updates.banner];
      }
    }

    const post = await Discuss.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Discuss post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDiscussPost = async (req, res) => {
  try {
    const post = await Discuss.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Discuss post not found" });
    }

    const imageIds = new Set();
    if (post.banner?.public_id) imageIds.add(post.banner.public_id);
    if (Array.isArray(post.photos)) {
      post.photos.forEach((photo) => {
        if (photo?.public_id) imageIds.add(photo.public_id);
      });
    }

    await Promise.all(
      Array.from(imageIds).map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    res.json({ message: "Discuss post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
