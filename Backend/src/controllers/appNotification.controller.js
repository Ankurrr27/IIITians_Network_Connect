import AppNotification from "../models/appNotification.model.js";

const allowedFields = [
  "title",
  "message",
  "type",
  "colorTone",
  "order",
  "isActive",
  "showOnEntry",
];

function assignFields(notification, payload = {}) {
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      notification[field] = payload[field];
    }
  });
}

export const getPublicActiveAppNotification = async (req, res) => {
  try {
    const notifications = await AppNotification.find({
      isActive: true,
      showOnEntry: true,
      title: { $ne: "" },
      message: { $ne: "" },
    }).sort({ order: 1, updatedAt: -1, createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminAppNotifications = async (req, res) => {
  try {
    const notifications = await AppNotification.find().sort({
      order: 1,
      updatedAt: -1,
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdminAppNotification = async (req, res) => {
  try {
    const lastNotification = await AppNotification.findOne().sort({
      order: -1,
      createdAt: -1,
    });

    const notification = new AppNotification({
      title: "",
      message: "",
      type: "milestone",
      colorTone: "indigo",
      order: lastNotification ? Number(lastNotification.order || 0) + 1 : 1,
      isActive: false,
      showOnEntry: true,
    });

    assignFields(notification, req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAdminAppNotification = async (req, res) => {
  try {
    const notification = await AppNotification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    assignFields(notification, req.body);
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
