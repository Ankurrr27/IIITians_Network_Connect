import AppNotification from "../models/appNotification.model.js";

async function getSingletonNotification() {
  let notification = await AppNotification.findOne().sort({ updatedAt: -1, createdAt: -1 });

  if (!notification) {
    notification = await AppNotification.create({
      title: "",
      message: "",
      type: "milestone",
      isActive: false,
      showOnEntry: true,
    });
  }

  return notification;
}

export const getPublicActiveAppNotification = async (req, res) => {
  try {
    const notification = await AppNotification.findOne({
      isActive: true,
      showOnEntry: true,
      title: { $ne: "" },
      message: { $ne: "" },
    }).sort({ updatedAt: -1, createdAt: -1 });

    if (!notification) {
      return res.json(null);
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminAppNotification = async (req, res) => {
  try {
    const notification = await getSingletonNotification();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertAdminAppNotification = async (req, res) => {
  try {
    const notification = await getSingletonNotification();

    const allowedFields = ["title", "message", "type", "isActive", "showOnEntry"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        notification[field] = req.body[field];
      }
    });

    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
