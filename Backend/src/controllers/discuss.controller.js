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
      banner: req.file
        ? {
            public_id: req.file.filename,
            url: req.file.path,
          }
        : undefined,
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

    if (req.file) {
      const existingPost = await Discuss.findById(req.params.id);

      if (!existingPost) {
        return res.status(404).json({ message: "Discuss post not found" });
      }

      if (existingPost.banner?.public_id) {
        await cloudinary.uploader.destroy(existingPost.banner.public_id);
      }

      updates.banner = {
        public_id: req.file.filename,
        url: req.file.path,
      };
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

    if (post.banner?.public_id) {
      await cloudinary.uploader.destroy(post.banner.public_id);
    }

    res.json({ message: "Discuss post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
