import Event from "../models/Events.model.js";
import College from "../models/College.model.js";
import DiscussAccount from "../models/discussAccount.model.js";
import cloudinary from "../config/cloudinary.js";
import { backfillApprovedDiscussEvents } from "../services/discussEventSync.service.js";

/* =========================
   HELPERS
========================= */
const ensureClubRegistered = async (collegeName, clubName, clubLink) => {
  if (!collegeName || !clubName) return;

  try {
    // 1. Check if club already has a Discuss account
    const discussAccount = await DiscussAccount.findOne({
      collegeName: { $regex: new RegExp(`^${collegeName.trim()}$`, "i") },
      clubName: { $regex: new RegExp(`^${clubName.trim()}$`, "i") },
      isAuthorized: true,
    });
    if (discussAccount) return;

    // 2. Check if already in College.clubLinks
    const college = await College.findOne({
      name: { $regex: new RegExp(`^${collegeName.trim()}$`, "i") },
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
   GET ALL EVENTS
========================= */
export const getEvents = async (req, res) => {
  try {
    await backfillApprovedDiscussEvents();
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
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

    const allowedFields = [
      "title",
      "description",
      "date",
      "collegeName",
      "clubName",
      "link",
    ];

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

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

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
