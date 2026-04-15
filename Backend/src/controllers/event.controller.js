import Event from "../models/Events.model.js";
import cloudinary from "../config/cloudinary.js";
import { backfillApprovedDiscussEvents } from "../services/discussEventSync.service.js";

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
