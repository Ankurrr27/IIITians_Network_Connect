import { AdminLog } from "../models/AdminLog.model.js";

// Utility function to log actions from any other controller
export const logAdminAction = async ({ adminEmail, adminId, action, targetResource, targetId, details, ipAddress }) => {
  try {
    await AdminLog.create({
      adminEmail,
      adminId,
      action,
      targetResource,
      targetId,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
};

// Controller to fetch logs for the admin dashboard
export const getAdminLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [
        { adminEmail: regex },
        { action: regex },
        { details: regex },
        { targetResource: regex }
      ];
    }

    const logs = await AdminLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AdminLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    res.status(500).json({ success: false, message: "Server Error fetching logs" });
  }
};
