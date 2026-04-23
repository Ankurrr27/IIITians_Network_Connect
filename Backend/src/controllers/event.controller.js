import Event from "../models/Events.model.js";
import College from "../models/College.model.js";
import DiscussAccount from "../models/discussAccount.model.js";
import cloudinary from "../config/cloudinary.js";
import { backfillApprovedDiscussEvents } from "../services/discussEventSync.service.js";

const escapeRegex = (string) => {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
};

/* =========================
   HELPERS
========================= */
const ensureClubRegistered = async (collegeName, clubName, clubLink) => {
  if (!collegeName || !clubName) return;

  try {
    const discussAccount = await DiscussAccount.findOne({
      collegeName: { $regex: new RegExp(`^${escapeRegex(collegeName.trim())}$`, "i") },
      clubName: { $regex: new RegExp(`^${escapeRegex(clubName.trim())}$`, "i") },
      isAuthorized: true,
    });
    if (discussAccount) return;

    const college = await College.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(collegeName.trim())}$`, "i") },
    });
    if (!college) return;

    const exists = college.clubLinks.some(
      (link) =>
        (link.name || "").trim().toLowerCase() === clubName.trim().toLowerCase()
    );

    if (!exists) {
      college.clubLinks.push({ name: clubName, url: clubLink || "" });
      await college.save();
    }
  } catch (err) {
    console.error("ENSURE CLUB REGISTERED ERROR:", err);
  }
};

/* =========================
   CREATE EVENT
========================= */
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description = "",
      date,
      collegeName,
      clubName = "",
      link = "",
    } = req.body;

    if (!title || !date || !collegeName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let banner = null;
    if (req.file) {
      banner = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    const event = await Event.create({
      title,
      description,
      date,
      collegeName,
      clubName,
      link,
      banner,
    });

    res.status(201).json(event);
    await ensureClubRegistered(collegeName, clubName, link);
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL EVENTS (PAGINATED)
========================= */
export const getEvents = async (req, res) => {
  try {
    await backfillApprovedDiscussEvents();

    const { page = 1, limit = 10, search = "", sortBy = "newest" } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // 🔍 BUILD QUERY
    const query = {};
    if (search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      query.$or = [
        { title: regex },
        { collegeName: regex },
        { clubName: regex }
      ];
    }

    // 📊 SORTING
    let sortOptions = { date: -1 }; // default newest
    if (sortBy === "oldest") sortOptions = { date: 1 };
    if (sortBy === "az") sortOptions = { title: 1 };
    if (sortBy === "za") sortOptions = { title: -1 };

    const [events, total] = await Promise.all([
      Event.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Event.countDocuments(query),
    ]);

    res.json({
      events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("GET EVENTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET EVENT BY ID
========================= */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error("GET EVENT BY ID ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE EVENT
========================= */
export const updateEvent = async (req, res) => {
  try {
    const updateData = {};
    const allowedFields = ["title", "description", "date", "collegeName", "clubName", "link"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.file) {
      updateData.banner = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.collegeName && event.clubName) {
      await ensureClubRegistered(event.collegeName, event.clubName, event.link);
    }

    res.json(event);
  } catch (err) {
    console.error("UPDATE EVENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE EVENT
========================= */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.banner?.public_id) {
      try {
        await cloudinary.uploader.destroy(event.banner.public_id);
      } catch (err) {
        console.error("CLOUDINARY DELETE FAILED:", err.message);
      }
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("DELETE EVENT ERROR:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
