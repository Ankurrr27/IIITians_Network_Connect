import Discuss from "../models/discuss.model.js";
import DiscussAccount from "../models/discussAccount.model.js";
import Event from "../models/Events.model.js";
import cloudinary from "../config/cloudinary.js";
import { syncDiscussPostToEvent } from "../services/discussEventSync.service.js";

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
    "eventDate",
    "status",
];

const buildUploadedPhotos = (req) =>
  (req.files || []).map((file) => ({
    public_id: file.filename,
    url: file.path,
  }));

const removePostAssets = async (post) => {
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
};

export const createDiscussPost = async (req, res) => {
  try {
    const account = await DiscussAccount.findById(req.discussAccountId);
    if (!account) {
      return res.status(404).json({ message: "Discuss account not found" });
    }

    const isPrivilegedRole = ["club_manager", "publisher"].includes(account.role);
    const shouldAutoApprove = account.isAuthorized && isPrivilegedRole;

    const uploadedPhotos = buildUploadedPhotos(req);

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
      eventDate: req.body.eventDate || null,
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

    await syncDiscussPostToEvent(post);

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

export const getMyDiscussPosts = async (req, res) => {
  try {
    const posts = await Discuss.find({ account: req.discussAccountId }).sort({
      createdAt: -1,
    });

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

      await removePostAssets(existingPost);

      const uploadedPhotos = buildUploadedPhotos(req);

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

    await syncDiscussPostToEvent(post);
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMyDiscussPost = async (req, res) => {
  try {
    const post = await Discuss.findOne({
      _id: req.params.id,
      account: req.discussAccountId,
    });

    if (!post) {
      return res.status(404).json({ message: "Discuss post not found" });
    }

    const allowedFields = [
      "title",
      "description",
      "type",
      "actionLink",
      "eventDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    if (req.files && req.files.length > 0) {
      await removePostAssets(post);
      const uploadedPhotos = buildUploadedPhotos(req);
      post.photos = uploadedPhotos;
      post.banner = uploadedPhotos[0] || undefined;
    }

    const account = await DiscussAccount.findById(req.discussAccountId);
    const isPrivilegedRole = ["club_manager", "publisher"].includes(account?.role);
    post.status = account?.isAuthorized && isPrivilegedRole ? "approved" : "pending";
    post.isAuthorisedPost = Boolean(account?.isAuthorized);
    post.badgeLabel = account?.badgeLabel || post.badgeLabel;
    post.accountRole = account?.role || post.accountRole;

    await post.save();
    await syncDiscussPostToEvent(post);
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

    await Event.findOneAndDelete({ sourceDiscussPostId: post._id });
    await removePostAssets(post);

    res.json({ message: "Discuss post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
